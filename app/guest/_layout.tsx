import React from "react";
import { Stack } from "expo-router";

export default function GuestStack() {
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        initialRouteName="onboarding"
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
