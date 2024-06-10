import { ScrollView, StyleSheet, View } from "react-native";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import InfoCard from "@/components/InfoCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText as Text } from "@/components/ThemedText";

export default function HomeScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingBottom: 20,
        flexGrow: 1,
      }}
    >
      <Header title="Orders" />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      >
        <InfoCard
          title="Orders"
          icon={
            <Ionicons
              name="cart"
              color={Colors.dark.text}
              size={24}
              style={{ marginRight: 12 }}
            />
          }
          data={[
            { label: "Amount", value: "$3.5K" },
            { label: "Quantity", value: "45" },
          ]}
        />
        <InfoCard
          title="Returns"
          icon={
            <Ionicons
              name="log-out"
              color={Colors.dark.text}
              size={24}
              style={{ marginRight: 12 }}
            />
          }
          data={[
            { label: "Amount", value: "$3.5K", change: "+$50 (45%)" },
            { label: "Quantity", value: "45", change: "-5 (15%)" },
          ]}
        />
        <InfoCard
          title="Total"
          icon={
            <Ionicons
              name="log-out"
              color={Colors.dark.text}
              size={24}
              style={{ marginRight: 12 }}
            />
          }
          data={[
            { label: "Amount", value: "$125K", change: "+$50 (45%)" },
            { label: "Quantity", value: "15K", change: "-5 (15%)" },
          ]}
        />
        <Text style={{ color: Colors.dark.text, fontWeight: "bold" }}>
          Payments
        </Text>
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
});
