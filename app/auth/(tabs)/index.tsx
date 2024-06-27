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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/ctx";
import axios from "axios";
import { fontPixel, heightPixel, widthPixel } from "@/shared/util/normalise";
import { File, Suitcase, TwoUsers } from "@/assets/icons";
import { i18n } from "@/constants/i18n";
import { LanguageOptions } from "@/shared/type/Utils.type";
import { useTranslation } from "@/hooks/useTranslation";
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
}

const WithdrawalRequestModal = (props: WithdrawalRequestModalProps) => {
  const { primary, background, text, accent, danger, success } =
    useThemeColor();
  const { onCancel, onClose, onApprove } = props;
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
              24 JAN
            </Text>
            <Text type="TimeMedium">12:10 AM</Text>
          </LinearGradient>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">FROM:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              Chloe Smith
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">TO:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              Store 01
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="AlertTitleBold">AMOUNT:</Text>
            <Text type="BodyMedium" style={{ color: accent }}>
              2000 XAF
            </Text>
          </View>
          <View style={[styles.spacedRow, { gap: 40, marginTop: 20 }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: danger }]}
              onPress={onCancel}
            >
              <X color={text} width={16} strokeWidth={3} />
              <Text type="HeadingBoldSmall">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: success }]}
              onPress={onApprove}
            >
              <Check color={text} width={16} strokeWidth={3} />
              <Text type="HeadingBoldSmall">Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const InfoCard = ({
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
      <View style={styles.header}>
        <View
          style={[
            styles.headerInfoContainer,
            {
              marginBottom:
                title.length > 9 ? heightPixel(10) : heightPixel(20),
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: primary }]}>
            {icon || <Users color={text} />}
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text type="TitleSmall">{title}</Text>
          </View>
        </View>
        {action && <View style={styles.actionContainer}>{action}</View>}
      </View>
      {value && value !== "" && (
        <Text
          style={{ fontSize: fontPixel(24) }} // Use `flex: 1` to allow text to fill the container
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
  onRequestHandlerPress: () => void;
}

function AnimatedRequest(props: AnimatedRequestProps) {
  const { text } = useThemeColor();

  function onViewDetails() {
    props.onRequestHandlerPress();
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
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { black, text } = useThemeColor();
  useStatusBar("light-content");
  const { top } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, toggleModal] = useState<boolean>(false);
  const { session } = useSession();
  const [reports, setReports] = useState([]);
  // const { t } = useTranslation();
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

  useEffect(() => {
    // const token = storage
    if (!data) return;
    let reports = [];
    data.map((item) => {
      reports.push({
        date: item.created_at.substring(0, 10),
        initialCash: `${item.cash_initial}  XAF`,
        finalCash: `${item.cash_final}  XAF`,
      });
    });
    setReports(reports);
  }, [data]);

  useLayoutEffect(() => {
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
  }, []);

  function hideRequest() {
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

  function onRequestPressHandler() {
    toggleModal(true);
  }

  function onCloseModal() {
    toggleModal(false);
  }

  function onApproveRequest() {
    toggleModal(false);
    hideRequest();
  }

  function onCancelRequest() {
    toggleModal(false);
    hideRequest();
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
            onRequestHandlerPress={onRequestPressHandler}
            style={{ opacity: opacityAnim }}
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
                gap: 20,
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
              action={
                <TouchableOpacity style={styles.actionButton}>
                  <Text type="InputText">{i18n.t("home.thisMonth")}</Text>
                  <ChevronDown
                    color={text}
                    style={styles.chevronIcon}
                    width={18}
                  />
                </TouchableOpacity>
              }
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
      <WithdrawalRequestModal
        visible={modalVisible}
        animationType="slide"
        transparent
        onClose={onCloseModal}
        onApprove={onApproveRequest}
        onCancel={onCancelRequest}
      />
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
    gap: heightPixel(17),
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
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#444444",
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
  },
  iconContainer: {
    borderRadius: 100,
    padding: 6,
    marginRight: 16,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
});
