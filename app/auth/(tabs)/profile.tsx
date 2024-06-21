import { StyleSheet, TouchableOpacity, View } from "react-native";

import Header from "@/components/Header";
import { Edit2, LogOut, User } from "react-native-feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "@/components/ThemedText";
import { Image } from "expo-image";
import NavigationButton from "@/components/profile/NavigationButton";
import { Link, useNavigation } from "expo-router";
import { useSession } from "@/app/ctx";
import React from "react";
import { StackActions } from "@react-navigation/native";

export default function ProfileScreen() {
  const { black, primary, text, background } = useThemeColor();
  const { signOut, session } = useSession();
  const { dispatch, navigate } = useNavigation();

  function handleSignOut() {
    dispatch(StackActions.replace("guest"));
    signOut();
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Account" />
      <View
        style={{
          backgroundColor: black,
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
          gap: 24,
        }}
      >
        <TouchableOpacity
          style={[styles.editProfileButton, { backgroundColor: primary }]}
        >
          <View style={styles.userInfo}>
            <Image
              source={require("@/assets/images/user-header.png")}
              style={styles.image}
            />
            <Text type="HeadingMediumBold">
              {session?.user.firstname} {session?.user.lastname}
            </Text>
          </View>
          <Edit2 color={text} strokeWidth={3} />
        </TouchableOpacity>
        <View style={{ backgroundColor: background, borderRadius: 10 }}>
          {/* <Link href="profile/EditProfile" asChild> */}
          <NavigationButton
            icon={User}
            text="My Profile"
            description="Make changes to your account"
            onPress={() => {
              navigate("profile/EditProfile");
            }}
          />
          {/* </Link> */}
          <NavigationButton
            icon={User}
            text="My Profile"
            description="Make changes to your account"
          />
          <NavigationButton
            icon={LogOut}
            text="Log out"
            description="Make changes to your account"
            containerStyle={{ borderBottomWidth: 0 }}
            onPress={handleSignOut}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  editProfileButton: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
