import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function MapPin(props: SvgProps) {
  return (
    <Svg width={18} height={21} viewBox="0 0 18 21" fill="none" {...props}>
      <Path
        d="M9.816 19.108C13.85 17.05 17 13.643 17 9.5a8 8 0 10-16 0c0 4.143 3.15 7.55 7.184 9.608.513.261 1.12.261 1.632 0z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
      <Path
        d="M12 9.5a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default MapPin;
