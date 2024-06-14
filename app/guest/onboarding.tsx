import { StyleSheet, ImageBackground, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Button, Container } from "@/components/ui";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useStatusBar } from "@/hooks/useStatusBar";
import React from "react";

export default function OnBoarding() {
  const { push } = useRouter();
  function handleOnPress() {
    push("guest/login");
  }
  useStatusBar("light-content");

  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <ImageBackground
        source={require("@/assets/images/onboarding-bg.png")}
        style={styles.imageBg}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.detailsContainer}>
          <Image
            source={require("@/assets/images/africa-games-login.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
          <ThemedText type="h2">Welcome</ThemedText>
          <ThemedText
            style={{ color: Colors.dark.text, marginTop: 20, fontSize: 12 }}
          >
            Lorem ipsum dolor sit amet. Et voluptatum vitae ut voluptatem
            numquam ea eaque .
          </ThemedText>
          <Button
            label="Login"
            style={{ marginTop: 30 }}
            onPress={handleOnPress}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  imageBg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.85)",
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
});
