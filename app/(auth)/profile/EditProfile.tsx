import { Input } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { User } from "react-native-feather";

const EditProfile: React.FC = () => {
  const { black } = useThemeColor();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: black, paddingHorizontal: 16 }}>
        <Input label="Name" InitialIcon={<User />} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default EditProfile;
