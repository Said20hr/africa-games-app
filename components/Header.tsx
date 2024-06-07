import useSafeAreaInsets from "@/hooks/useSafeArea";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, UserPlus } from "react-native-feather";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={styles.header}>
      <View style={[styles.headerTop, { paddingTop: top }]}>
        <Text style={styles.title}>{title}</Text>
        <UserPlus color={Colors.dark.text} />
      </View>
      <View style={styles.headerBottom}>
        <View>
          <ThemedText style={styles.dateText}>Thursday, October 26</ThemedText>
          <ThemedText
            style={[
              styles.dateText,
              { fontSize: 10, color: Colors.dark.tabIconDefault },
            ]}
          >
            Friday, October 27
          </ThemedText>
        </View>
        <Calendar color={Colors.dark.text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2c2c2e",
  },
  headerTop: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: { color: Colors.dark.text, fontWeight: "700", fontSize: 12 },
});

export default Header;
