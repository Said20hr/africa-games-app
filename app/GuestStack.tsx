import React from "react";
import { Stack } from "expo-router";

export default function GuestStack() {
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="onboarding"
      >
        <Stack.Screen
          name="onboarding"
          options={{ animation: "slide_from_left" }}
        />
        <Stack.Screen name="guest/login" />
      </Stack>
    </>
  );
}
