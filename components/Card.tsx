import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CardProps {
  title: string;
  value: string;
  Icon: JSX.Element;
}

const Card: React.FC<CardProps> = ({ title, value, Icon }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row" }}>
        {Icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: Colors.dark.accent,
    margin: 8,
    borderRadius: 16,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "700",
  },
  cardValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 14,
  },
});

export default Card;
