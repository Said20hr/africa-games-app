import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  ViewProps,
  ModalProps,
  Modal,
} from "react-native";
import { ThemedText as Text } from "@/components/ThemedText";
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
import { IReport } from "@/shared/type/Report.type";
import { Colors } from "@/constants/Colors";
import useSafeAreaInsets from "@/hooks/useSafeArea";
import { LinearGradient } from "expo-linear-gradient";

const reports: IReport[] = [
  {
    date: "2024-06-01",
    initialCash: "1000 XAF",
    finalCash: "1200 XAF",
    information: "Increased cash due to successful investment.",
  },
  {
    date: "2024-06-02",
    initialCash: "1200 XAF",
    finalCash: "1100 XAF",
    information: "Decreased cash due to unexpected expenses.",
  },
  {
    date: "2024-06-03",
    initialCash: "1100 XAF",
    finalCash: "1400 XAF",
    information: "Increased cash due to additional income.",
  },
  {
    date: "2024-06-04",
    initialCash: "1000 XAF",
    finalCash: "1200 XAF",
    information: "Increased cash due to successful investment.",
  },
  {
    date: "2024-06-05",
    initialCash: "1200 XAF",
    finalCash: "1100 XAF",
    information: "Decreased cash due to unexpected expenses.",
  },
  {
    date: "2024-06-06",
    initialCash: "1100 XAF",
    finalCash: "1400 XAF",
    information: "Increased cash due to additional income.",
  },
];

type InfoCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: JSX.Element;
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
            gap: 16,
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
            <Text type="h1" style={{ marginBottom: 12 }}>
              24 JAN
            </Text>
            <Text type="h3">12:10 AM</Text>
          </LinearGradient>
          <View style={styles.spacedRow}>
            <Text type="h5">FROM:</Text>
            <Text type="b1" style={{ color: accent }}>
              Chloe Smith
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="h5">TO:</Text>
            <Text type="b1" style={{ color: accent }}>
              Store 01
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Text type="h5">AMOUNT:</Text>
            <Text type="b1" style={{ color: accent }}>
              2000 XAF
            </Text>
          </View>
          <View style={[styles.spacedRow, { gap: 40, marginTop: 20 }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: danger }]}
              onPress={onCancel}
            >
              <X color={text} width={16} strokeWidth={3} />
              <Text type="h6">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: success }]}
              onPress={onApprove}
            >
              <Check color={text} width={16} strokeWidth={3} />
              <Text type="h6">Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const InfoCard = ({ title, value, icon, action, children }: InfoCardProps) => {
  const { background, text, primary } = useThemeColor();

  return (
    <View style={[styles.cardContainer, { backgroundColor: background }]}>
      <View style={styles.header}>
        <View style={styles.headerInfoContainer}>
          <View style={[styles.iconContainer, { backgroundColor: primary }]}>
            {icon || <Users color={text} />}
          </View>
          <Text type="h4">{title}</Text>
        </View>
        {action && <View style={styles.actionContainer}>{action}</View>}
      </View>
      <Text type="h2" style={styles.value}>
        {value}
      </Text>
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
          paddingHorizontal: 15,
          marginBottom: 20,
          backgroundColor: "#0C9700",
          marginHorizontal: 12,
          height: 60,
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
        <Text style={{ color: text, marginLeft: 8 }} type="b2">
          There are pending withdrawals that need your approval
          <Text type="h6">{"    "} View Details</Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { black, background, text, primary } = useThemeColor();
  useStatusBar("light-content");
  const { top } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, toggleModal] = useState<boolean>(false);

  const renderItem = ({ item }: { item: IReport }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { textAlign: "left" }]}>{item.date}</Text>
      <Text style={[styles.cell, { textAlign: "right" }]}>
        {item.initialCash}
      </Text>
      <Text style={[styles.cell, { textAlign: "right" }]}>
        {item.finalCash}
      </Text>
    </View>
  );

  useLayoutEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
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
    <View
      style={[
        styles.screenContainer,
        {
          backgroundColor: black,
          paddingTop: top,
          flex: 1,
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          flex: 1,
        }}
      >
        <AnimatedRequest
          onRequestHandlerPress={onRequestPressHandler}
          style={{ opacity: opacityAnim }}
        />
        <Header
          image
          text1="Hi, Welcome Back!"
          text2="Chloe Smith"
          containerStyle={{ paddingTop: 0 }}
        />
        <View style={styles.contentContainer}>
          <InfoCard title="Total days" value="3" />
          <InfoCard
            title="Reports"
            value=""
            action={
              <TouchableOpacity style={styles.actionButton}>
                <Text type="h6">This week</Text>
                <ChevronDown color={text} style={styles.chevronIcon} />
              </TouchableOpacity>
            }
          >
            <FlatList
              data={reports}
              renderItem={renderItem}
              ListHeaderComponent={() => (
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { textAlign: "left" }]}>
                    Date
                  </Text>
                  <Text style={styles.tableHeaderText}>Initial Cash</Text>
                  <Text style={styles.tableHeaderText}>Final Cash</Text>
                </View>
              )}
            />
          </InfoCard>
        </View>
      </Animated.View>
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
    flex: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    flex: 1,
  },
  cell: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
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
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#444444",
  },
  chevronIcon: {
    marginLeft: 12,
  },
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfoContainer: { flexDirection: "row", alignItems: "center" },
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
  value: {
    marginTop: 20,
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
