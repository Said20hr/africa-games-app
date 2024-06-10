import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { ThemedText as Text } from "@/components/ThemedText";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { ChevronDown, MapPin, Users } from "react-native-feather";
import InfoCard from "@/components/InfoCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useStatusBar } from "@/hooks/useStatusBar";
import React from "react";
import { IReport } from "@/shared/type/Report.type";

type Customer = {
  name: string;
  amount: string;
  income: string;
  debts: number;
};

const reports: IReport[] = [
  {
    date: "2024-06-01",
    initialCash: "$1000",
    finalCash: "$1200",
    information: "Increased cash due to successful investment.",
  },
  {
    date: "2024-06-02",
    initialCash: "$1200",
    finalCash: "$1100",
    information: "Decreased cash due to unexpected expenses.",
  },
  {
    date: "2024-06-03",
    initialCash: "$1100",
    finalCash: "$1400",
    information: "Increased cash due to additional income.",
  },
  {
    date: "2024-06-01",
    initialCash: "$1000",
    finalCash: "$1200",
    information: "Increased cash due to successful investment.",
  },
  {
    date: "2024-06-02",
    initialCash: "$1200",
    finalCash: "$1100",
    information: "Decreased cash due to unexpected expenses.",
  },
  {
    date: "2024-06-03",
    initialCash: "$1100",
    finalCash: "$1400",
    information: "Increased cash due to additional income.",
  },
];

type TopCustomerProps = {
  mainHeader: string;
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  data: Customer[];
};

const TopCustomers = ({
  data,
  header1,
  header2,
  header3,
  header4,
  mainHeader,
}: TopCustomerProps) => {
  const renderItem = ({ item }: { item: Customer }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { textAlign: "left" }]}>{item.name}</Text>
      <Text style={styles.cell}>{item.amount}</Text>
      <Text style={styles.cell}>{item.income}</Text>
      <Text style={styles.cell}>{item.debts}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{mainHeader}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>{header1}</Text>
        <Text style={styles.tableHeaderText}>{header2}</Text>
        <Text style={styles.tableHeaderText}>{header3}</Text>
        <Text style={styles.tableHeaderText}>{header4}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

export default function HomeScreen() {
  const { black, background, text, primary, accent } = useThemeColor();
  useStatusBar("light-content");

  const renderItem = ({ item }: { item: IReport }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { textAlign: "left" }]}>{item.date}</Text>
      <Text style={[styles.cell, { textAlign: "left" }]}>
        {item.initialCash}
      </Text>
      <Text style={[styles.cell, { textAlign: "left" }]}>{item.finalCash}</Text>
    </View>
  );

  return (
    <View
      // style={{ flex: 1 }}
      style={{
        flex: 1,
        backgroundColor: black,
        paddingBottom: 20,
        flexGrow: 1,
      }}
    >
      <Header image text1="Hi, Welcome Back !" text2="Chloe Smith" />
      <View
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 8,
        }}
      >
        <View style={[styles.cardContainer, { backgroundColor: background }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 0,
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: primary }]}>
              <Users color={text} />
            </View>
            <Text type="h4">Total days</Text>
          </View>
          <Text type="h2" style={{ marginTop: 20 }}>
            3
          </Text>
        </View>
        <View style={[styles.cardContainer, { backgroundColor: background }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 0,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[styles.iconContainer, { backgroundColor: primary }]}
              >
                <Users color={text} />
              </View>
              <Text type="h4">Reports</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 8,
                borderRadius: 12,
                backgroundColor: "#444444",
              }}
            >
              <Text type="h6">This week</Text>
              <ChevronDown color={text} style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={reports}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Initial Cash</Text>
                <Text style={styles.tableHeaderText}>Final Cash</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 16,
    // margin: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
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
    textAlign: "left",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    flex: 1,
  },
  cell: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
  },
  iconContainer: {
    borderRadius: 100,
    padding: 6,
    marginRight: 16,
  },
});
