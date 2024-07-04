import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ModalProps,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "@/components/Header";
import Text from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Checkbox, Input } from "@/components/ui";
import { AlertCircle, MapPin, X } from "react-native-feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AnimatedCircularProgress from "@/components/ui/AnimatedCircularProgress";
import {
  getProgressPercentage,
  getProgressUntilNineAMTomorrow,
  getTimeRemaining,
  getTimeUntilNineAMTomorrow,
} from "@/shared/util/moment";
import { IAuthContext, useSession } from "@/app/ctx";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "@/api/query-client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { CashIn, CashOut, Money, Marker as MarkerIcon } from "@/assets/icons";
import { useRouter } from "expo-router";
import { fontPixel, heightPixel, widthPixel } from "@/shared/util/normalise";
import { i18n } from "@/constants/i18n";
import Svg, {
  G,
  Rect,
  Defs,
  RadialGradient,
  Stop,
  Path,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { IKeyConfirmation, IShiftAttendance } from "@/shared/type/Report.type";
import { useTranslation } from "@/hooks/useTranslation";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";

const { width, height } = Dimensions.get("window");
const FORM_WIDTH = width - 32;
const SVG_HEIGHT = height / 1.2;

let CURRENT_TIME = new Date();
// CURRENT_TIME.setHours(CURRENT_TIME.getHours() + 20);

const originalWidth = 393;
const originalHeight = 604;
const aspectRatio = originalWidth / originalHeight;

interface RouletteData {
  id: number;
  key_in: string;
  key_out: string;
  identifier: string;
}

interface RouletteFilledData extends RouletteData {
  keyInEnd: number | null;
  keyOutEnd: number | null;
}

enum Sections {
  FORM = "FORM",
  MODAL = "MODAL",
  DURING_SHIFT_TIMER = "DURING_SHIFT_TIMER",
  AFTER_SHIFT_TIMER = "AFTER_SHIFT_TIMER",
  START_SHIFT = "START_SHIFT",
  END_SHIFT = "END_SHIFT",
}

type ReportFormProps = {
  handleSubmit: () => void;
  location: Location.LocationObject;
  address: string;
};

type ReportWaitingTimerProps = {
  onBack: () => void;
  color: string;
  progress: number;
  timeRemaining: string;
  description: string;
};

type ReportModalProps = {
  continuePress: () => void;
  visible: boolean;
};

interface ConfirmKeysModalProps extends ModalProps {
  title: string;
  closeModal: () => void;
  onApproveKeys: (data: IKeyConfirmation[], lastKeyChecked: boolean) => void;
}

type AnimatedGetCurrentLocationProps = {
  visible: boolean;
  location: Location.LocationObject | null;
};

type GetCurrentLocationProps = {
  onSubmit: (location: Location.LocationObject, address: string) => void;
  currentLocationVisible: boolean;
  closeCurrentLocation: () => void;
  buttonLoading?: boolean;
};

type RouletteFormProps = {
  rouletteData: RouletteFilledData;
  currentIndex: number;
  totalIndexes: number;
  nextHandler: (index: number) => void;
  backHandler: (index: number) => void;
  keyInChange: (value: string) => void;
  keyOutChange: (value: string) => void;
};

const AnimatedGetCurrentLocation = ({
  visible,
  location,
}: AnimatedGetCurrentLocationProps) => {
  const translateY = useRef(new Animated.Value(height * 1.2)).current;
  const { background, text } = useThemeColor();

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height * 1.2,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        backgroundColor: "#111",
        width,
        height,
        bottom: "80%",
        paddingTop: "25%",
      }}
    >
      <MapView
        region={{
          longitude: location?.coords.longitude ?? -122.4324,
          latitude: location?.coords.latitude ?? 37.78825,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
        userInterfaceStyle="dark"
        showsUserLocation={false}
        style={{
          position: "absolute",
          zIndex: 1002,
          width,
          height,
          top: "3%",
        }}
        scrollEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{
            longitude: location?.coords.longitude ?? -122.4324,
            latitude: location?.coords.latitude ?? 37.78825,
          }}
          // image={require("@/assets/images/marker-icon.png")}
          // style={{ width: 24, height: 24, maxWidth: 24, maxHeight: 24 }}
        >
          <MarkerIcon />
        </Marker>
      </MapView>
    </Animated.View>
  );
};

const GetCurrentLocation = forwardRef<
  BottomSheetModal,
  GetCurrentLocationProps
>(
  (
    { closeCurrentLocation, currentLocationVisible, onSubmit, buttonLoading },
    modalRef
  ) => {
    const { background, text } = useThemeColor();
    const [location, setLocation] = useState<Location.LocationObject | null>(
      null
    );
    const [address, setAddress] = useState<string>("");
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
      modalRef as RefObject<BottomSheetModal>,
      closeCurrentLocation
    );

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Error", "Request to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        getCurrentPosition(location.coords);
      })();
    }, []);

    const getCurrentPosition = useCallback(
      async (coords: { latitude: number; longitude: number }) => {
        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${process.env.EXPO_PUBLIC_API_KEY}`;
          const { data } = await axios.get(url);
          if (data.results.length > 0) {
            const address = data?.results[0]?.formatted_address;
            if (address) {
              setAddress(address);
            }
          }
        } catch (error) {
          console.error("Error getting location address:", error);
        }
      },
      []
    );

    function handleSubmit() {
      if (location) onSubmit(location, address);
      else
        Alert.alert("Error", "Please allow access to location from settings");
    }

    return (
      <>
        <AnimatedGetCurrentLocation
          visible={currentLocationVisible}
          location={location}
        />
        <BottomSheetModal
          ref={modalRef}
          enableDynamicSizing
          onChange={handleSheetPositionChange}
          style={{ zIndex: 1001 }}
          handleIndicatorStyle={{ width: "0%", height: 0 }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backgroundStyle={{ backgroundColor: background }}
        >
          <BottomSheetView
            style={{
              backgroundColor: background,
              paddingBottom: 40,
              paddingTop: 30,
              zIndex: 1002,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                position: "relative",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{ textAlign: "center", flex: 1, color: text }}
                type="TitleMedium"
              >
                Get the location
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0 }}
                onPress={closeCurrentLocation}
              >
                <X color={text} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 22,
              }}
            >
              <Text style={{ flex: 1 }}>
                {address === "" ? "No access" : address}
              </Text>
              <Text style={{ marginRight: 20 }}>
                {" "}
                {CURRENT_TIME.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
            <Button
              label="Get"
              onPress={handleSubmit}
              loading={buttonLoading}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  }
);

const ConfirmKeysModal = (props: ConfirmKeysModalProps) => {
  const { text, primary, success, background, accent } = useThemeColor();
  const { title, closeModal, onApproveKeys } = props;
  const { session } = useSession() as IAuthContext;

  let keysCheckedTemp: {
    keyIn: boolean;
    keyOut: boolean;
    reason: string;
  }[] = [];
  session?.keys.map((item) => {
    keysCheckedTemp.push({ keyIn: true, keyOut: true, reason: "" });
  });

  keysCheckedTemp.push({ keyIn: true, keyOut: true, reason: "" }); // final cash and we only need keyOut here
  const [keysChecked, setKeysChecked] = useState(keysCheckedTemp);

  const opacityAnim = useRef(
    keysCheckedTemp.map(() => new Animated.Value(0))
  ).current;

  function toggleCheckbox(index: number, keyIn: boolean, check: boolean) {
    const keysCheckedLocal = [...keysChecked];
    if (keyIn) keysCheckedLocal[index].keyIn = check;
    else keysCheckedLocal[index].keyOut = check;

    if (keysCheckedLocal[index].keyIn && keysCheckedLocal[index].keyOut) {
      keysCheckedLocal[index].reason = "";
      handleInputAnimation(index, "hide");
    } else handleInputAnimation(index, "show");
    setKeysChecked(keysCheckedLocal);
  }

  function handleApprove() {
    if (
      keysChecked.some(
        (item) =>
          (!item.keyIn && item.reason === "") ||
          (!item.keyOut && item.reason === "")
      )
    ) {
      return Alert.alert("Error", i18n.t("addTab.emptyReasonError"));
    }
    const keysConfirmed: IKeyConfirmation[] = [];
    session?.keys.map((item, index) => {
      keysConfirmed.push({
        checked: keysChecked[index].keyIn && keysChecked[index].keyOut,
        issue: keysChecked[index].reason,
        identifier: item.identifier,
        key_in: item.key_in_end,
        key_out: item.key_out_end,
      });
    });
    onApproveKeys(keysConfirmed, keysChecked[keysChecked.length - 1].keyOut);
  }

  function handleInputAnimation(index: number, action: "show" | "hide") {
    Animated.timing(opacityAnim[index], {
      toValue: action === "show" ? 1 : 0,
      useNativeDriver: true,
      duration: 500,
    }).start();
  }

  return (
    <Modal transparent animationType="slide" {...props}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: background,
            width: "90%",
            alignSelf: "center",
            paddingVertical: heightPixel(15),
            borderRadius: 20,
            paddingHorizontal: 20,
            maxHeight: height * 0.8,
          }}
        >
          <View
            style={{
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ textAlign: "center", flex: 1 }} type="TitleMedium">
              {title}
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", right: 0 }}
              onPress={closeModal}
            >
              <X color={text} />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            contentContainerStyle={{ gap: 20, paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            contentOffset={{ y: heightPixel(150), x: 0 }}
            extraHeight={heightPixel(250)}
          >
            {session!.keys.length > 0 &&
              session!.keys.map((item, index) => (
                <View key={index}>
                  <View
                    style={{
                      borderColor: primary,
                      borderWidth: 1,
                      paddingVertical: 8,
                      width: "100%",
                      borderRadius: 6,
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Text type="SubtitleMedium">{item.identifier}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        type="TitleSmall"
                        style={{ fontSize: fontPixel(16) }}
                      >
                        Keys in
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Checkbox
                          checked={keysChecked[index].keyIn}
                          onToggle={(check) =>
                            toggleCheckbox(index, true, check)
                          }
                          text={item.key_in_end}
                        />
                        {/* <Text type="SubtitleLight">{item.key_in_end}</Text> */}
                      </View>
                    </View>
                    <View>
                      <Text
                        type="TitleSmall"
                        style={{ fontSize: fontPixel(16) }}
                      >
                        Keys out
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Checkbox
                          checked={keysChecked[index].keyOut}
                          onToggle={(check) =>
                            toggleCheckbox(index, false, check)
                          }
                          text={item.key_out_end}
                        />
                        {/* <Text type="SubtitleLight">{item.key_out_end}</Text> */}
                      </View>
                    </View>
                  </View>
                  <Animated.View
                    style={{
                      opacity: opacityAnim[index],
                      height:
                        keysChecked[index].keyIn && keysChecked[index].keyOut
                          ? 0
                          : "auto",
                      marginTop:
                        keysChecked[index].keyIn && keysChecked[index].keyOut
                          ? 0
                          : heightPixel(17),
                    }}
                  >
                    <Input
                      multiline
                      InitialIcon={<AlertCircle color={text} />}
                      value={keysChecked[index].reason}
                      containerProps={{
                        style: {
                          height:
                            keysChecked[index].keyIn &&
                            keysChecked[index].keyOut
                              ? 0
                              : heightPixel(150),
                          alignItems: "flex-start",
                          backgroundColor: "#272727",
                        },
                      }}
                      labelStyle={{
                        fontFamily: "Poppins-SemiBold",
                        fontWeight: "600",
                        fontSize: fontPixel(16),
                      }}
                      placeholder="Reason for unchecked value"
                      label="Reason"
                      onChangeText={(text) => {
                        const keysCheckedLocal = [...keysChecked];
                        keysCheckedLocal[index].reason = text;
                        setKeysChecked(keysCheckedLocal);
                      }}
                      blurColor={background}
                    />
                  </Animated.View>
                </View>
              ))}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {keysChecked.length > 1 && (
                <View
                  style={{
                    width: "100%",
                    height: 2,
                    backgroundColor: "#272727",
                    marginVertical: 8,
                  }}
                />
              )}
              <Text
                type="TitleSmall"
                style={{ fontSize: fontPixel(16), marginTop: 12 }}
              >
                {i18n.t("addTab.finalCash")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Checkbox
                  checked={keysChecked[session!.keys.length].keyOut}
                  onToggle={(check) =>
                    toggleCheckbox(session!.keys.length, false, check)
                  }
                  text={session?.casino.initial_amount}
                />
                {/* <Text type="SubtitleLight">
                  {session?.casino.initial_amount}
                </Text> */}
              </View>
              <Animated.View
                style={{
                  opacity: opacityAnim[keysChecked.length - 1],
                  height:
                    keysChecked[keysChecked.length - 1].keyIn &&
                    keysChecked[keysChecked.length - 1].keyOut
                      ? 0
                      : "auto",
                  width: "100%",
                  marginTop:
                    keysChecked[keysChecked.length - 1].keyIn &&
                    keysChecked[keysChecked.length - 1].keyOut
                      ? 0
                      : 12,
                }}
              >
                <Input
                  multiline
                  InitialIcon={<AlertCircle color={text} />}
                  containerProps={{
                    style: {
                      height:
                        keysChecked[keysChecked.length - 1].keyIn &&
                        keysChecked[keysChecked.length - 1].keyOut
                          ? 0
                          : heightPixel(150),
                      alignItems: "flex-start",
                      backgroundColor: "#272727",
                    },
                  }}
                  labelStyle={{
                    fontFamily: "Poppins-SemiBold",
                    fontWeight: "600",
                    fontSize: fontPixel(16),
                  }}
                  placeholder="Reason for unchecked value"
                  label="Reason"
                  value={keysChecked[keysChecked.length - 1].reason}
                  blurColor={background}
                  onChangeText={(text) => {
                    const keysCheckedLocal = [...keysChecked];
                    keysCheckedLocal[keysChecked.length - 1].reason = text;
                    setKeysChecked(keysCheckedLocal);
                  }}
                />
              </Animated.View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  borderRadius: 8,
                  paddingVertical: 7,
                  backgroundColor: "#0C9700",
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={handleApprove}
              >
                <Text type="HeadingBoldSmall">
                  {i18n.t("addTab.startShiftButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

const StartShift = ({ onSubmit }: { onSubmit: () => void }) => {
  const [showModal, toggleModal] = useState(false);
  const [currentLocationVisible, toggleCurrentLocation] = useState(false);
  const [hasApprovedKeys, setHasApprovedKeys] = useState(false);
  const modalRef = useRef<BottomSheetModal>(null);
  const keysData = useRef<IKeyConfirmation[]>([]);
  const lastKeyChecked = useRef<boolean>(true);
  const { session, updateCheckIn } = useSession();
  const { locale } = useTranslation();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IShiftAttendance) => {
      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/start`,
          data,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        updateCheckIn(response.data.attendance.check_in);
        Toast.show({ type: "success", text1: response.data.message });
        closeCurrentLocation();
        onSubmit();
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        )
          Toast.show({ type: "error", text1: error.message });
        console.error(error);
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["refetchData"] });
    },
  });

  useEffect(() => {
    if (hasApprovedKeys) {
      toggleCurrentLocation(true);
      modalRef.current?.present();
    }
  }, [hasApprovedKeys]);

  function openConfirmKeysModal() {
    toggleModal(true);
    setHasApprovedKeys(false);
  }

  function closeConfirmKeysModal() {
    toggleModal(false);
  }

  function onApproveKeys(
    keysConfirmed: IKeyConfirmation[],
    isLastKeyChecked: boolean
  ) {
    keysData.current = keysConfirmed;
    lastKeyChecked.current = isLastKeyChecked;
    toggleModal(false);
    setHasApprovedKeys(true);
  }

  function closeCurrentLocation() {
    modalRef.current?.close();
    toggleCurrentLocation(false);
  }

  function handleLocationSubmit(location: Location.LocationObject) {
    if (session?.casino.initial_amount)
      mutate({
        cash_initial: lastKeyChecked.current,
        check_in: CURRENT_TIME.toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        geolocation_start: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        keys_confirmation: keysData.current,
      });
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        style={{
          width: "60%",
          aspectRatio: 1,
          position: "relative",
          borderRadius: 1000,
          marginTop: "20%",
        }}
        onPress={openConfirmKeysModal}
      >
        <Svg width={"100%"} height={"100%"} viewBox="0 0 217 216" fill="none">
          <G filter="url(#filter0_diiiii_763_4202)">
            <Rect
              x={23.5}
              y={6}
              width={170}
              height={170}
              rx={85}
              fill="#2DCA50"
            />
            <Rect
              x={23.5}
              y={6}
              width={170}
              height={170}
              rx={85}
              fill="url(#paint0_radial_763_4202)"
              fillOpacity={0.7}
            />
          </G>
          <Defs>
            <RadialGradient
              id="paint0_radial_763_4202"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="rotate(55.968 1.807 92.973) scale(129.47)"
            >
              <Stop stopColor="#fff" />
              <Stop offset={0.697917} stopColor="#fff" stopOpacity={0} />
              <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </RadialGradient>
          </Defs>
        </Svg>
        <Text
          type="DateLargeHeavy"
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "34%",
            marginHorizontal: 6,
            fontSize: locale === "fr" ? fontPixel(26) : fontPixel(30),
          }}
        >
          {i18n.t("addTab.start")}
        </Text>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: "5%" }} type="TitleMedium">
        {i18n.t("addTab.startShiftDescription")}
      </Text>
      <ConfirmKeysModal
        title={i18n.t("addTab.lastKeys")}
        closeModal={closeConfirmKeysModal}
        visible={showModal}
        onApproveKeys={onApproveKeys}
      />
      <GetCurrentLocation
        onSubmit={handleLocationSubmit}
        closeCurrentLocation={closeCurrentLocation}
        currentLocationVisible={currentLocationVisible}
        ref={modalRef}
        buttonLoading={isPending}
      />
    </View>
  );
};

export const ReportConfirmModal = ({
  continuePress,
  visible,
}: ReportModalProps) => {
  const { black } = useThemeColor();
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          justifyContent: "space-between",
          height: "100%",
          paddingBottom: "15%",
          paddingTop: "40%",
          backgroundColor: black,
          paddingHorizontal: 16,
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          {/* <CheckCircle color="#219653" width={100} height={100} /> */}
          <LottieView
            autoPlay
            source={require("@/assets/AnimatedCheck.json")}
            style={{
              width: width * 0.6,
              height: width * 0.6,
              backgroundColor: black,
              marginBottom: 30,
            }}
          />
          <Text type="TitleMedium" style={{ textAlign: "center" }}>
            {i18n.t("addTab.formSuccess")}
          </Text>
        </View>
        <Button label="Continue" onPress={continuePress} />
      </View>
    </Modal>
  );
};

const ReportWaitingTimer = ({
  color,
  progress,
  timeRemaining,
  description,
}: ReportWaitingTimerProps) => {
  const { black } = useThemeColor();
  const { back, navigate } = useRouter();
  return (
    <View
      style={{
        backgroundColor: black,
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}
    >
      <View>
        <View style={styles.timeContainer}>
          <AnimatedCircularProgress percentage={progress} color={color} />
          <View style={styles.timeRemaining}>
            <Text type="HeadingLargeBold" style={{ fontSize: fontPixel(30) }}>
              STILL
            </Text>
            <Text
              type="HeadingLargeBold"
              style={{ color, fontSize: fontPixel(30) }}
            >
              {timeRemaining}
            </Text>
          </View>
        </View>
        <Text style={{ textAlign: "center", marginTop: 50 }} type="TitleMedium">
          {description}
        </Text>
      </View>
      {/* <Button label="Back" onPress={() => navigate("(tabs)")} /> */}
    </View>
  );
};

const RouletteForm = ({
  rouletteData,
  currentIndex,
  totalIndexes,
  nextHandler,
  backHandler,
  keyInChange,
  keyOutChange,
}: RouletteFormProps) => {
  const { primary, text } = useThemeColor();
  const disableNextButton = !rouletteData.keyInEnd || !rouletteData.keyOutEnd;

  return (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: heightPixel(37), marginTop: heightPixel(30) }}>
        <LinearGradient
          colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
          style={{
            backgroundColor: primary,
            width: "60%",
            maxWidth: 300,
            paddingVertical: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 12,
            gap: widthPixel(6),
          }}
        >
          <MapPin color={text} width={18} />
          <Text type="HeadingMediumBold">{rouletteData.identifier}</Text>
        </LinearGradient>
        <View style={{ gap: heightPixel(17) }}>
          <Text type="BodySmall">{i18n.t("addTab.instructions")}</Text>
          <View style={{ gap: heightPixel(11) }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text type="HeadingBoldSmall">{i18n.t("addTab.keyInStart")}</Text>
              <Text type="SubtitleLight">{rouletteData.key_in} XAF</Text>
            </View>
            <Input
              InitialIcon={<CashIn color={text} />}
              placeholder={i18n.t("addTab.enterKeyInEnd")}
              keyboardType="decimal-pad"
              onChangeText={keyInChange}
              focusColor={primary}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // marginBottom: -10,
              }}
            >
              <Text type="HeadingBoldSmall">
                {i18n.t("addTab.keyOutStart")}
              </Text>
              <Text type="SubtitleLight">{rouletteData.key_out} XAF</Text>
            </View>
            <Input
              InitialIcon={<CashOut color={text} />}
              placeholder={i18n.t("addTab.enterKeyOutEnd")}
              keyboardType="decimal-pad"
              onChangeText={keyOutChange}
              focusColor={primary}
            />
          </View>
        </View>
      </View>
      {currentIndex === 0 && totalIndexes > 0 ? (
        <Button
          label={i18n.t("addTab.next")}
          style={{ marginVertical: heightPixel(17) }}
          onPress={() => nextHandler(currentIndex)}
          disabled={disableNextButton}
        />
      ) : totalIndexes === 0 ? (
        <Button label={i18n.t("addTab.submit")} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginVertical: heightPixel(17),
          }}
        >
          <View>
            <Button
              label={i18n.t("addTab.back")}
              outlined
              onPress={() => backHandler(currentIndex)}
            />
          </View>
          <View>
            <Button
              label={i18n.t("addTab.next")}
              onPress={() => nextHandler(currentIndex)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const EndShift = ({
  onSubmit,
}: {
  onSubmit: (location: Location.LocationObject, address: string) => void;
}) => {
  const [currentLocationVisible, toggleCurrentLocaton] = useState(false);
  const modalRef = useRef<BottomSheetModal>(null);
  const firstRender = useRef(true);
  const locationRef = useRef<Location.LocationObject>();
  const addressRef = useRef<string>("");

  function closeCurrentLocation() {
    modalRef.current?.close();
    toggleCurrentLocaton(false);
  }

  useEffect(() => {
    if (firstRender.current) {
      // use effect with dependency stills run on the initial render
      firstRender.current = false;
    } else if (!currentLocationVisible)
      setTimeout(() => {
        if (!locationRef.current) return;
        onSubmit(locationRef.current, addressRef.current);
      }, 500);
  }, [currentLocationVisible]);

  function showLocationModal() {
    toggleCurrentLocaton(true);
    modalRef.current?.present();
  }

  function handleOnSubmit(location: Location.LocationObject, address: string) {
    closeCurrentLocation();
    locationRef.current = location;
    addressRef.current = address;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        style={{
          width: "60%",
          aspectRatio: 1,
          position: "relative",
          borderRadius: 1000,
          marginTop: "20%",
        }}
        onPress={showLocationModal}
      >
        <Svg width={"100%"} height={"100%"} viewBox="0 0 217 216" fill="none">
          <G filter="url(#filter0_diiiii_944_2439)">
            <Rect
              x={23.5}
              y={6}
              width={170}
              height={170}
              rx={85}
              fill="url(#paint0_linear_944_2439)"
            />
          </G>
          <Defs>
            <SvgLinearGradient
              id="paint0_linear_944_2439"
              x1={108.5}
              y1={6}
              x2={108.5}
              y2={176}
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#D9CDBD" stopOpacity={0.5} />
              <Stop offset={0.42} stopColor="#E99213" />
            </SvgLinearGradient>
          </Defs>
        </Svg>
        <Text
          type="DateLargeHeavy"
          style={{ position: "absolute", alignSelf: "center", top: "34%" }}
        >
          SUBMIT
        </Text>
      </TouchableOpacity>
      <Text style={{ textAlign: "center", marginTop: "5%" }} type="TitleMedium">
        {i18n.t("addTab.endShiftDescription")}
      </Text>
      <GetCurrentLocation
        ref={modalRef}
        currentLocationVisible={currentLocationVisible}
        closeCurrentLocation={closeCurrentLocation}
        onSubmit={handleOnSubmit}
      />
    </View>
  );
};

const EndShiftWorkflow = ({
  onReportSubmit,
}: {
  onReportSubmit: () => void;
}) => {
  const endShiftRef = useRef<ScrollView>(null);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [address, setAddress] = useState<string>("");

  const navigateFromEndToForm = () => {
    endShiftRef.current?.scrollTo({ animated: true, x: width });
  };

  function onGetLocationStepComplete(
    location: Location.LocationObject,
    address: string
  ) {
    setLocation(location);
    setAddress(address);

    if (location && address && typeof location !== undefined)
      navigateFromEndToForm();
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      scrollEnabled={false}
      ref={endShiftRef}
      // style={{ width, height: "100%", backgroundColor: "#fff", flex: 1 }}
      // contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ width, flex: 1 }}>
        <Header image title={i18n.t("addTab.title")} />
        <EndShift onSubmit={onGetLocationStepComplete} />
      </View>
      <View style={{ width }}>
        <Header image title={i18n.t("addTab.title")} />
        <ReportForm
          handleSubmit={onReportSubmit}
          // @ts-ignore because navigateFromEndToForm is not called without location
          location={location}
          address={address}
        />
      </View>
    </ScrollView>
  );
};

export const ReportForm = ({
  handleSubmit,
  location,
  address,
}: ReportFormProps) => {
  const { black, accent, primary, text, background } = useThemeColor();
  const { session, updateCheckOut } = useSession();
  const scrollRef = useRef<ScrollView>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const apiBody = {
        ...data,
        check_out: CURRENT_TIME.toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        geolocation_end: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/reports`,
          apiBody,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        updateCheckOut(
          new Date(response.data.report.created_at).toLocaleTimeString("en", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );
        // updateLastOperation(response.data.report.created_at);
        handleSubmit();
        return response.data;
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        )
          Toast.show({ type: "error", text1: error.message });
        console.error(error);
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reports", "refetchData"] });
    },
  });
  if (!session) return null;
  const roulettes = session.casino.roulettes;
  const [roulettesData, setRoulettesData] = useState<RouletteFilledData[]>(
    roulettes.map((item) => ({
      ...item,
      keyInEnd: null,
      keyOutEnd: null,
    }))
  );
  const [reportForm, setReportForm] = useState({
    finalCash: 0,
    information: "",
  });

  function nextHandler(index: number) {
    if (!roulettesData[index].keyInEnd || !roulettesData[index].keyOutEnd) {
      return Toast.show({
        type: "error",
        text1: i18n.t("addTab.incompleteFormError"),
      });
    } else
      scrollRef.current?.scrollTo({
        animated: true,
        x: FORM_WIDTH * (index + 1),
      });
  }
  function backHandler(index: number) {
    scrollRef.current?.scrollTo({
      animated: true,
      x: FORM_WIDTH * (index - 1),
    });
  }

  function handleChangeRouletteValue(
    index: number,
    key: "keyInEnd" | "keyOutEnd",
    value: number
  ) {
    const newRoulettesData = [...roulettesData];
    newRoulettesData[index][key] = value;
    setRoulettesData(newRoulettesData);
  }

  function handleSubmitForm() {
    if (
      reportForm.finalCash === 0 ||
      roulettesData.some(
        (item) => item.keyInEnd === null || item.keyOutEnd === null
      )
    )
      Toast.show({
        type: "error",
        text1: i18n.t("addTab.incompleteFormError"),
      });
    else {
      const data = {
        cash_final: reportForm.finalCash,
        roulettes: roulettesData.map((item) => ({
          id: item.id,
          key_in_end: item.keyInEnd,
          key_out_end: item.keyOutEnd,
        })),
      };
      mutate(data);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#272727" }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        // bounces={false}
      >
        <View style={{ backgroundColor: black }}>
          <LinearGradient
            colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
            style={[styles.content, { backgroundColor: primary }]}
          >
            <Text type="DateLargeHeavy" style={{ marginBottom: 4 }}>
              {CURRENT_TIME.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              }).toUpperCase()}
            </Text>
            <Text type="TimeMedium">
              {CURRENT_TIME.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </LinearGradient>
          <View
            style={{
              position: "relative",
              marginTop: 10,
            }}
          >
            <View
              style={{ width, aspectRatio, position: "absolute", zIndex: -1 }}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${originalWidth} ${originalHeight}`}
                fill="none"
                style={styles.svg}
              >
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M142.223 33.196C123.213 18.894 102.816 0 79.027 0H21C-6.614 0-29 22.386-29 50v520c0 27.614 22.386 50 50 50h352c27.614 0 50-22.386 50-50V50c0-27.614-22.386-50-50-50h-58.027c-23.789 0-44.186 18.894-63.196 33.196C237.692 43.792 218.348 50.332 197 50.332s-40.692-6.54-54.777-17.136z"
                  fill={"#272727"}
                />
              </Svg>
            </View>
            <View
              style={[
                // styles.formContainer,
                {
                  backgroundColor: "#272727",
                  paddingHorizontal: 16,
                },
              ]}
            >
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                ref={scrollRef}
                contentContainerStyle={{
                  width: width * (roulettes.length + 1),
                  flexDirection: "row",
                  // flex: 1,
                  // flexGrow: 1,
                  backgroundColor: "#272727",
                }}
              >
                {roulettes.map((item, index) => (
                  <View
                    style={{
                      width: FORM_WIDTH,
                      height: "100%",
                    }}
                    key={index}
                  >
                    <RouletteForm
                      rouletteData={roulettesData[index]}
                      currentIndex={index}
                      totalIndexes={roulettes.length}
                      nextHandler={nextHandler}
                      backHandler={backHandler}
                      keyInChange={(value) =>
                        handleChangeRouletteValue(
                          index,
                          "keyInEnd",
                          parseFloat(value)
                        )
                      }
                      keyOutChange={(value) =>
                        handleChangeRouletteValue(
                          index,
                          "keyOutEnd",
                          parseFloat(value)
                        )
                      }
                    />
                  </View>
                ))}
                <View
                  style={{
                    justifyContent: "space-between",
                    width: FORM_WIDTH,
                  }}
                >
                  <View
                    style={{
                      gap: heightPixel(17),
                      flex: 1,
                      marginTop: heightPixel(30),
                    }}
                  >
                    <Text type="BodySmall">
                      {i18n.t("addTab.instructions")}
                    </Text>
                    <View style={{ gap: heightPixel(11) }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text type="SubtitleLight">
                          {i18n.t("addTab.initialCash")}
                        </Text>
                        <Text type="SubtitleLight">
                          {session?.casino.initial_amount} XAF
                        </Text>
                      </View>
                      <Input
                        InitialIcon={<Money color={text} />}
                        placeholder={i18n.t("addTab.enterFinalCash")}
                        keyboardType="decimal-pad"
                        onChangeText={(value: string) =>
                          setReportForm({
                            ...reportForm,
                            finalCash: parseFloat(value),
                          })
                        }
                      />
                      <Input
                        multiline
                        InitialIcon={<AlertCircle color={text} />}
                        containerProps={{
                          style: {
                            height: heightPixel(150),
                            alignItems: "flex-start",
                          },
                        }}
                        placeholder="Add additional information"
                        onChangeText={(value: string) =>
                          setReportForm({ ...reportForm, information: value })
                        }
                      />
                    </View>
                  </View>
                  {roulettes.length === 0 ? (
                    <Button
                      label={i18n.t("addTab.submit")}
                      onPress={handleSubmitForm}
                      loading={isPending}
                      style={{ marginVertical: heightPixel(17) }}
                    />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20,
                        marginVertical: heightPixel(17),
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Button
                          label={i18n.t("addTab.back")}
                          outlined
                          onPress={() => backHandler(roulettes.length)}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          label={i18n.t("addTab.submit")}
                          onPress={handleSubmitForm}
                          loading={isPending}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default function AddReportScreen() {
  const [activeSection, setActiveSection] = useState<Sections | null>(null);
  const [showModal, toggleModal] = useState(false);
  const { black, success, danger } = useThemeColor();
  const { session, signOut } = useSession() as IAuthContext;
  const [startTime, endTime] = useMemo(() => {
    if (!session?.casino.shift) return [null, null, null];

    const [start, end] = session?.casino.shift.split(" - ");

    const [startHour, startMinute] = start.split("h").map(Number);
    const [endHour, endMinute] = end.split("h").map(Number);

    const startTime = new Date(
      CURRENT_TIME.getFullYear(),
      CURRENT_TIME.getMonth(),
      CURRENT_TIME.getDate(),
      startHour,
      startMinute
    );

    const endTime = new Date(
      CURRENT_TIME.getFullYear(),
      CURRENT_TIME.getMonth(),
      CURRENT_TIME.getDate(),
      endHour,
      endMinute
    );
    return [startTime, endTime];
  }, []);

  const [progress, setProgress] = useState(getProgressUntilNineAMTomorrow());
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeUntilNineAMTomorrow(CURRENT_TIME)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      CURRENT_TIME.setSeconds(CURRENT_TIME.getSeconds() + 1);
      let localActiveSection = activeSection; //Cannot wait for a re render to set new time

      if (!session || !startTime || !endTime) return signOut();

      const { check_in, check_out } = session;
      // console.log("CURRENT TIME: ", CURRENT_TIME);
      // console.log("START TIME: ", startTime);
      // console.log("END TIME: ", endTime);
      // console.log(check_in, check_out);

      if (!check_in) {
        if (CURRENT_TIME > endTime || CURRENT_TIME < startTime) {
          localActiveSection = Sections.AFTER_SHIFT_TIMER;
          setActiveSection(localActiveSection);
        } else if (CURRENT_TIME > startTime) {
          localActiveSection = Sections.START_SHIFT;
          setActiveSection(localActiveSection);
          return;
        }
      } else if (!check_out) {
        if (CURRENT_TIME > endTime) {
          localActiveSection = Sections.END_SHIFT;
          setActiveSection(localActiveSection);
          return;
        } else {
          localActiveSection = Sections.DURING_SHIFT_TIMER;
        }
      } else {
        localActiveSection = Sections.AFTER_SHIFT_TIMER;
      }

      // console.log(localActiveSection);

      // console.log(localActiveSection);

      if (showModal) return;
      if (
        localActiveSection === Sections.AFTER_SHIFT_TIMER ||
        localActiveSection === Sections.END_SHIFT
      ) {
        const nextStartTime = new Date(startTime);
        if (CURRENT_TIME > nextStartTime)
          nextStartTime.setDate(nextStartTime.getDate() + 1);
        const previousEndTime = new Date(endTime);
        if (CURRENT_TIME < previousEndTime)
          previousEndTime.setDate(previousEndTime.getDate() - 1);
        setTimeRemaining(getTimeRemaining(CURRENT_TIME, nextStartTime));
        setProgress(
          getProgressPercentage(previousEndTime, CURRENT_TIME, nextStartTime)
        );
      } else if (localActiveSection === Sections.DURING_SHIFT_TIMER) {
        setTimeRemaining(getTimeRemaining(CURRENT_TIME, endTime));
        setProgress(getProgressPercentage(startTime, CURRENT_TIME, endTime));
      }
      setActiveSection(localActiveSection);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, activeSection, showModal]);

  // console.log(activeSection);

  if (activeSection === null) return <LoadingScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: black }}>
      {activeSection !== Sections.END_SHIFT && (
        <Header image title={i18n.t("addTab.title")} />
      )}
      {activeSection === Sections.START_SHIFT ||
      activeSection === Sections.FORM ? (
        <StartShift
          onSubmit={() => setActiveSection(Sections.DURING_SHIFT_TIMER)}
        />
      ) : activeSection === Sections.END_SHIFT ? (
        <EndShiftWorkflow
          onReportSubmit={() => {
            setActiveSection(Sections.MODAL);
            toggleModal(true);
          }}
        />
      ) : activeSection === Sections.DURING_SHIFT_TIMER ? (
        <ReportWaitingTimer
          color={success}
          onBack={() => {}}
          progress={progress}
          timeRemaining={timeRemaining}
          description={i18n.t("addTab.duringShiftWait")}
        />
      ) : activeSection === Sections.AFTER_SHIFT_TIMER ? (
        <ReportWaitingTimer
          color={danger}
          onBack={() => {}}
          progress={progress}
          timeRemaining={timeRemaining}
          description={i18n.t("addTab.afterShiftWait")}
        />
      ) : null}
      <ReportConfirmModal
        visible={showModal}
        continuePress={() => {
          toggleModal(false);
          setActiveSection(Sections.AFTER_SHIFT_TIMER);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    // position: "absolute",
    top: "-8%",
    left: 0,
    right: 0,
    zIndex: 1000,
    // height: SVG_HEIGHT,
  },
  formContainer: {
    paddingHorizontal: 16,
    position: "absolute",
    zIndex: 1001,
    top: "5%",
    width: "100%",
    gap: 20,
  },
  time: {
    color: "#fff",
    fontSize: 16,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8%",
    padding: 12,
    borderRadius: 1000,
    width: width / 2.2,
    aspectRatio: 1,
    alignSelf: "center",
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: "20%",
  },
  timeRemaining: {
    position: "absolute",
    alignItems: "center",
    gap: 6,
  },
});
