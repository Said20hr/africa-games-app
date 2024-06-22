import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function ThreeUsers(props: SvgProps) {
  return (
    <Svg width={24} height={17} viewBox="0 0 24 17" fill="none" {...props}>
      <Path
        d="M19 10.5c2.21 0 4 2 4 3.5a1.5 1.5 0 01-1.5 1.5H21m-4-8a3 3 0 100-6m-12 9c-2.21 0-4 2-4 3.5a1.5 1.5 0 001.5 1.5H3m4-8a3 3 0 010-6m9.5 14h-9A1.5 1.5 0 016 14c0-2.5 3-3.5 6-3.5s6 1 6 3.5a1.5 1.5 0 01-1.5 1.5zM15 4.5a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default ThreeUsers;
