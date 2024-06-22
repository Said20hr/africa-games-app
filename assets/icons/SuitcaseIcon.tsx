import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Suitcase(props: SvgProps) {
  return (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill="none" {...props}>
      <Path
        d="M9 12.5v-2m0 2v2m0-2c-4 0-8-1-7.939-3M9 12.5c4 0 8-1 7.939-3M1.06 9.5c-.039.633-.061 1.307-.061 2 0 3.111.444 5.833.889 6.222.444.39 3.555.778 7.111.778 3.556 0 6.667-.389 7.111-.778.445-.389.889-3.11.889-6.222 0-.693-.022-1.367-.061-2M1.06 9.5c.137-2.208.482-3.92.828-4.222C2.333 4.888 6 4.593 6 4.593M16.939 9.5c-.137-2.208-.483-3.92-.828-4.222-.444-.39-4.111-.685-4.111-.685m-6 0A47.649 47.649 0 019 4.5c1.059 0 2.079.035 3 .093m-6 0V3.5c0-1.775 1.637-2 3-2s3 .225 3 2v1.093"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default Suitcase;
