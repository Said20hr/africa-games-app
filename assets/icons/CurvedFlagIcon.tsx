import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function CurvedFlag(props: SvgProps) {
  return (
    <Svg width={18} height={21} viewBox="0 0 18 21" fill="none" {...props}>
      <Path
        d="M1.198 14.5s1-1 4-1 5 2 8 2 4-1 4-1v-12s-1 1-4 1-5-2-8-2-4 1-4 1v17"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default CurvedFlag;
