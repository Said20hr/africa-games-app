import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Header from "@/components/Header";
import { ThemedText as Text } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "@/components/ui";
import {
  AlertCircle,
  DollarSign,
  MinusCircle,
  PlusCircle,
} from "react-native-feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState } from "react";
import AnimatedCircularProgress from "@/components/ui/AnimatedCircularProgress";

const { width, height } = Dimensions.get("window");
const SVG_HEIGHT = height / 1.2;
const CURRENT_DATE = new Date();

const ReportWaitingTimer = () => {
  const { black, primary } = useThemeColor();
  const [progress, setProgress] = useState(80);

  function handleOnPress() {
    setProgress(progress === 0 ? 100 : 0);
  }

  return (
    <View
      style={{
        backgroundColor: black,
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}
    >
      <View>
        <View style={styles.timeContainer}>
          <AnimatedCircularProgress percentage={progress} color={primary} />
          <View style={styles.timeRemaining}>
            <Text type="h3">STILL</Text>
            <Text type="h4">02:10:00</Text>
          </View>
        </View>
        <Text style={{ textAlign: "center", marginTop: 50 }} type="h4">
          Veuillez attendre la fin de votre shift pour pouvoir remplir les
          données de clôture.
        </Text>
      </View>
      <Button label="Back" onPress={handleOnPress} />
    </View>
  );
};

const ReportForm = () => {
  const { black, accent, primary, text } = useThemeColor();
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: black,
        flexGrow: 1,
      }}
    >
      <View style={{ flex: 1, height }}>
        <LinearGradient
          colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
          style={[styles.content, { backgroundColor: primary }]}
        >
          <Text type="h1" style={{ marginBottom: 12 }}>
            24 JAN
          </Text>
          <Text type="h3">12:10 AM</Text>
        </LinearGradient>
        <View style={{ position: "relative", flex: 1 }}>
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            style={styles.svg}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M142.223 33.196C123.213 18.894 102.816 0 79.027 0H21C-6.614 0-29 22.386-29 50v520c0 27.614 22.386 50 50 50h352c27.614 0 50-22.386 50-50V50c0-27.614-22.386-50-50-50h-58.027c-23.789 0-44.186 18.894-63.196 33.196C237.692 43.792 218.348 50.332 197 50.332s-40.692-6.54-54.777-17.136z"
              fill={accent}
            />
          </Svg>
          <View style={[styles.formContainer, { backgroundColor: accent }]}>
            <Text type="b1">
              Please fill out the following fields to log your daily financial
              transactions
            </Text>
            <Input
              RightIcon1={<MinusCircle color={text} />}
              RightIcon2={<PlusCircle color={text} />}
              InitialIcon={<DollarSign color={text} />}
              placeholder="Enter your initial cash"
              keyboardType="decimal-pad"
            />
            <Input
              RightIcon1={<MinusCircle color={text} />}
              RightIcon2={<PlusCircle color={text} />}
              InitialIcon={<DollarSign color={text} />}
              placeholder="Enter your final cash"
              keyboardType="decimal-pad"
            />
            <Input
              multiline
              InitialIcon={<AlertCircle color={text} />}
              containerProps={{
                style: { height: 120, alignItems: "flex-start" },
              }}
              placeholder="Lorem ipsium..."
            />
            <Button label="Submit" />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header image title="Daily Report" />
      {false ? <ReportForm /> : <ReportWaitingTimer />}
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    top: "-8%",
    left: 0,
    right: 0,
    zIndex: 1000,
    height: SVG_HEIGHT,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    position: "absolute",
    zIndex: 1001,
    top: "5%",
    width: "100%",
    gap: 20,
  },
  time: {
    color: "#fff",
    fontSize: 16,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8%",
    padding: 12,
    borderRadius: 1000,
    width: width / 2.2,
    aspectRatio: 1,
    alignSelf: "center",
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: "20%",
  },
  timeRemaining: {
    position: "absolute",
    alignItems: "center",
    gap: 6,
  },
});
