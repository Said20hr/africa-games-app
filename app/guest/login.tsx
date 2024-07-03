import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
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
import ThemedText from "@/components/ThemedText";
import { useNavigation, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSession } from "../ctx";
import { ILoginPayload } from "@/shared/type/User.type";
import { storage } from "@/shared/util/mmkv";
import { REMEMBER_ME, USER_TOKEN } from "@/constants/Keys";
import { StackActions } from "@react-navigation/native";
import { i18n } from "@/constants/i18n";
import { Lock, User } from "@/assets/icons";

interface IOnSubmitForm extends ILoginPayload {
  checked: boolean;
}

export default function Login() {
  const { signIn } = useSession();
  const { dispatch } = useNavigation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm({
    defaultValues: {
      checked: true,
      matricule: "",
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
          storage.setItem(USER_TOKEN, data.data.user.token);
          signIn(data.data);
          dispatch(StackActions.replace("auth"));
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
    storage.setItem(REMEMBER_ME, data.checked);
    mutate({
      matricule: data.matricule,
      password: data.password,
    });
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "flex-end",
          flexGrow: 1,
          paddingBottom: "20%",
        }}
      >
        <View style={styles.detailsContainer}>
          <Image
            source={require("@/assets/images/africa-games-login.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
          <ThemedText
            type="HeadingLargestBold"
            style={{ textAlign: "center", marginTop: -60 }}
          >
            {i18n.t("login.welcomeBack")}
          </ThemedText>
          <ThemedText
            type="HeadingBoldSmall"
            style={{ textAlign: "center", marginTop: 8, marginBottom: 24 }}
          >
            {i18n.t("login.loginInstructions")}
          </ThemedText>
          <Controller
            control={control}
            name="matricule"
            render={({ field: { onChange, value } }) => (
              <Input
                autoCapitalize="characters"
                InitialIcon={
                  <User
                    stroke={Colors.dark.text}
                    style={{ marginBottom: Platform.OS === "ios" ? 0 : 4 }}
                  />
                }
                placeholder={i18n.t("login.enterMatriculePlaceholder")}
                onChangeText={(text) => onChange(text.toUpperCase())} // Ensure the text is converted to uppercase
                value={value}
                error={errors.matricule?.message?.toString()}
              />
            )}
            rules={{
              required: i18n.t("login.matriculeRequired"),
              minLength: {
                value: 4,
                message: i18n.t("login.invalidMatricule"),
              },
            }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                autoCapitalize="none"
                InitialIcon={
                  <Lock
                    stroke={Colors.dark.text}
                    style={{
                      marginLeft: -2,
                      marginBottom: Platform.OS === "ios" ? 0 : 4,
                    }}
                  />
                }
                placeholder={i18n.t("login.enterPasswordPlaceholder")}
                textContentType="password"
                containerProps={{ style: { marginTop: 16 } }}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message?.toString()}
              />
            )}
            rules={{
              required: i18n.t("login.passwordRequired"),
              minLength: {
                value: 6,
                message: i18n.t("login.passwordMinLength"),
              },
            }}
          />

          <Checkbox
            text={i18n.t("login.rememberMe")}
            containerStyle={{ marginTop: 20 }}
            onToggle={(checked) => {
              setValue("checked", checked);
            }}
            checked={getValues("checked")}
            {...register("checked")}
          />
          <Button
            label={i18n.t("login.loginButton")}
            style={{ marginTop: 30 }}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />
          <TextButton
            title={i18n.t("login.forgotPassword")}
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
    // flex: 1,
    justifyContent: "flex-end",
  },
  logoImage: {
    width: "80%",
    aspectRatio: 1,
    alignSelf: "center",
  },
});
