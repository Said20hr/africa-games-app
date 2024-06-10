import { Colors } from "@/constants/Colors";

export function useThemeColor() {
  const theme = "dark";
  const colorFromTheme = Colors[theme];

  return colorFromTheme;
}
