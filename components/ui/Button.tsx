import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ThemedText as Text } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  textStyle?: TextStyle;
  loading?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        props.style,
        { backgroundColor: props.loading ? "#eee" : Colors.dark.primary },
      ]}
    >
      {props.loading ? (
        <ActivityIndicator />
      ) : (
        <Text type="h5" style={props.textStyle}>
          {props.label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 100,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Button;
