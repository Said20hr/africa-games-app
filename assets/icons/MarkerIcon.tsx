import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Marker(props: SvgProps) {
  return (
    <Svg width={60} height={75} viewBox="0 0 60 75" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.303 59.105c-1.315.329-2.583.855-3.667 1.668a8.66 8.66 0 00-2.55 3.056l-.192.382a1 1 0 01-1.788 0l-.192-.382a8.66 8.66 0 00-2.55-3.056c-1.084-.813-2.352-1.34-3.667-1.668C9.657 55.844 0 44.05 0 30 0 13.431 13.431 0 30 0c16.569 0 30 13.431 30 30 0 14.05-9.658 25.843-22.697 29.105zM30 75a3 3 0 100-6 3 3 0 000 6z"
        fill="#F19B3F"
        {...props}
      />
      <Path
        d="M21 32h18m-9-9v18m7-9a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Marker;
