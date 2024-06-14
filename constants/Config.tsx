import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BaseToast, ErrorToast, ToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: (props: ToastProps) => (
    <SafeAreaView>
      <BaseToast {...props} />
    </SafeAreaView>
  ),
  error: (props: ToastProps) => (
    <SafeAreaView>
      <ErrorToast {...props} />
    </SafeAreaView>
  ),
};
