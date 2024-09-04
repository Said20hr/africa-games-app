import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BottomSheetModalInput,
  Button,
  Container,
  Input,
} from "@/components/ui";
import Text from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Table from "@/components/Table";
import { i18n } from "@/constants/i18n";
import TabbedScrollView from "@/components/ui/TabbedScrollView";
import { fontPixel, heightPixel } from "@/shared/util/normalise";
import { useNavigation } from "expo-router";
import { Plus, X } from "react-native-feather";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Money } from "@/assets/icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/ctx";
import axios from "axios";
import Toast from "react-native-toast-message";
import { queryClient } from "@/api/query-client";

const sections = ["provisions", "withdrawals"];
const SCREEN_WIDTH = Dimensions.get("screen").width;

type FileEntry = {
  name: string;
  date: string;
  amount: string;
  status: string;
};

type MovementTableProps = {
  data: FileEntry[] | undefined;
  emptyText: string;
  isProvisions: boolean;
  refetch: () => Promise<void>;
};

const MovementTable = ({
  data,
  emptyText,
  isProvisions = true,
  refetch,
}: MovementTableProps) => {
  const { accent, text, background, black } = useThemeColor();
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const renderItem = useCallback(
    ({ item, index }: { item: FileEntry; index: number }) => {
      return (
        <View
          style={[
            styles.tableRow,
            !data || data.length === index + 1 ? null : styles.tableRowBorder,
          ]}
          key={`${item.amount} ${item.name} ${index}`}
        >
          <Text
            type="InputText"
            style={[styles.tableCell, { color: text, marginLeft: 8 }]}
          >
            {isProvisions ? item.from : item.to}
          </Text>
          <Text type="InputText" style={[styles.tableCell, { color: text }]}>
            {item.amount} XAF
          </Text>
          <View
            style={[
              styles.tableCell,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <View
              style={{
                backgroundColor:
                  i18n
                    .t(`movements.${item.status.toLowerCase()}`)
                    .toLowerCase() === i18n.t("movements.pending").toLowerCase()
                    ? "#CA9203"
                    : i18n
                        .t(`movements.${item.status.toLowerCase()}`)
                        .toLowerCase() ===
                      i18n.t("movements.refused").toLowerCase()
                    ? "#FF0000"
                    : "#00560E",
                borderRadius: 6,
                width: "90%",
                height: heightPixel(24),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                type="SubtitleLight"
                style={{
                  color: text,
                  textAlign: "center",
                  fontSize: fontPixel(12),
                }}
              >
                {i18n.t(`movements.${item.status.toLowerCase()}`)}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [data]
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.tableContainer,
        { backgroundColor: !data || data.length === 0 ? black : background },
      ]}
      style={{ backgroundColor: black, borderRadius: 12 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!data || data.length === 0 ? (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{emptyText}</Text>
        </View>
      ) : (
        <>
          <View style={[styles.tableRow, styles.tableHeaderBorder]}>
            <Text
              type="BodySmall"
              style={[
                styles.tableCell,
                {
                  textAlign: "left",
                  color: accent,
                  fontSize: fontPixel(12),
                  marginLeft: 8,
                },
              ]}
            >
              {isProvisions
                ? i18n.t("movements.tableHeaders.from")
                : i18n.t("movements.tableHeaders.to")}
            </Text>
            <Text
              type="BodySmall"
              style={[
                styles.tableCell,
                { textAlign: "left", color: accent, fontSize: fontPixel(12) },
              ]}
            >
              {i18n.t("movements.tableHeaders.amount")}
            </Text>
            <View
              style={[
                styles.tableCell,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <View
                style={{
                  width: "90%",
                  alignSelf: "flex-end",
                }}
              >
                <Text
                  type="BodySmall"
                  style={{
                    textAlign: "left",
                    color: accent,
                    fontSize: fontPixel(12),
                  }}
                >
                  {i18n.t("movements.tableHeaders.status")}
                </Text>
              </View>
            </View>
          </View>
          {/* <FlatList data={data} renderItem={renderItem} extraData={true} /> */}
          {data.map((item, index) => renderItem({ item, index }))}
        </>
      )}
    </ScrollView>
  );
};

export default function MovementScreen() {
  const { setOptions } = useNavigation();
  const { primary, text } = useThemeColor();
  const modalRef = useRef<BottomSheetModal>(null);
  const { locale } = useTranslation();
  const { session } = useSession();
  const [provisions, setProvisions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const {
    data: provisionsData,
    error: provisionsError,
    refetch: provisionsRefetch,
  } = useQuery({
    queryKey: ["provisions"],
    queryFn: async () => {
      try {
        const token = session?.user.token;
        if (!token || token === "") return null;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/provisions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProvisions(response.data.provisions);
        return response.data.provisions;
      } catch (error) {}
    },
  });
  const {
    data: withdrawalsData,
    error: withdrawalsError,
    refetch: withdrawalsRefetch,
  } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      try {
        const token = session?.user.token;
        if (!token || token === "") return null;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/withdrawals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.withdrawals;
      } catch (error) {}
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setProvisions([...provisions]);
    setWithdrawals([...withdrawals]);
  }, [locale]);

  useEffect(() => {
    if (!withdrawalsData || withdrawalsError) return;
    setWithdrawals(withdrawalsData);
  }, [withdrawalsData, withdrawalsError]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (amount: number) => {
      try {
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/provisions`,
          {
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );

        Toast.show({
          type: "success",
          text1: i18n.t("movements.provisionRequestToast"),
        });
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        )
          Toast.show({ type: "error", text1: error.message });
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["provisions"] });
    },
  });

  function openAddProvisionModal() {
    modalRef?.current?.present();
  }

  // useEffect(() => {
  //   console.log(provisionsData);
  // }, [provisionsData]);

  // useEffect(() => {
  //   console.log("FILE ENTRIES");
  //   setProvisionsData([...fileEntriesProvisions]);
  // }, [locale]);

  function handleProvisionSubmission(value: string) {
    mutate(parseFloat(value));
  }

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <>
          {activeIndex === 0 && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: primary,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                borderRadius: 100,
                marginRight: 20,
              }}
              onPress={openAddProvisionModal}
            >
              <Plus color={text} width={16} />
              <Text type="InputText">
                {i18n.t("movements.addProvision.buttonText")}{" "}
                {i18n.t("movements.provisions")}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ),
    });
  }, [activeIndex]);

  return (
    <Container style={{ paddingTop: 20, paddingHorizontal: 0 }}>
      <TabbedScrollView
        tabs={[
          { key: "provisions", title: "movements.provisions" },
          { key: "movements", title: "movements.withdrawals" },
        ]}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <View
          style={{
            padding: 12,
            width: SCREEN_WIDTH,
          }}
        >
          <MovementTable
            data={provisions}
            emptyText={i18n.t("movements.emptyProvisions")}
            isProvisions
            refetch={async () => {
              await provisionsRefetch();
            }}
          />
        </View>
        <View
          style={{
            padding: 12,
            width: SCREEN_WIDTH,
          }}
        >
          <MovementTable
            data={withdrawals}
            emptyText={i18n.t("movements.emptyWithdrawals")}
            isProvisions={false}
            refetch={async () => {
              await withdrawalsRefetch();
            }}
          />
        </View>
      </TabbedScrollView>
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        {/* <FlatList
          style={{ width: SCREEN_WIDTH / 1.3 }}
          data={sections}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.sectionButton,
                {
                  backgroundColor: activeIndex === index ? primary : background,
                },
              ]}
              onPress={() => setActiveIndex(index)}
            >
              <Text type="default">{i18n.t(`movements.${item}`)}</Text>
            </TouchableOpacity>
          )}
          horizontal
          contentContainerStyle={styles.contentContainerStyle}
        /> */}
      </View>
      <BottomSheetModalInput
        ref={modalRef}
        buttonText={i18n.t("movements.addProvision.buttonText")}
        label={i18n.t("movements.addProvision.label")}
        title={i18n.t("movements.addProvision.title")}
        inputProps={{
          placeholder: i18n.t("movements.addProvision.placeholder"),
          InitialIcon: <Money stroke={text} />,
          keyboardType: "number-pad",
        }}
        handleSubmission={handleProvisionSubmission}
        buttonLoading={isPending}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    paddingHorizontal: 20,
    paddingTop: heightPixel(10),
    borderRadius: 12,
    paddingBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
  },
  tableHeaderBorder: {
    borderBottomColor: "#9E9D9D",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  tableRowBorder: {
    borderBottomColor: "#272727",
    borderBottomWidth: 1,
  },
});
