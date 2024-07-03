import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  ViewProps,
  ModalProps,
  Modal,
  ViewStyle,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Text from "@/components/ThemedText";
import Header from "@/components/Header";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Users,
  X,
} from "react-native-feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useStatusBar } from "@/hooks/useStatusBar";
import { Colors } from "@/constants/Colors";
import useSafeAreaInsets from "@/hooks/useSafeArea";
import { LinearGradient } from "expo-linear-gradient";
import Table from "@/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/ctx";
import axios from "axios";
import { fontPixel, heightPixel, widthPixel } from "@/shared/util/normalise";
import { File, Suitcase, TwoUsers } from "@/assets/icons";
import { i18n } from "@/constants/i18n";
import { LanguageOptions } from "@/shared/type/Utils.type";
import { useTranslation } from "@/hooks/useTranslation";
import Toast from "react-native-toast-message";
// import { useTranslation } from "@/hooks/useTranslation";

type InfoCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: JSX.Element;
  containerStyle?: ViewStyle;
};

interface WithdrawalRequestModalProps extends ModalProps {
  onCancel: () => void;
  onApprove: () => void;
  onClose: () => void;
  from: string;
  to: string;
  date: string;
  id: string;
  amount: string;
}

const WithdrawalRequestModal = (props: WithdrawalRequestModalProps) => {
  const { primary, background, text, accent, danger } = useThemeColor();
  const { session } = useSession();
  const { onCancel, onClose, onApprove, amount, date, from, id, to } = props;
  const [selectedAction, setSelectedAction] = useState<
    "refuse" | "accept" | "null"
  >("null");
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: String;
      action: "accept" | "refuse";
    }) => {
      try {
        const res = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/withdrawals/${id}/${action}`,
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
          text1: res.data.message,
        });
        if (action === "accept") onApprove();
        else onCancel();
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        )
          Toast.show({ type: "error", text1: error.message });
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (selectedAction === "accept") mutate({ action: "accept", id });
    else if (selectedAction === "refuse") mutate({ action: "refuse", id });
  }, [selectedAction]);

  function hanldeApprove() {
    setSelectedAction("accept");
  }

  function handleCancel() {
    setSelectedAction("refuse");
  }

  return (
    <Modal {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <View
          style={{
            backgroundColor: background,
            width: "90%",
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: heightPixel(17),
            borderRadius: 12,
          }}
        >
          <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={onClose}>
            <X color={text} />
          </TouchableOpacity>
          <LinearGradient
            colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
            style={[styles.content, { backgroundColor: primary }]}
          >
            <Text type="DateLargeHeavy" style={{ marginBottom: 12 }}>
              {new Date(date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
                .toUpperCase()}
            </Text>
            <Text type="TimeMedium">
              {new Date(date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </LinearGradient>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">FROM:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              {from}
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">TO:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              {to}
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">AMOUNT:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              {amount} XAF
            </Text>
          </View>
          <View style={[styles.spacedRow, { gap: 40, marginTop: 20 }]}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: danger, height: heightPixel(32) },
              ]}
              onPress={handleCancel}
            >
              {selectedAction === "refuse" && isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <X color={text} width={16} strokeWidth={3} />
                  <Text type="HeadingBoldSmall">{i18n.t("home.cancel")}</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: "#2DCA50", height: heightPixel(32) },
              ]}
              onPress={hanldeApprove}
            >
              {selectedAction === "accept" && isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Check color={text} width={16} strokeWidth={3} />
                  <Text type="HeadingBoldSmall">{i18n.t("home.approve")}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const InfoCard = ({
  title,
  value,
  icon,
  action,
  children,
  containerStyle,
}: InfoCardProps) => {
  const { background, text, primary } = useThemeColor();

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: background },
        containerStyle,
      ]}
    >
      <>
        <View
          style={[
            styles.headerInfoContainer,
            {
              marginBottom:
                title.length > 9 ? heightPixel(10) : heightPixel(20),
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[styles.iconContainer, { backgroundColor: primary }]}>
              {icon || <Users color={text} />}
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text type="TitleSmall" style={{ fontSize: fontPixel(16) }}>
                {title}
              </Text>
            </View>
          </View>
          {action && <View style={styles.actionContainer}>{action}</View>}
        </View>
      </>
      {value && value !== "" && (
        <Text
          style={{ fontSize: fontPixel(24), marginLeft: 6 }}
          type="TitleMedium"
        >
          {value}
        </Text>
      )}
      {children}
    </View>
  );
};

interface AnimatedRequestProps extends ViewProps {
  withdrawals: [];
  onAlertDismiss: () => void;
}

function AnimatedRequest(props: AnimatedRequestProps) {
  const { text } = useThemeColor();
  const [modalVisible, toggleModal] = useState<boolean>(false);
  const withdrawalExists = props.withdrawals && props.withdrawals.length > 0;
  const { from, to, created_at, amount, id } = withdrawalExists
    ? props.withdrawals[0]
    : {
        from: "",
        to: "",
        created_at: "",
        amount: "",
        id: undefined,
      };

  function onViewDetails() {
    toggleModal(true);
  }

  function onCloseModal() {
    toggleModal(false);
  }

  function onApproveRequest() {
    toggleModal(false);
    props.onAlertDismiss();
  }

  function onCancelRequest() {
    toggleModal(false);
    props.onAlertDismiss();
  }

  return (
    <Animated.View
      {...props}
      style={[
        {
          borderRadius: 12,
          paddingVertical: 10,
          paddingLeft: 12,
          marginBottom: 20,
          backgroundColor: "#0C9700",
          marginHorizontal: 12,
          minHeight: 60,
          paddingRight: 20,
        },
        props.style,
      ]}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={onViewDetails}
      >
        <AlertCircle color={text} />
        <Text
          style={{
            marginLeft: widthPixel(6),
            marginRight: 12,
            textAlign: "left",
          }}
          type="TitleSmall"
        >
          {i18n.t("home.notification")}
          <Text style={{ fontSize: fontPixel(14) }} type="AlertTitleBold">
            {"  "} {i18n.t("home.viewDetails")}
          </Text>
        </Text>
      </TouchableOpacity>
      <WithdrawalRequestModal
        visible={modalVisible}
        animationType="slide"
        transparent
        onClose={onCloseModal}
        onApprove={onApproveRequest}
        onCancel={onCancelRequest}
        from={from}
        to={to}
        date={created_at}
        amount={amount}
        id={id}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { black, text } = useThemeColor();
  useStatusBar("light-content");
  const { top } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { session } = useSession();
  const [reports, setReports] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { data, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      try {
        const token = session?.user.token;
        if (!token || token === "") return null;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {}
    },
  });
  const { data: withdrawalsData, error: withdrawalsError } = useQuery({
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
        if (response.data.withdrawals && response.data.withdrawals.length > 0) {
          let pendingRequests = [];
          response.data.withdrawals.map((item) => {
            if (item.status.toLowerCase() === "pending")
              pendingRequests.push(item);
          });
          setPendingRequests(pendingRequests);
        }

        return response.data.withdrawals;
      } catch (error) {}
    },
  });

  useEffect(() => {
    // const token = storage
    if (!data) return;
    let reports = [];
    data.map((item, index) => {
      if (index < 3)
        reports.push({
          date: item.created_at.substring(0, 10),
          initialCash: `${item.cash_initial}  XAF`,
          finalCash: `${item.cash_final}  XAF`,
        });
    });
    setReports(reports);
  }, [data]);

  useEffect(() => {
    if (pendingRequests.length > 0) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 1000,
      }).start();
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 1000,
      }).start();
    }
  }, [pendingRequests]);

  function hideRequest() {
    if (pendingRequests.length > 1)
      setPendingRequests([...pendingRequests].shift());
    Animated.timing(slideAnim, {
      toValue: -80,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.screenContainer,
          {
            paddingTop: top,
            flexGrow: 1,
          },
        ]}
        style={{ backgroundColor: black, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <AnimatedRequest
            style={{ opacity: opacityAnim }}
            withdrawals={pendingRequests}
            onAlertDismiss={hideRequest}
          />
          <Header
            image
            text1={`${i18n.t("home.welcomeBack")}`}
            text2={`${session?.user.firstname} ${session?.user.lastname}, ${session?.casino.name}`}
            containerStyle={{ paddingTop: 0 }}
          />
          <View style={styles.contentContainer}>
            <InfoCard
              title={i18n.t("home.workingDays")}
              value="3"
              icon={<Suitcase stroke="#fff" />}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: heightPixel(12),
              }}
            >
              <InfoCard
                title={i18n.t("home.lateDays")}
                value="3"
                icon={<TwoUsers stroke="#fff" />}
                containerStyle={{ flex: 1 }}
              />
              <InfoCard
                title={i18n.t("home.absences")}
                value="3"
                icon={<AlertCircle color="#fff" />}
                containerStyle={{ flex: 1 }}
              />
            </View>
            <InfoCard
              title={i18n.t("home.reports")}
              icon={<File width={24} height={24} />}
              containerStyle={{ marginBottom: 20 }}
              value=""
              // action={
              //   <TouchableOpacity style={styles.actionButton}>
              //     <Text type="InputText">{i18n.t("home.thisMonth")}</Text>
              //     <ChevronDown
              //       color={text}
              //       style={styles.chevronIcon}
              //       width={18}
              //     />
              //   </TouchableOpacity>
              // }
            >
              <View>
                {reports.length > 0 ? (
                  <Table
                    reports={reports}
                    headers={[
                      i18n.t("home.tableHeaders.date"),
                      i18n.t("home.tableHeaders.initialCash"),
                      i18n.t("home.tableHeaders.finalCash"),
                    ]}
                    isFlatList={false}
                  />
                ) : (
                  <Text>No reports to show</Text>
                )}
              </View>
            </InfoCard>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 8,
    gap: heightPixel(12),
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  tableHeaderText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  chevronIcon: {
    marginLeft: 12,
  },
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    // gap: heightPixel(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  iconContainer: {
    borderRadius: 100,
    padding: 6,
    marginRight: 8,
  },
  actionContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#444444",
  },
  button: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    alignSelf: "center",
    width: "75%",
    marginBottom: 20,
  },
  spacedRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
});
