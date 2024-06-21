import * as React from "react";
import Svg, {
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from "react-native-svg";

function BottomTabAdd(props: SvgProps) {
  return (
    <Svg
      width={props.width ?? 45}
      height={props.height ?? 44}
      viewBox="0 0 45 44"
      fill="none"
      {...props}
    >
      <Path
        d="M14.5 22h16m-8-8v16"
        stroke={props.stroke ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BottomTabAdd;
