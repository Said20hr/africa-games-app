import React from "react";
import { Stack, useNavigation } from "expo-router";
import { MMKV } from "react-native-mmkv";
import { Platform, TouchableOpacity } from "react-native";
import { ArrowLeft } from "react-native-feather";
import { fontPixel } from "@/shared/util/normalise";
import { useThemeColor } from "@/hooks/useThemeColor";
import { i18n } from "@/constants/i18n";

enum AppState {
  LOADING = "loading",
  GUEST_USER = "guestUser",
  AUTHENTICATED = "authenticated",
}

export const storage = new MMKV();

export default function AppLayout() {
  const { text, black } = useThemeColor();
  const { goBack } = useNavigation();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/EditProfile"
        options={{
          headerLeft: () => (
            <>
              {
                <TouchableOpacity onPress={goBack} style={{ marginRight: 20 }}>
                  <ArrowLeft color={text} />
                </TouchableOpacity>
              }
            </>
          ),
          title: i18n.t("editProfile.myProfile"),
          headerTitle: i18n.t("editProfile.myProfile"),
          headerShadowVisible: false,
          headerTitleStyle: {
            color: text,
            fontFamily: "PoppinsMedium",
            fontSize: fontPixel(20),
          },
          headerTitleAlign: "left",
          headerShown: true,
          headerStyle: {
            backgroundColor: black,
          },
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
