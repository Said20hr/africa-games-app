import { Colors } from "@/constants/Colors";
import useSafeAreaInsets from "@/hooks/useSafeArea";
import React from "react";
import { View, ViewProps } from "react-native";

const Container = (props: ViewProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        {
          paddingTop: top,
          paddingHorizontal: 16,
          backgroundColor: Colors.dark.black,
          flex: 1,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default Container;
