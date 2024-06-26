import { i18n } from "@/constants/i18n";
import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Text from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const SCREEN_WIDTH = Dimensions.get("window").width;

type TabbedScrollViewProps = {
  tabs: { key: string; title: string }[];
  children: React.ReactNode;
};

const TabbedScrollView = ({ tabs, children }: TabbedScrollViewProps) => {
  const scrollRefUserDetails = useRef<ScrollView>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const { primary, accent, text, black } = useThemeColor();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onPressSection = (index: number) => {
    setActiveIndex(index);
    scrollRefUserDetails.current?.scrollTo({
      animated: true,
      x: SCREEN_WIDTH * index,
    });
    Animated.spring(translateX, {
      toValue: index * (SCREEN_WIDTH / tabs.length),
      useNativeDriver: true,
    }).start();
  };

  function translateWithScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    Animated.timing(translateX, {
      toValue: e.nativeEvent.contentOffset.x / tabs.length,
      useNativeDriver: true,
      duration: 0,
    }).start();
  }

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
    Animated.timing(translateX, {
      toValue: e.nativeEvent.contentOffset.x / tabs.length,
      useNativeDriver: true,
      duration: 0,
    }).start();
  }

  return (
    <>
      <View>
        <ScrollView
          horizontal
          style={{ width: SCREEN_WIDTH }}
          contentContainerStyle={{ position: "relative" }}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          <>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={{
                  width: SCREEN_WIDTH / tabs.length,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 35,
                }}
                onPress={() => onPressSection(index)}
              >
                <Text
                  type="TitleSmallest"
                  style={{ color: activeIndex === index ? text : accent }}
                >
                  {i18n.t(tab.title)}
                </Text>
              </TouchableOpacity>
            ))}
          </>
          <Animated.View
            style={{
              position: "absolute",
              width: SCREEN_WIDTH / tabs.length,
              height: 2,
              backgroundColor: primary,
              bottom: 20,
              transform: [{ translateX }],
            }}
          />
        </ScrollView>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: black }}
        scrollEventThrottle={16}
        onScroll={translateWithScroll}
        ref={scrollRefUserDetails}
        onMomentumScrollEnd={onScrollEnd}
      >
        {children}
      </ScrollView>
    </>
  );
};

export default TabbedScrollView;
