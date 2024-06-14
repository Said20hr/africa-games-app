import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "b1" | "b2";
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
      style={[
        { color: text },
        type === "default" ? styles.default : undefined,
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "h4" ? styles.h4 : undefined,
        type === "h5" ? styles.h5 : undefined,
        type === "h6" ? styles.h6 : undefined,
        type === "b1" ? styles.b1 : undefined,
        type === "b2" ? styles.b2 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 20,
    fontWeight: "700",
  },
  h4: {
    fontSize: 16,
    fontWeight: "700",
  },
  h5: {
    fontSize: 14,
    fontWeight: "700",
  },
  h6: {
    fontSize: 12,
    fontWeight: "700",
  },
  b1: {
    fontSize: 14,
    fontWeight: "400",
  },
  b2: {
    fontSize: 12,
    fontWeight: "400",
  },
});
