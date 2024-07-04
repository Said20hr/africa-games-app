import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export const useBottomSheetBackHandler = (
  bottomSheetRef: React.RefObject<BottomSheetModal | null>,
  onSucces?: () => void
) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
    null
  );
  const handleSheetPositionChange = useCallback<
    NonNullable<BottomSheetModalProps["onChange"]>
  >(
    (index: number) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            bottomSheetRef.current?.dismiss();
            if (onSucces) onSucces();
            return true;
          }
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef]
  );
  return { handleSheetPositionChange };
};
