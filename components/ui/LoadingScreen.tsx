import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const LoadingScreen = () => {
  const { black } = useThemeColor();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );
};

export default LoadingScreen;
