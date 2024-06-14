import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query"; // Import useMutation from react-query
import axios from "axios";

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
import { useSession } from "../ctx";
import { ILoginPayload } from "@/shared/type/User.type";
import storage from "@/shared/util/mmkv";
import { REMEMBER_ME, USER_TOKEN } from "@/constants/Keys";

interface IOnSubmitForm extends ILoginPayload {
  checked: boolean;
}

export default function Login() {
  const { replace } = useRouter();
  const { signIn } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      checked: true,
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ILoginPayload) => {
      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/login`,
          data
        );
        return response.data;
      } catch (error) {
        if (error && typeof error === "object" && "message" in error)
          console.error(error.message);
      }
    },
    onSuccess: (data) => {
      if (data) {
        if ("data" in data && typeof data.data === "object") {
          storage.set(USER_TOKEN, data.data.user.token);
          signIn(data.data);
          replace("/");
        }
      } else {
        Toast.show({ type: "error", text1: "Invalid credentials" });
      }
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Internal server error" });
    },
  });

  const onSubmit = (data: IOnSubmitForm) => {
    console.log(data.checked);
    storage.set(REMEMBER_ME, data.checked);
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Container>
      <KeyboardAwareScrollView>
        <View style={styles.detailsContainer}>
          <Image
            source={require("@/assets/images/africa-games-login.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
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
            autoCapitalize="none"
            keyboardType="email-address"
            InitialIcon={<Mail color={Colors.dark.text} />}
            placeholder="Enter your email"
            onChangeText={(text) => setValue("email", text)}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message?.toString()}
          />
          <Input
            autoCapitalize="none"
            InitialIcon={<Lock color={Colors.dark.text} />}
            placeholder="Enter your password"
            textContentType="password"
            containerProps={{ style: { marginTop: 24 } }}
            onChangeText={(text) => setValue("password", text)}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
            })}
            error={errors.password?.message?.toString()}
          />
          <Checkbox
            initialChecked={true}
            text="Remember me"
            containerStyle={{ marginTop: 20 }}
            onToggle={(checked) => {
              setValue("checked", checked);
            }}
            {...register("checked")}
          />
          <Button
            label="Login"
            style={{ marginTop: 30 }}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />
          <TextButton
            title="Forgot Password ?"
            textStyle={{ textAlign: "center", marginTop: 20 }}
          />
        </View>
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
    // paddingBottom: 60,
    // alignItems: "center",
  },
  logoImage: {
    width: "80%",
    aspectRatio: 1,
    alignSelf: "center",
  },
});
