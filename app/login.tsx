import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import {
  Button,
  Checkbox,
  Container,
  Input,
  TextButton,
} from "@/components/ui";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Lock, Mail } from "react-native-feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSession } from "./ctx";

export default function Login() {
  const { replace } = useRouter();
  const { signIn } = useSession();

  function handleOnPress() {
    signIn();
    replace("/");
  }

  return (
    <Container style={{ paddingTop: 0 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, paddingBottom: 60 }}
      >
        <View style={styles.detailsContainer}>
          <Image
            source={require("@/assets/images/africa-games-login.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>
        <ThemedText type="h1" style={{ textAlign: "center" }}>
          Welcome back!
        </ThemedText>
        <ThemedText
          type="h5"
          style={{ textAlign: "center", marginTop: 8, marginBottom: 24 }}
        >
          Login to continue using this app
        </ThemedText>
        <Input
          InitialIcon={<Mail color={Colors.dark.text} />}
          placeholder="Enter your email"
        />
        <Input
          InitialIcon={<Lock color={Colors.dark.text} />}
          placeholder="Enter your password"
          textContentType="password"
          containerProps={{ style: { marginTop: 24 } }}
        />
        <Checkbox text="Remember me" containerStyle={{ marginTop: 20 }} />
        <Button
          label="Login"
          style={{ marginTop: 30 }}
          onPress={handleOnPress}
        />
        <TextButton
          title="Forgot Password ?"
          textStyle={{ textAlign: "center", marginTop: 20 }}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  imageBg: {
    width: "100%",
    height: "100%",
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
