import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function CreditCard(props: SvgProps) {
  return (
    <Svg width={20} height={15} viewBox="0 0 20 15" fill="none" {...props}>
      <Path
        d="M5.198 9.5h5m8.906-4H1.293m17.811 0c-.168-1.753-.537-3.087-.905-3.333-.5-.334-4-.667-8-.667s-7.5.333-8 .667c-.37.246-.738 1.58-.906 3.333m17.811 0c.06.624.095 1.3.095 2 0 2.667-.5 5-1 5.333-.5.334-4 .667-8 .667s-7.5-.333-8-.667c-.5-.333-1-2.666-1-5.333 0-.7.034-1.376.094-2"
        stroke="#E99213"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </Svg>
  );
}

export default CreditCard;
