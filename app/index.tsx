import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";
import { ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "./ctx";
import { StackActions } from "@react-navigation/native";

const AfterSplash = () => {
  const { session, isLoading } = useSession();
  const { dispatch } = useNavigation();

  useEffect(() => {
    if (!isLoading) {
      if (
        session &&
        (session.user.role === "caissier" || session.user.role === "cashier")
      ) {
        dispatch(StackActions.replace("auth"));
      } else dispatch(StackActions.replace("guest"));
    }
  }, [session]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/onboarding-bg.png")}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
      <LinearGradient
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "absolute",
          paddingBottom: "10%",
        }}
        colors={[
          "rgba(102, 102, 102, 0.9)",
          "rgba(48, 48, 48, 0.9)",
          "rgba(0, 0, 0, 0.9)",
        ]}
      ></LinearGradient>
    </View>
  );
};

export default AfterSplash;
