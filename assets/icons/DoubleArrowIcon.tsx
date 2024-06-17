import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function DoubleArrowIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill={"none"}
      {...props}
    >
      <Path
        d="M21.538 7.287H1.128c-.16 0-.33.011-.48-.023-.394-.07-.639-.44-.62-.89.019-.487.244-.764.63-.834.188-.034.376-.034.573-.034H21.529c-.179-.243-.282-.394-.386-.532-.93-1.157-1.87-2.302-2.79-3.459-.442-.543-.33-1.341.225-1.503.216-.058.554.034.714.22a334.997 334.997 0 014.51 5.563c.339.428.283.867-.122 1.376-1.325 1.643-2.65 3.273-3.974 4.916-.123.15-.245.312-.376.463-.348.393-.77.393-1.053.011-.263-.347-.254-.867.057-1.26.949-1.18 1.907-2.36 2.856-3.54a7.35 7.35 0 01.348-.474zM2.537 18.599c.77.937 1.541 1.862 2.312 2.799.291.358.592.705.864 1.076.301.393.292.925.02 1.26-.302.359-.696.359-1.025-.046a771.938 771.938 0 01-4.473-5.529c-.32-.393-.32-.856.01-1.26a772.295 772.295 0 014.472-5.53c.32-.38.733-.358 1.025 0 .272.348.272.868-.038 1.262-.912 1.145-1.842 2.278-2.763 3.423-.131.162-.291.301-.432.44.019.058.047.116.066.162H22.929c.188 0 .385.011.564.07.329.126.507.427.488.855-.019.428-.216.706-.554.787-.198.046-.404.046-.611.046H2.612c-.028.07-.056.127-.075.185z"
        fill={props.fill ?? "#fff"}
      />
    </Svg>
  );
}

export default DoubleArrowIcon;