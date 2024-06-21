import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { ChevronRight } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import Text from "../ThemedText";

interface NavigationButtonProps {
  icon: React.FC<SvgProps>;
  text: string;
  description: string;
  showAlert?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  iconStyle?: ImageStyle;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon: Icon,
  text,
  description,
  showAlert = false,
  onPress,
  containerStyle,
  textStyle,
  descriptionStyle,
  iconStyle,
}) => {
  const { accent, primary } = useThemeColor();
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon
          width={24}
          height={24}
          style={[styles.icon, iconStyle]}
          color={primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text type="SubtitleMedium">{text}</Text>
        <Text type="InputText" style={{ fontSize: 11 }}>
          {description}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        {/* {showAlert && (
          <Image
            source={require("./path/to/alert-icon.png")} // replace with your alert icon
            style={styles.alertIcon}
          />
        )} */}
        <ChevronRight color={accent} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#333",
  },
  iconContainer: {
    backgroundColor: "rgba(233, 146, 19, 0.1)",
    borderRadius: 50,
    padding: 8,
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  text: {
    color: "#fff", // replace with your desired text color
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#aaa", // replace with your desired description color
    fontSize: 14,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
});

export default NavigationButton;
