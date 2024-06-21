import { StyleSheet, ImageBackground, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Button, Container } from "@/components/ui";
import { Image } from "expo-image";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useStatusBar } from "@/hooks/useStatusBar";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { heightPixel } from "@/shared/util/normalise";
import { i18n } from "@/constants/i18n";

export default function OnBoarding() {
  const { push } = useRouter();
  function handleOnPress() {
    push("guest/login");
  }
  useStatusBar("light-content");

  return (
    <Container
      style={{
        paddingHorizontal: 0,
        paddingTop: 0,
      }}
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
          <View
            style={{
              height: "50%",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                source={require("@/assets/images/africa-games-login.png")}
                style={styles.logoImage}
                contentFit="contain"
              />
              <ThemedText type="HeadingLargestBold" style={styles.welcomeText}>
                {i18n.t("onboarding.welcome")}
              </ThemedText>
            </View>
            <Button
              label={i18n.t("onboarding.login")}
              style={{ marginBottom: heightPixel(30) }}
              onPress={handleOnPress}
            />
          </View>
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
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
  },
  logoImage: {
    width: "80%",
    aspectRatio: 1,
    marginTop: heightPixel(-100),
  },
  welcomeText: {
    marginTop: heightPixel(-60),
  },
});
