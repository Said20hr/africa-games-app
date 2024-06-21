import useSafeAreaInsets from "@/hooks/useSafeArea";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { Calendar, UserPlus } from "react-native-feather";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
// import { Image } from "expo-image";
import { IAuthContext, useSession } from "@/app/ctx";
import { useNavigation } from "expo-router";

interface HeaderProps {
  image?: boolean;
  text1?: string;
  text2?: string;
  title?: string;
  containerStyle?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  image,
  text1,
  text2,
  title,
  containerStyle,
}) => {
  const { top } = useSafeAreaInsets();
  const { black } = useThemeColor();
  const { session } = useSession() as IAuthContext;
  const { navigate } = useNavigation();

  return (
    <View
      style={[
        { backgroundColor: black, paddingTop: top, paddingBottom: 10 },
        containerStyle,
      ]}
    >
      <View style={styles.headerBottom}>
        <View>
          {text1 && text2 ? (
            <>
              <ThemedText type="TitleMedium">{text1}</ThemedText>
              <ThemedText type="SubtitleLight" style={{ marginTop: 8 }}>
                {session?.user.firstname} {session?.user.lastname},{" "}
                {session?.casino.name}
              </ThemedText>
            </>
          ) : title ? (
            <ThemedText type="TitleMedium">{title}</ThemedText>
          ) : null}
        </View>
        {image && (
          <TouchableOpacity onPress={() => navigate("profile")}>
            <Image
              source={require("@/assets/images/user-header.png")}
              style={styles.image}
            />
          </TouchableOpacity>
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
