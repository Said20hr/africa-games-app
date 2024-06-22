import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function UserCirlce(props: SvgProps) {
  return (
    <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" {...props}>
      <Path
        d="M16 17.202c0-3.031-3.5-3.702-6-3.702s-6 .67-6 3.702M19 10.5a9 9 0 11-18 0 9 9 0 0118 0zm-6-3a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default UserCirlce;
