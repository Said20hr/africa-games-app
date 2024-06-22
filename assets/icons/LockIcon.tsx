import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Lock(props: SvgProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        d="M16 10.93V7.5a4 4 0 00-8 0v3.43m8 0c-1.012-.303-2.325-.43-4-.43-1.675 0-2.988.127-4 .43m8 0c2.223.665 3 2.18 3 5.07 0 4.206-1.647 5.5-7 5.5S5 20.206 5 16c0-2.89.777-4.405 3-5.07"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Lock;
