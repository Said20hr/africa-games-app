import React, {
  ForwardedRef,
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

const sections = ["provisions", "withdrawals"];
const SCREEN_WIDTH = Dimensions.get("screen").width;

type FileEntry = {
  name: string;
  date: string;
  amount: string;
  status: string;
};

const fileEntriesWithdrawals: FileEntry[] = [
  {
    name: "File 04",
    date: "2024-07-01",
    amount: "1500 XAF",
    status: i18n.t("movements.accepted"),
  },
  {
    name: "File 05",
    date: "2024-07-02",
    amount: "10 XAF",
    status: i18n.t("movements.accepted"),
  },
  {
    name: "File 06",
    date: "2024-07-03",
    amount: "900 XAF",
    status: i18n.t("movements.refused"),
  },
];

type MovementTableProps = {
  data: FileEntry[];
};

const MovementTable = ({ data }: MovementTableProps) => {
  const { accent, text, background } = useThemeColor();

  const renderItem = useCallback(
    ({ item, index }: { item: FileEntry; index: number }) => {
      return (
        <View
          style={[
            styles.tableRow,
            data.length === index + 1 ? null : styles.tableRowBorder,
          ]}
        >
          <Text
            type="InputText"
            style={[styles.tableCell, { color: text, textAlign: "left" }]}
          >
            {item.name} {"\n"}
            {item.date}
          </Text>
          <Text type="InputText" style={[styles.tableCell, { color: text }]}>
            {item.amount}
          </Text>
          <View
            style={{
              backgroundColor:
                item.status === i18n.t("movements.accepted")
                  ? "#00560E"
                  : item.status === i18n.t("movements.pending")
                  ? "#FFB800"
                  : "#FF0000",
              borderRadius: 6,
              width: "30%",
              height: heightPixel(24),
            }}
          >
            <Text
              type="InputText"
              style={[styles.tableCell, { color: text, textAlign: "center" }]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      );
    },
    []
  );
  return (
    <View style={[styles.tableContainer, { backgroundColor: background }]}>
      <View style={[styles.tableRow, styles.tableHeaderBorder]}>
        <Text
          type="BodySmall"
          style={[
            styles.tableCell,
            { textAlign: "center", color: accent, fontSize: fontPixel(12) },
          ]}
        >
          {i18n.t("movements.tableHeaders.name")}
        </Text>
        <Text
          type="BodySmall"
          style={[
            styles.tableCell,
            { textAlign: "center", color: accent, fontSize: fontPixel(12) },
          ]}
        >
          {i18n.t("movements.tableHeaders.amount")}
        </Text>
        <Text
          type="BodySmall"
          style={[
            styles.tableCell,
            { textAlign: "center", color: accent, fontSize: fontPixel(12) },
          ]}
        >
          {i18n.t("movements.tableHeaders.status")}
        </Text>
      </View>
      <FlatList data={data} renderItem={renderItem} extraData={true} />
    </View>
  );
};

export default function ProfileScreen() {
  const { setOptions } = useNavigation();
  const { primary, text } = useThemeColor();
  const modalRef = useRef<BottomSheetModal>(null);
  const { locale } = useTranslation();
  let fileEntriesProvisions: FileEntry[] = [
    {
      name: "File 01",
      date: "2024-06-01",
      amount: "5399300 XAF",
      status: i18n.t("movements.pending"),
    },
    {
      name: "File 02",
      date: "2024-06-02",
      amount: "13838000 XAF",
      status: i18n.t("movements.accepted"),
    },
    {
      name: "File 03",
      date: "2024-06-03",
      amount: "9000 XAF",
      status: i18n.t("movements.refused"),
    },
  ];
  const [provisionsData, setProvisionsData] = useState<FileEntry[]>(
    fileEntriesProvisions
  );

  function openAddProvisionModal() {
    modalRef?.current?.present();
  }

  useEffect(() => {
    console.log(provisionsData);
  }, [provisionsData]);

  useEffect(() => {
    console.log("FILE ENTRIES");
    setProvisionsData([...fileEntriesProvisions]);
  }, [locale]);

  function handleProvisionSubmission(value: string) {
    fileEntriesProvisions = [
      ...fileEntriesProvisions,
      {
        amount: `${value} XAF`,
        status: i18n.t("movements.pending"),
        name: "File 04",
        date: new Date().toISOString().split("T")[0],
      },
    ];
    setProvisionsData(fileEntriesProvisions);
  }

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
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
      ),
    });
  }, []);

  return (
    <Container style={{ paddingTop: 20, paddingHorizontal: 0 }}>
      <TabbedScrollView
        tabs={[
          { key: "provisions", title: "movements.provisions" },
          { key: "movements", title: "movements.withdrawals" },
        ]}
      >
        <View
          style={{
            padding: 12,
            width: SCREEN_WIDTH,
          }}
        >
          <MovementTable data={provisionsData} />
        </View>
        <View
          style={{
            padding: 12,
            width: SCREEN_WIDTH,
          }}
        >
          <MovementTable data={fileEntriesWithdrawals} />
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
        buttonText={i18n.t("movements.addProvision.buttonText")}
        label={i18n.t("movements.addProvision.label")}
        title={i18n.t("movements.addProvision.title")}
        inputProps={{
          placeholder: i18n.t("movements.addProvision.placeholder"),
          InitialIcon: <Money stroke={text} />,
        }}
        modalRef={modalRef}
        handleSubmission={handleProvisionSubmission}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    borderRadius: 12,
    paddingBottom: 10,
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
    paddingBottom: 16,
  },
  tableRowBorder: {
    borderBottomColor: "#272727",
    borderBottomWidth: 1,
  },
});
