import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function EmptyHome(props: SvgProps) {
  return (
    <Svg width={20} height={19} viewBox="0 0 20 19" fill="none" {...props}>
      <Path
        d="M16.438 17.5c.918 0 1.711-.628 1.835-1.537.117-.864.227-2.053.227-3.463 0-3 .168-4.832-3-8-1.461-1.461-3.094-2.581-4.198-3.26a2.474 2.474 0 00-2.605 0C7.594 1.92 5.961 3.04 4.5 4.5c-3.168 3.168-3 5-3 8 0 1.41.11 2.599.227 3.463.124.91.917 1.537 1.835 1.537h12.876z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default EmptyHome;
