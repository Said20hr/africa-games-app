import { useCallback } from "react";
import { StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBarStyle } from "react-native";

export const useStatusBar = (style: StatusBarStyle, animated = true) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, animated);
    }, [])
  );
};
