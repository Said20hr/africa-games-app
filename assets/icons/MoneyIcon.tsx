import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function MoneyIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 15}
      viewBox="0 0 24 15"
      fill="none"
      {...props}
    >
      <Path
        d="M6 5v5m12-5v5M2.556 2.056C3.083 1.778 7.778 1.5 12 1.5s8.917.278 9.444.556c.528.277 1.056 3.222 1.056 5.444s-.528 5.167-1.056 5.444c-.527.278-5.222.556-9.444.556s-8.917-.278-9.444-.556C2.028 12.667 1.5 9.722 1.5 7.5s.528-5.167 1.056-5.444zM14.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MoneyIcon;
