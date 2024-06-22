import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function User(props: SvgProps) {
  return (
    <Svg width={18} height={21} viewBox="0 0 18 21" fill="none" {...props}>
      <Path
        d="M14.5 19.5h-11A2.5 2.5 0 011 17c0-4.08 6-4 8-4s8-.08 8 4a2.5 2.5 0 01-2.5 2.5zM9 9.5a4 4 0 100-8 4 4 0 000 8z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default User;
