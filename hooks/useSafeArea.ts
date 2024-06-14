import type { EdgeInsets } from "react-native-safe-area-context";
import { useSafeAreaInsets as useSafeAreaInsetsInternal } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

function useSafeAreaInsets(): EdgeInsets {
  const insets = useSafeAreaInsetsInternal();

  return {
    ...insets,
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 6 : insets.top,
  };
}

export default useSafeAreaInsets;
