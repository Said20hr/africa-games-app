import useSafeAreaInsets from "@/hooks/useSafeArea";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, UserPlus } from "react-native-feather";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";

interface HeaderProps {
  image?: boolean;
  text1?: string;
  text2?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ image, text1, text2, title }) => {
  const { top } = useSafeAreaInsets();
  const { black } = useThemeColor();

  return (
    <View
      style={{ backgroundColor: black, paddingTop: top, paddingBottom: 10 }}
    >
      <View style={styles.headerBottom}>
        <View>
          {text1 && text2 ? (
            <>
              <ThemedText type="h4">{text1}</ThemedText>
              <ThemedText type="b1" style={{ marginTop: 8 }}>
                {text2}
              </ThemedText>
            </>
          ) : title ? (
            <ThemedText type="h3">{title}</ThemedText>
          ) : null}
        </View>
        {image && (
          <Image
            source={require("@/assets/images/user-header.png")}
            style={styles.image}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  image: {
    width: 32,
    aspectRatio: 1,
    borderRadius: 100,
    height: 32,
  },
});

export default Header;
