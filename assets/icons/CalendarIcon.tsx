import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Calendar(props: SvgProps) {
  return (
    <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" {...props}>
      <Path
        d="M13 1v4M7 1v4m11.483 5H1.517m16.966 0C18.274 4.293 16.154 2.5 10 2.5S1.726 4.293 1.517 10m16.966 0c.011.32.017.654.017 1 0 6.5-2 8.5-8.5 8.5s-8.5-2-8.5-8.5c0-.346.006-.68.017-1"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Calendar;
