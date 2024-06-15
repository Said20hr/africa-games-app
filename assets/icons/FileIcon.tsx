import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function FileIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width ?? 17}
      height={props.height ?? 22}
      viewBox="0 0 17 22"
      fill={"none"}
      {...props}
    >
      <Path
        d="M5.75 12h4m-4 4h6M9.821 1.53v4.303a2 2 0 002 2H16.1M9.821 1.53c-.34-.02-.697-.029-1.071-.029-5.735 0-7.5 2.235-7.5 9.5 0 7.265 1.765 9.5 7.5 9.5s7.5-2.235 7.5-9.5c0-1.185-.047-2.237-.15-3.167M9.82 1.53L16.1 7.833"
        stroke={props.stroke ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FileIcon;
