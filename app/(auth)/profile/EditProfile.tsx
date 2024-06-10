import { Button, Input } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import {
  ArrowLeft,
  Edit,
  Lock,
  Mail,
  MapPin,
  User,
} from "react-native-feather";
import { ThemedText as Text } from "@/components/ThemedText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";

const EditProfile: React.FC = () => {
  const { black, text, primary, accent } = useThemeColor();
  const { goBack } = useNavigation();
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={goBack}>
              <ArrowLeft color={text} />
            </TouchableOpacity>
          ),
          headerTitle: () => <Text type="h4">My Profile</Text>,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: black },
          headerTitleAlign: "left",
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          // flex: 1,
          backgroundColor: black,
          paddingHorizontal: 16,
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 30,
        }}
        style={{ flex: 1 }}
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
            <Text type="h4">CHLOE SMITH</Text>
            <Text type="b1" style={{ color: accent }}>
              Gamer
            </Text>
          </View>
          <View style={styles.spacedRow}>
            <Input
              label="Name"
              InitialIcon={<User color={text} />}
              placeholder="xxxxxx"
            />
            <Input
              label="Username"
              InitialIcon={<User color={text} />}
              placeholder="xxxxxx"
            />
          </View>
          <View>
            <Input
              label="Email"
              InitialIcon={<Mail color={text} />}
              placeholder="+92363663632"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View>
            <Input
              label="Password"
              InitialIcon={<Lock color={text} />}
              placeholder="+92363663632"
              textContentType="password"
            />
          </View>
          <View>
            <Input
              label="Working store"
              InitialIcon={<MapPin color={text} />}
              placeholder="Store number 206"
            />
          </View>
        </View>
        <Button label="Update" />
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  spacedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  image: {
    width: 120,
    height: 120,
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
