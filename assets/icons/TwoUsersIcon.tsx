import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function TwoUsers(props: SvgProps) {
  return (
    <Svg width={24} height={21} viewBox="0 0 24 21" fill="none" {...props}>
      <Path
        d="M20.5 19.5A2.5 2.5 0 0023 17c0-2.327-1.952-3.301-4-3.708M15 9.5a4 4 0 000-8m-11.5 18h11A2.5 2.5 0 0017 17c0-4.08-6-4-8-4s-8-.08-8 4a2.5 2.5 0 002.5 2.5zm9.5-14a4 4 0 11-8 0 4 4 0 018 0z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default TwoUsers;
