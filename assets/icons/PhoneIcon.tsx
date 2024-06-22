import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Phone(props: SvgProps) {
  return (
    <Svg width={22} height={21} viewBox="0 0 22 21" fill="none" {...props}>
      <Path
        d="M14 1.5c1.531.17 2.91.911 4 2 1.09 1.089 1.828 2.469 2 4M13.5 5c.737.144 1.469.469 2 1 .531.531.856 1.263 1 2m-9.3 6.299C.303 7.4 1.283 4.241 2.01 3.223c.094-.164 2.396-3.611 4.865-1.589C13 6.68 5.5 6.5 10.389 11.111c4.89 4.612 4.432-2.611 9.477 3.514 2.022 2.469-1.425 4.771-1.588 4.864-1.018.728-4.178 1.709-11.078-5.19z"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Phone;
