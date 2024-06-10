import { StyleSheet, View } from "react-native";

import Header from "@/components/Header";
import Card from "@/components/Card";
import { Colors } from "@/constants/Colors";
import { MapPin, Users } from "react-native-feather";
import { LineChart } from "react-native-gifted-charts";
const data = [
  { value: 200, label: "Mon" },
  { value: 700, label: "Tue" },
  { value: 500, label: "Wed" },
  { value: 800, label: "Thu" },
  { value: 1000, label: "Fri" },
  { value: 1200, label: "Sat" }, // Assuming no customers on Saturday
];

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Overview" />
      <View
        style={{
          backgroundColor: Colors.dark.background,
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      >
        <Card
          title="Total Customers"
          value="546"
          Icon={<Users color={Colors.dark.text} />}
        />
        <Card
          title="Total Routes"
          value="14"
          Icon={
            <MapPin fill={Colors.dark.text} color={Colors.dark.background} />
          }
        />
        <View
          style={{
            backgroundColor: Colors.dark.accent,
            borderRadius: 16,
            marginTop: 12,
            marginHorizontal: 8,
            padding: 12,
          }}
        >
          <LineChart
            data={data}
            color1="#A020F0"
            isAnimated
            xAxisLabelTextStyle={{
              color: Colors.dark.text,
              fontSize: 10,
              fontWeight: "700",
            }}
            yAxisColor={Colors.dark.background}
            xAxisColor={Colors.dark.background}
            yAxisTextStyle={{
              color: Colors.dark.text,
              fontSize: 10,
              fontWeight: "700",
            }}
            curved
            animateOnDataChange
            dashWidth={12}
            dashGap={20}
            dataPointsColor={Colors.dark.text}
            dataPointsWidth={30}
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
});
