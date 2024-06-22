import { useState } from "react";
import {
  TextInputProps,
  TextInput as NativeTextInput,
  View,
  StyleSheet,
  ViewProps,
} from "react-native";
import { Eye, EyeOff } from "react-native-feather";
import Text from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { fontPixel, heightPixel } from "@/shared/util/normalise";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

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
  focusColor?: string;
  blurColor?: string;
  bottomSheetInput?: boolean;
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
    focusColor,
    blurColor,
    bottomSheetInput = false,
  } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const { text, primary } = useThemeColor();

  const isPasswordField = textContentType?.toLowerCase().includes("password");
  const showPassword = passwordVisible || !isPasswordField;

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

  const inputProps = {
    secureTextEntry: !showPassword,
    onFocus,
    onBlur,
    placeholderTextColor: "#9E9D9D",
    ...props,
    style: [
      styles.input,
      style,
      { marginLeft: InitialIcon ? 8 : 0, color: text },
    ],
  };

  return (
    <View style={{ flexDirection: "column" }}>
      {label && (
        <Text type="InputText" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        {...containerProps}
        style={[
          styles.container,
          containerProps?.style,
          {
            borderColor: focus
              ? focusColor ?? primary
              : blurColor ?? `${primary}80`,
            borderWidth: 2,
          },
        ]}
      >
        {InitialIcon && (
          <View style={{ marginTop: heightPixel(2) }}>{InitialIcon}</View>
        )}
        {!bottomSheetInput ? (
          <NativeTextInput {...inputProps} />
        ) : (
          <BottomSheetTextInput {...inputProps} />
        )}
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
      {props.error && (
        <Text style={{ color: "#EB617A", marginTop: 4 }} type="BodySmall">
          {props.error}
        </Text>
      )}
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
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: fontPixel(15),
    paddingBottom: 0,
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },

  iconsContainer: {
    gap: 6,
    flexDirection: "row",
  },
});

export default TextInput;
