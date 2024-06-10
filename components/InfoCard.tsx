import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText as Text } from "./ThemedText";
import { Colors } from "@/constants/Colors";

type CardProps = {
  icon: JSX.Element;
  title: string;
  data: {
    label: string;
    value: string;
    change?: string;
  }[];
};

const InfoCard: React.FC<CardProps> = ({ icon, title, data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.content}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.row, { flex: 1, alignItems: "flex-start" }]}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
            {item.change && (
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      item.change.charAt(0) !== "-"
                        ? Colors.dark.success
                        : Colors.dark.danger,
                    fontSize: 10,
                  },
                ]}
              >
                {item.change}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 16,
    margin: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 24,
  },
  headerText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  row: {
    alignItems: "center",
  },
  label: {
    color: Colors.dark.tabIconDefault,
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
});
