import { Tabs } from "expo-router";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BottomTabAdd, DoubleArrow, File, Home } from "@/assets/icons";
import { User } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fontPixel, heightPixel } from "@/shared/util/normalise";
import { Platform } from "react-native";

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
          height: heightPixel(70),
          paddingTop: heightPixel(20),
          paddingBottom:
            Platform.OS === "android" ? heightPixel(12) : heightPixel(20),
        },
        tabBarLabelStyle: {
          fontSize: fontPixel(8),
          fontFamily: "Poppins",
          marginTop: 8,
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
          title: "Movements",
          tabBarIcon: ({ color, focused }) => (
            <DoubleArrow fill={focused ? primary : text} width={20} />
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
