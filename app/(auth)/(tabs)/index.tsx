import { StyleSheet, View, FlatList, ScrollView } from "react-native";

import { ThemedText as Text } from "@/components/ThemedText";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { MapPin } from "react-native-feather";
import InfoCard from "@/components/InfoCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useStatusBar } from "@/hooks/useStatusBar";
import React from "react";

type Customer = {
  name: string;
  amount: string;
  income: string;
  debts: number;
};

const customers: Customer[] = [
  { name: "Lorem", amount: "2.3k", income: "$470", debts: 34 },
  { name: "Ipsum", amount: "36k", income: "$1.2k", debts: 2 },
  { name: "Dolor sit", amount: "380", income: "$4.3k", debts: 18 },
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

export default function CartScreen() {
  const { black } = useThemeColor();
  useStatusBar("light-content");
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
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
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      >
        <TopCustomers
          data={customers}
          header1="Customer"
          header2="Amount"
          header3="Income"
          header4="Debts"
          mainHeader="Top Customers"
        />
        <InfoCard
          icon={
            <MapPin fill={Colors.dark.text} color={Colors.dark.background} />
          }
          title="Top Routs"
          data={[
            { label: "Amount", value: "34K" },
            { label: "Income", value: "$360K" },
          ]}
        />
        <TopCustomers
          data={customers}
          header1="Member"
          header2="Sales"
          header3="Order"
          header4="Debts"
          mainHeader="Top Members"
        />
      </View>
    </ScrollView>
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
  },
  tableHeaderText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 10,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    flex: 1,
  },
  cell: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
});
