import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Edit(props: SvgProps) {
  return (
    <Svg width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
      <Path
        d="M14.444 6.188l-8.998 8.998c-.659.659-1.179 1.458-1.337 2.376-.16.927-.213 2.077.335 2.625.549.549 1.699.496 2.626.336.918-.158 1.717-.678 2.376-1.337l8.998-8.998m-4-4s3-3 5-1-1 5-1 5m-4-4l4 4"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Edit;
