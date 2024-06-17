import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useSession } from "../ctx";
import GuestStack from "../GuestStack";
import { MMKV } from "react-native-mmkv";

enum AppState {
  LOADING = "loading",
  GUEST_USER = "guestUser",
  AUTHENTICATED = "authenticated",
}

export const storage = new MMKV();

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // const [appState, setAppState] = useState<AppState>(AppState.LOADING);

  // useEffect(() => {
  //   if (!session) setAppState(AppState.GUEST_USER);
  //   else setAppState(AppState.AUTHENTICATED);
  // }, [session]);

  if (isLoading) return null;
  if (!session) return <Redirect href="/guest" />;
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
