import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  const scaleValue = new Animated.Value(checked ? 1 : 0);
  const backgroundColorValue = new Animated.Value(checked ? 1 : 0);

  const toggleCheckbox = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onToggle && onToggle(newCheckedState);

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: newCheckedState ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorValue, {
        toValue: newCheckedState ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
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
        <Animated.View
          style={[styles.checkIcon, { transform: [{ scale: scaleValue }] }]}
        >
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
