import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function List(props: SvgProps) {
  return (
    <Svg width={20} height={19} viewBox="0 0 20 19" fill="none" {...props}>
      <Path
        d="M6 5.5h8m-8 4h8m-6 4h4m-10.5-4C1.5 3 3.5 1 10 1s8.5 2 8.5 8.5-2 8.5-8.5 8.5-8.5-2-8.5-8.5z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default List;
