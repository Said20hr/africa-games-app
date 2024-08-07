import { Tabs } from "expo-router";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BottomTabAdd, DoubleArrow, File, Home } from "@/assets/icons";
import { Plus, User } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fontPixel, heightPixel } from "@/shared/util/normalise";
import { Platform } from "react-native";
import { i18n } from "@/constants/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import { Text } from "@/components/ui";

export default function TabLayout() {
  const { background, primary, text, black } = useThemeColor();
  const { locale } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: "transparent",
          height: heightPixel(70),
          paddingTop: heightPixel(20),
          paddingBottom:
            Platform.OS === "android" ? heightPixel(12) : heightPixel(20),
        },
        tabBarLabelStyle: {
          fontSize: fontPixel(10),
          fontFamily: "Poppins",
          marginTop: 8,
        },
      }}
      initialRouteName="AddTab"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("screens.home"),
          tabBarIcon: ({ color, focused }) => (
            <Home stroke={focused ? primary : text} width={24} height={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Report"
        options={{
          title: i18n.t("screens.reports"),
          tabBarIcon: ({ color, focused }) => (
            <File stroke={focused ? primary : text} width={24} height={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddTab"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity
              style={{ width: 50, aspectRatio: 1, marginTop: 10 }}
            >
              <LinearGradient
                colors={["#797986", "#1D1D20"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  flex: 1,
                  borderRadius: 200,
                  width: 100,
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BottomTabAdd stroke={focused ? primary : "#fff"} />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: i18n.t("screens.movements"),
          tabBarIcon: ({ color, focused }) => (
            <DoubleArrow
              fill={focused ? primary : text}
              width={24}
              height={24}
            />
          ),
          headerShown: true,
          headerLeft: () => (
            <Text
              type="HeadingMediumBold"
              style={{ marginLeft: 20, fontSize: fontPixel(20) }}
            >
              {i18n.t("screens.movements")}
            </Text>
          ),
          headerTitle: "",
          headerStyle: { backgroundColor: black },
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t("screens.account"),
          tabBarIcon: ({ color, focused }) => (
            <User color={focused ? primary : text} width={24} height={24} />
          ),
        }}
      />
    </Tabs>
  );
}
