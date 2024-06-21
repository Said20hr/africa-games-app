import React from "react";
import { Stack, useNavigation } from "expo-router";
import { MMKV } from "react-native-mmkv";
import { Platform, TouchableOpacity } from "react-native";
import { ArrowLeft } from "react-native-feather";
import { fontPixel } from "@/shared/util/normalise";
import { useThemeColor } from "@/hooks/useThemeColor";

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
              {Platform.OS === "ios" && (
                <TouchableOpacity onPress={goBack}>
                  <ArrowLeft color={text} />
                </TouchableOpacity>
              )}
            </>
          ),
          headerTitle: "My Profile",
          headerShadowVisible: false,
          headerTitleStyle: {
            color: text,
            fontFamily: "PoppinsMedium",
            fontSize: fontPixel(20),
          },
          headerTitleAlign: "center",
          headerShown: true,
          headerStyle: {
            backgroundColor: black,
          },
        }}
      />
    </Stack>
  );
}
