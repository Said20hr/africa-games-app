import type { EdgeInsets } from "react-native-safe-area-context";
import { useSafeAreaInsets as useSafeAreaInsetsInternal } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { heightPixel } from "@/shared/util/normalise";

function useSafeAreaInsets(): EdgeInsets {
  const insets = useSafeAreaInsetsInternal();

  return {
    ...insets,
    top: StatusBar.currentHeight
      ? StatusBar.currentHeight + heightPixel(18)
      : insets.top + heightPixel(12),
  };
}

export default useSafeAreaInsets;
