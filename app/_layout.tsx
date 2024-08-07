import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "./ctx";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/query-client";
import { toastConfig } from "@/constants/Config";
import { TranslationLanguageProvider } from "@/hooks/useTranslation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { getLocales } from "expo-localization";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [locale, setLocale] = useState<string>(
    getLocales()[0].languageCode ?? "en"
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <TranslationLanguageProvider locale={locale} setLocale={setLocale}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="auth"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="guest"
                  options={{ animation: "slide_from_right" }}
                />
              </Stack>
              <Toast config={toastConfig} />
            </TranslationLanguageProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SessionProvider>
    </QueryClientProvider>
  );
}
