import { Colors } from "@/constants/Colors";
import useSafeAreaInsets from "@/hooks/useSafeArea";
import { View, ViewProps } from "react-native";

const Container = (props: ViewProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        {
          paddingTop: top,
          paddingHorizontal: 16,
          backgroundColor: Colors.dark.background,
          flex: 1,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default Container;
