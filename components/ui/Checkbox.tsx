import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { Check } from "react-native-feather";
import { Colors } from "@/constants/Colors";

type CheckboxProps = {
  text?: string;
  initialChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  containerStyle?: ViewStyle;
  checkboxStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const Checkbox: React.FC<CheckboxProps> = ({
  text,
  initialChecked = false,
  onToggle,
  containerStyle,
  checkboxStyle,
  textStyle,
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const opacityValue = useRef(
    new Animated.Value(initialChecked ? 1 : 0)
  ).current;
  const backgroundColorValue = useRef(
    new Animated.Value(initialChecked ? 1 : 0)
  ).current;

  useEffect(() => {
    const toValue = checked ? 1 : 0;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorValue, {
        toValue,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [checked, opacityValue, backgroundColorValue]);

  const toggleCheckbox = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onToggle && onToggle(newCheckedState);
  };

  const backgroundColor = backgroundColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.dark.background, Colors.dark.primary],
  });

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={toggleCheckbox}
    >
      <Animated.View
        style={[styles.checkbox, checkboxStyle, { backgroundColor }]}
      >
        <Animated.View style={[styles.checkIcon, { opacity: opacityValue }]}>
          <Check
            stroke={Colors.dark.text}
            width={18}
            height={18}
            strokeWidth={4}
          />
        </Animated.View>
      </Animated.View>
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.background,
  },
  checkIcon: {
    width: 18,
    height: 18,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 16,
  },
});

export default Checkbox;
