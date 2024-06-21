import React from "react";
import { Stack } from "expo-router";
import { MMKV } from "react-native-mmkv";

enum AppState {
  LOADING = "loading",
  GUEST_USER = "guestUser",
  AUTHENTICATED = "authenticated",
}

export const storage = new MMKV();

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/EditProfile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
