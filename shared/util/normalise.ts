import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const widthBaseScale = SCREEN_WIDTH / 393;
const heightBaseScale = SCREEN_HEIGHT / 852;

function normalize(size: number, based: "width" | "height") {
  const newSize =
    based === "height" ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const widthPixel = (size: number) => {
  return normalize(size, "width");
};
const heightPixel = (size: number) => {
  return normalize(size, "height");
};
const fontPixel = (size: number) => {
  return widthPixel(size);
};

export { widthPixel, heightPixel, fontPixel };
