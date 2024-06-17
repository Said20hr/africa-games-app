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

const sections = ["Provisions", "Withdrawals"];
const SCREEN_WIDTH = Dimensions.get("screen").width;

type FileEntry = {
  name: string;
  date: string;
  amount: string;
  status: "Pending" | "Accepted" | "Refused";
};

const fileEntriesProvisions: FileEntry[] = [
  {
    name: "File 01",
    date: "2024-06-01",
    amount: "500 XAF",
    status: "Pending",
  },
  {
    name: "File 02",
    date: "2024-06-02",
    amount: "1000 XAF",
    status: "Accepted",
  },
  {
    name: "File 03",
    date: "2024-06-03",
    amount: "9000 XAF",
    status: "Refused",
  },
];

const fileEntriesWithdrawals: FileEntry[] = [
  {
    name: "File 04",
    date: "2024-07-01",
    amount: "1500 XAF",
    status: "Accepted",
  },
  {
    name: "File 05",
    date: "2024-07-02",
    amount: "10 XAF",
    status: "Accepted",
  },
  {
    name: "File 06",
    date: "2024-07-03",
    amount: "900 XAF",
    status: "Refused",
  },
];

export default function ProfileScreen() {
  const { primary, background } = useThemeColor();
  const styles = style(primary, background);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
              <Text type="h4">{item}</Text>
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
          headers={["Name", "Date", "Amount", "Status"]}
          rowTextSize={10}
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
      // flex: 1,
    },
  });
