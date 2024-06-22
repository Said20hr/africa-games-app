import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Envelope(props: SvgProps) {
  return (
    <Svg width={22} height={17} viewBox="0 0 22 17" fill="none" {...props}>
      <Path
        d="M18.706 2.795C17.262 1.49 14.83 1 11 1c-3.83 0-6.262.49-7.705 1.795m15.41 0C20 3.965 20.5 5.788 20.5 8.5c0 5.735-2.235 7.5-9.5 7.5-7.265 0-9.5-1.765-9.5-7.5 0-2.712.5-4.536 1.795-5.705m15.41 0l-6.29 6.29a2 2 0 01-2.83 0l-6.29-6.29"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Envelope;
