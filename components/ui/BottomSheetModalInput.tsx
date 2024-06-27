import React, { ForwardedRef, useState } from "react";
import { heightPixel } from "@/shared/util/normalise";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity, View } from "react-native";
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
}

const BottomSheetModalInput = ({
  modalRef,
  handleSubmission,
  label,
  title,
  inputProps,
  buttonText,
}: AddProvisionModalProps) => {
  const { background, text } = useThemeColor();
  const [value, setValue] = useState("");

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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
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
        <View
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
        </View>
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
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheetModalInput;
