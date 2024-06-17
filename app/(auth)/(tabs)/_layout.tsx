import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "@/components/ThemedText";
import { DoubleArrow, File, Home } from "@/assets/icons";
import { User } from "react-native-feather";

export default function TabLayout() {
  const { background, primary, text } = useThemeColor();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home stroke={focused ? primary : text} />
          ),
        }}
      />
      <Tabs.Screen
        name="Report"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, focused }) => (
            <File stroke={focused ? primary : text} />
          ),
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: "Movements",
          tabBarIcon: ({ color, focused }) => (
            <DoubleArrow fill={focused ? primary : text} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <User color={focused ? primary : text} />
          ),
        }}
      />
    </Tabs>
  );
}
