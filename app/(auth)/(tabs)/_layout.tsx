import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

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
            <TabBarIcon
              name={"home-outline"}
              color={focused ? primary : text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Report"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={"file-tray-full-outline"}
              color={focused ? primary : text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={"heart-outline"}
              color={focused ? primary : text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"people"} color={focused ? primary : text} />
          ),
        }}
      />
    </Tabs>
  );
}
