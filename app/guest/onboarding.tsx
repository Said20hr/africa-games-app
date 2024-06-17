import { StyleSheet, ImageBackground, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Button, Container } from "@/components/ui";
import { Image } from "expo-image";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useStatusBar } from "@/hooks/useStatusBar";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function OnBoarding() {
  const { push } = useRouter();
  function handleOnPress() {
    push("guest/login");
  }
  useStatusBar("light-content");

  return (
    <Container
      style={{ paddingHorizontal: 0, paddingTop: 0, alignItems: "flex-end" }}
    >
      <ImageBackground
        source={require("@/assets/images/onboarding-bg.png")}
        style={styles.imageBg}
        resizeMode="cover"
      />
      <LinearGradient
        style={styles.overlay}
        colors={[
          "rgba(102, 102, 102, 0.9)",
          "rgba(48, 48, 48, 0.9)",
          "rgba(0, 0, 0, 0.9)",
        ]}
      >
        <View style={styles.detailsContainer}>
          <Image
            source={require("@/assets/images/africa-games-login.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
          <ThemedText type="h1" style={styles.welcomeText}>
            Welcome
          </ThemedText>
          <ThemedText
            style={{ color: Colors.dark.text, marginTop: 20, fontSize: 12 }}
          >
            Hello from africa games, good to have you
          </ThemedText>
          <Button
            label="Login"
            style={{ marginTop: 30 }}
            onPress={handleOnPress}
          />
        </View>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  imageBg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    paddingBottom: "10%",
    paddingHorizontal: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoImage: {
    width: "80%",
    aspectRatio: 1,
  },
  welcomeText: {
    marginTop: -70,
  },
});
