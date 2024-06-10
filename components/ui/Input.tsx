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

interface MyTextInputProps extends TextInputProps {
  containerProps?: ViewProps;
  error?: string | null;
  showError?: boolean;
  InitialIcon?: JSX.Element;
}

const TextInput = (props: MyTextInputProps) => {
  const { textContentType, style, containerProps, InitialIcon } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focus, setFocus] = useState(false);

  const isPasswordField = textContentType?.toLowerCase().includes("password");
  const showPassword = passwordVisible || !isPasswordField;

  const containerFocus = {
    borderColor: focus ? "#000" : "#DFDFDF",
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
    <>
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
          {...props}
          style={[styles.input, style, { marginLeft: InitialIcon ? 8 : 0 }]}
          placeholderTextColor="#9E9D9D"
        />
        {isPasswordField ? (
          <View>
            <EyeIcon />
          </View>
        ) : null}
      </View>
      {props.error && <Text style={{ color: "#EB617A" }}>{props.error}</Text>}
    </>
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
    color: "#000",
    paddingBottom: 0,
    height: 40,
    fontWeight: "700",
  },
});

export default TextInput;
