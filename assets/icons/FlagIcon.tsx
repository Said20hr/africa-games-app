import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Flag(props: SvgProps) {
  return (
    <Svg width={15} height={21} viewBox="0 0 15 21" fill="none" {...props}>
      <Path
        d="M1 15.5v-14l11.116 5.188c1.54.718 1.54 2.906 0 3.624L1 15.5zm0 0v4"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Flag;
