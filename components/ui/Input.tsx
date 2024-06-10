import { useState } from "react";
import {
  TextInputProps,
  TextInput as NativeTextInput,
  View,
  StyleSheet,
  ViewProps,
} from "react-native";
import { Eye, EyeOff } from "react-native-feather";
import { ThemedText as Text } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";

interface MyTextInputProps extends TextInputProps {
  containerProps?: ViewProps;
  error?: string | null;
  showError?: boolean;
  InitialIcon?: JSX.Element;
  RightIcon1?: JSX.Element;
  RightIcon2?: JSX.Element;
  onPressRightIcon1?: () => void;
  onPressRightIcon2?: () => void;
  label?: string;
}

const TextInput = (props: MyTextInputProps) => {
  const {
    textContentType,
    style,
    containerProps,
    InitialIcon,
    RightIcon1,
    RightIcon2,
    onPressRightIcon1,
    onPressRightIcon2,
    label,
  } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const { text } = useThemeColor();

  const isPasswordField = textContentType?.toLowerCase().includes("password");
  const showPassword = passwordVisible || !isPasswordField;

  const containerFocus = {
    // borderColor: focus ? "#000" : "#DFDFDF",
  };

  const onFocus = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const EyeIcon = () => {
    if (showPassword)
      return (
        <Eye
          color={Colors.dark.text}
          onPress={() => setPasswordVisible(false)}
        />
      );
    return (
      <EyeOff
        color={Colors.dark.text}
        onPress={() => setPasswordVisible(true)}
      />
    );
  };

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      {label && (
        <Text type="b2" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        {...containerProps}
        style={[
          styles.container,
          focus ? containerFocus : null,
          containerProps?.style,
        ]}
      >
        {InitialIcon}
        <NativeTextInput
          secureTextEntry={!showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor="#9E9D9D"
          {...props}
          style={[
            styles.input,
            style,
            { marginLeft: InitialIcon ? 8 : 0, color: text },
          ]}
        />
        {isPasswordField && !(RightIcon1 || RightIcon2) ? (
          <View>
            <EyeIcon />
          </View>
        ) : (
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={onPressRightIcon1}>
              {RightIcon1}
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressRightIcon2}>
              {RightIcon2}
            </TouchableOpacity>
          </View>
        )}
      </View>
      {props.error && <Text style={{ color: "#EB617A" }}>{props.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#transparent",
    borderRadius: 12,
    padding: 14,
    justifyContent: "space-between",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: 14,
    paddingBottom: 0,
    fontWeight: "700",
  },

  iconsContainer: {
    gap: 6,
    flexDirection: "row",
  },
});

export default TextInput;
