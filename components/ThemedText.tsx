import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fontPixel } from "@/shared/util/normalise";

/*
  h1 -> headings (fw-700, fs-36)
  h2 -> sub headings (fw-700, fs-14)
  h3 -> title (fw-600, fs-20) 
  h4 -> sub title (fw-500, fs-14)
  b1 -> (fw-400, fs-16)
  b2 -> (fw-400, fs-14)
  b3 -> input (fw-400, fs-12)
  b4 -> (fw-400, fs-11)
  other styles
  Date (fw-900, fs-30)
  Time (fw-500, fs-25)
  Alert Heading (fw-800, fs-16)
*/

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "HeadingLargestBold"
    | "HeadingBoldSmall"
    | "TitleMedium"
    | "SubtitleLight"
    | "BodyMedium"
    | "BodySmall"
    | "InputText"
    | "FinePrint"
    | "DateLargeHeavy"
    | "TimeMedium"
    | "HeadingLargeBold"
    | "HeadingMediumBold"
    | "TitleSmall"
    | "SubtitleMedium"
    | "TitleSmallest"
    | "AlertTitleBold";
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { text } = useThemeColor();

  return (
    <Text
      {...rest}
      style={[
        { color: text, fontFamily: "PoppinsMedium" },
        styles[type] || styles.default,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: fontPixel(16),
    fontFamily: "PoppinsRegular",
  },
  HeadingLargestBold: {
    fontSize: fontPixel(36),
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  HeadingLargeBold: {
    fontSize: fontPixel(32),
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  HeadingMediumBold: {
    fontSize: fontPixel(16),
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  HeadingBoldSmall: {
    fontSize: fontPixel(14),
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  TitleMedium: {
    fontSize: fontPixel(20),
    fontWeight: "600",
    fontFamily: "PoppinsMedium",
  },
  TitleSmall: {
    fontSize: fontPixel(14),
    fontWeight: "600",
    fontFamily: "PoppinsMedium",
  },
  TitleSmallest: {
    fontSize: fontPixel(12),
    fontWeight: "600",
    fontFamily: "PoppinsMedium",
  },
  SubtitleMedium: {
    fontSize: fontPixel(16),
    fontWeight: "500",
    fontFamily: "PoppinsMedium",
  },
  SubtitleLight: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    fontFamily: "PoppinsMedium",
  },
  BodyMedium: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },
  BodySmall: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },
  InputText: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },
  FinePrint: {
    fontSize: fontPixel(11),
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },
  DateLargeHeavy: {
    fontSize: fontPixel(30),
    fontWeight: "900",
    fontFamily: "PoppinsBlack",
  },
  TimeMedium: {
    fontSize: fontPixel(25),
    fontWeight: "500",
    fontFamily: "PoppinsMedium",
  },
  AlertTitleBold: {
    fontSize: fontPixel(16),
    fontWeight: "800",
    fontFamily: "PoppinsExtraBold",
  },
});
