import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Container } from "@/components/ui";
import Text from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Table from "@/components/Table";
import { i18n } from "@/constants/i18n";

const sections = ["provisions", "withdrawals"];
const SCREEN_WIDTH = Dimensions.get("screen").width;

type FileEntry = {
  name: string;
  date: string;
  amount: string;
  status: string;
};

export default function ProfileScreen() {
  const { primary, background } = useThemeColor();
  const styles = style(primary, background);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const fileEntriesProvisions: FileEntry[] = [
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

  return (
    <Container>
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <FlatList
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
        />
      </View>
      <View
        style={{ padding: 12, backgroundColor: background, borderRadius: 20 }}
      >
        <Table
          reports={
            activeIndex === 0 ? fileEntriesProvisions : fileEntriesWithdrawals
          }
          headers={[
            i18n.t("movements.tableHeaders.name"),
            i18n.t("movements.tableHeaders.date"),
            i18n.t("movements.tableHeaders.amount"),
            i18n.t("movements.tableHeaders.status"),
          ]}
          rowTextSize={12}
          isFlatList
        />
      </View>
    </Container>
  );
}

const style = (primary: string, background: string) =>
  StyleSheet.create({
    contentContainerStyle: {
      backgroundColor: background,
      borderRadius: 20,
      width: SCREEN_WIDTH / 1.3,
      justifyContent: "space-between",
    },
    sectionButton: {
      paddingVertical: 16,
      borderRadius: 20,
      width: SCREEN_WIDTH / 2.6,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
      // flex: 1,
    },
  });
