import React, { ForwardedRef, useEffect, useState } from "react";
=======
import { heightPixel } from "@/shared/util/normalise";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Keyboard, Platform, TouchableOpacity, View } from "react-native";
import Text from "./Text";
import { i18n } from "@/constants/i18n";
import Input, { MyTextInputProps } from "./Input";
import Button from "./Button";
import { Money } from "@/assets/icons";
import { X } from "react-native-feather";
import { useThemeColor } from "@/hooks/useThemeColor";

interface AddProvisionModalProps {
  modalRef: ForwardedRef<BottomSheetModal>;
  title: string;
  label: string;
  handleSubmission: (text: string) => void;
  inputProps?: MyTextInputProps;
  buttonText: string;
  buttonLoading?: boolean;
}

const BottomSheetModalInput = ({
  modalRef,
  handleSubmission,
  label,
  title,
  inputProps,
  buttonText,
  buttonLoading,
}: AddProvisionModalProps) => {
  const { background, text } = useThemeColor();
  const [value, setValue] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [enableDismissOnClose, setEnableDismissOnClose] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardOpen(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    if (keyboardOpen) {
      setEnableDismissOnClose(false);
    }
  }, [keyboardOpen]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (!enableDismissOnClose && keyboardOpen) {
      setTimeout(() => {
        setEnableDismissOnClose(true);
      }, 1);
    }
  }, [enableDismissOnClose, keyboardOpen]);

  function closeModal() {
    // @ts-ignore
    modalRef?.current?.close();
  }

  function handleAddProvision() {
    setValue("");
    handleSubmission(value);
    closeModal();
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      handleIndicatorStyle={{ width: "0%", height: 0 }}
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="restore"
      enableDismissOnClose={enableDismissOnClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      backgroundStyle={{ backgroundColor: background }}
    >
      <BottomSheetView
        style={{
          backgroundColor: background,
          paddingVertical: 30,
          gap: heightPixel(20),
          paddingHorizontal: 20,
        }}
      >
        <BottomSheetView
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ textAlign: "center", flex: 1 }} type="TitleMedium">
            {title}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={closeModal}
          >
            <X color={text} />
          </TouchableOpacity>
        </BottomSheetView>
        <Input
          label={label}
          bottomSheetInput
          value={value}
          onChangeText={setValue}
          {...inputProps}
        />
        <Button
          label={buttonText}
          style={{ paddingVertical: 12, marginBottom: 40 }}
          disabled={value === "" || value.length < 1}
          onPress={handleAddProvision}
          loading={buttonLoading}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheetModalInput;
