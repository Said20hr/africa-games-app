import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import Text from "../ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  textStyle?: TextStyle;
  loading?: boolean;
  outlined?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
  const { outlined = false } = props;
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        {
          backgroundColor: props.loading
            ? "#eee"
            : outlined
            ? "transparent"
            : Colors.dark.primary,
          borderWidth: 1,
          borderColor: Colors.dark.primary,
        },
        props.style,
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
