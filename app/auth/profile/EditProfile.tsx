import { Button, Container, Input } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  Edit,
  Lock,
  Mail,
  MapPin,
  User,
} from "react-native-feather";
import Text from "@/components/ThemedText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";
import { useSession } from "@/app/ctx";
import { fontPixel, heightPixel } from "@/shared/util/normalise";

const IMAGE_WIDTH = Dimensions.get("screen").width * 0.45;

const EditProfile: React.FC = () => {
  const { black, text, primary, accent } = useThemeColor();
  const { goBack } = useNavigation();
  const { session } = useSession();

  return (
    <>
      {/* <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              {Platform.OS === "ios" && (
                <TouchableOpacity onPress={goBack}>
                  <ArrowLeft color={text} />
                </TouchableOpacity>
              )}
            </>
          ),
          headerTitle: "My Profile",
          headerShadowVisible: false,
          headerTitleStyle: {
            color: text,
            fontFamily: "PoppinsMedium",
            fontSize: fontPixel(20),
          },
          headerTitleAlign: "center",
          // headerTitleAlign: "left",
        }}
      /> */}
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            // flex: 1,

            paddingHorizontal: 16,
            flexGrow: 1,
            justifyContent: "space-between",
            paddingBottom: 30,
            marginTop: 20,
          }}
          style={{ flex: 1, backgroundColor: black }}
        >
          <View style={{ flex: 1, gap: 16 }}>
            <View style={styles.imageContainer}>
              <TouchableOpacity>
                <Image
                  source={require("@/assets/images/user-header.png")}
                  style={styles.image}
                />
                <View
                  style={[styles.iconContainer, { backgroundColor: primary }]}
                >
                  <Edit color={text} strokeWidth={3} />
                </View>
              </TouchableOpacity>
              <Text type="TitleMedium">
                {session?.user.firstname.toUpperCase()}{" "}
                {session?.user.lastname.toUpperCase()}
              </Text>
              <Text type="BodySmall" style={{ color: accent }}>
                {session?.user.role.charAt(0).toUpperCase()}
                {session?.user.role.slice(1)}
              </Text>
            </View>
            <View style={styles.spacedRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Name"
                  InitialIcon={<User color={text} />}
                  placeholder="xxxxxx"
                  value={`${session?.user.firstname} ${session?.user.lastname}`}
                  // containerProps={{ style: { width: "70%" } }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Matricule"
                  InitialIcon={<User color={text} />}
                  placeholder="xxxxxx"
                  // containerProps={{ style: { width: "70%" } }}
                  value={session?.user.matricule}
                />
              </View>
            </View>
            <View>
              <Input
                label="Email"
                InitialIcon={<Mail color={text} />}
                placeholder="+92363663632"
                keyboardType="email-address"
                autoCapitalize="none"
                value={session?.user.email}
              />
            </View>
            <View>
              <Input
                label="Password"
                InitialIcon={<Lock color={text} />}
                placeholder="xxxxxxxxxx"
                textContentType="password"
                // value={session?.user.}
              />
            </View>
            <View>
              <Input
                label="Working store"
                InitialIcon={<MapPin color={text} />}
                placeholder="Store number 206"
                value={session?.casino.name}
              />
            </View>
          </View>
          <Button label="Update" style={{ marginTop: heightPixel(30) }} />
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  spacedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 200,
  },
  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    borderRadius: 100,
    padding: 8,
    bottom: 0,
  },
});

export default EditProfile;
