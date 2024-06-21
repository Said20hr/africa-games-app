import { Dimensions, Modal, ScrollView, StyleSheet, View } from "react-native";
import Header from "@/components/Header";
import Text from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "@/components/ui";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  MapPin,
} from "react-native-feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { CashIn, CashOut, Money } from "@/assets/icons";
import { useRouter } from "expo-router";
import { fontPixel, heightPixel, widthPixel } from "@/shared/util/normalise";
import { i18n } from "@/constants/i18n";

const { width, height } = Dimensions.get("window");
const FORM_WIDTH = width - 32;
const SVG_HEIGHT = height / 1.2;

let CURRENT_TIME = new Date();

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
}

type ReportFormProps = {
  handleSubmit: () => void;
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
          paddingVertical: "50%",
          backgroundColor: black,
          paddingHorizontal: 16,
          alignItems: "center",
        }}
      >
        <CheckCircle color="#219653" width={100} height={100} />
        <Text type="TitleMedium" style={{ textAlign: "center" }}>
          You've successfully filled out the form!
        </Text>
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

type RouletteFormProps = {
  rouletteData: RouletteFilledData;
  currentIndex: number;
  totalIndexes: number;
  nextHandler: (index: number) => void;
  backHandler: (index: number) => void;
  keyInChange: (value: string) => void;
  keyOutChange: (value: string) => void;
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
              <Text type="SubtitleLight">{i18n.t("addTab.keyInStart")}</Text>
              <Text type="SubtitleLight">{rouletteData.key_in} XAF</Text>
            </View>
            <Input
              InitialIcon={<CashIn color={text} />}
              placeholder={i18n.t("addTab.enterInitialCash")}
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
              <Text type="SubtitleLight">{i18n.t("addTab.keyOutStart")}</Text>
              <Text type="SubtitleLight">{rouletteData.key_out} XAF</Text>
            </View>
            <Input
              InitialIcon={<CashOut color={text} />}
              placeholder={i18n.t("addTab.enterFinalCash")}
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

export const ReportForm = ({ handleSubmit }: ReportFormProps) => {
  const { black, accent, primary, text, background } = useThemeColor();
  const { session } = useSession();
  const scrollRef = useRef<ScrollView>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/reports`,
          data,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );

        Toast.show({ type: "success", text1: response.data.message });
        return response.data;
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        )
          Toast.show({ type: "error", text1: error.message });
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
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        // style={{ paddingBottom: 60 }}
        contentContainerStyle={{
          // flex: 1,
          backgroundColor: black,
        }}
        // bounces={false}
      >
        <View>
          <LinearGradient
            colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
            style={[styles.content, { backgroundColor: primary }]}
          >
            <Text type="DateLargeHeavy" style={{ marginBottom: 12 }}>
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
                        placeholder="Lorem ipsium..."
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
  const { session } = useSession() as IAuthContext;
  const [startTime, endTime, lastPaymentTime] = useMemo(() => {
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

    const lastPaymentTime = session.casino.last_operation
      ? new Date(session.casino.last_operation)
      : null;

    return [startTime, endTime, lastPaymentTime];
  }, []);
  const [progress, setProgress] = useState(getProgressUntilNineAMTomorrow());
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeUntilNineAMTomorrow(CURRENT_TIME)
  );
  useEffect(() => {
    const interval = setInterval(() => {
      CURRENT_TIME.setSeconds(CURRENT_TIME.getSeconds() + 1);
      let localActiveSection = activeSection; //Cannot wait for a re render to set new time

      if (!startTime || !endTime || !lastPaymentTime) {
        localActiveSection = Sections.FORM;
        setActiveSection(localActiveSection);
        return;
      }

      const previousShiftEnd = new Date(endTime);
      if (CURRENT_TIME < endTime)
        previousShiftEnd.setDate(previousShiftEnd.getDate() - 1);
      if (previousShiftEnd > lastPaymentTime) {
        localActiveSection = Sections.FORM;
      } else if (CURRENT_TIME >= startTime && CURRENT_TIME <= endTime) {
        localActiveSection = Sections.DURING_SHIFT_TIMER;
      } else {
        localActiveSection = Sections.AFTER_SHIFT_TIMER;
      }

      if (localActiveSection === Sections.AFTER_SHIFT_TIMER) {
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

      if (showModal) return;
      else setActiveSection(localActiveSection);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, lastPaymentTime, activeSection]);

  if (activeSection === null) return <LoadingScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: black }}>
      <Header image title={i18n.t("addTab.title")} />
      {activeSection === Sections.FORM ? (
        <ReportForm
          handleSubmit={() => {
            setActiveSection(Sections.MODAL);
            toggleModal(true);
          }}
        />
      ) : activeSection === Sections.DURING_SHIFT_TIMER ? (
        <ReportWaitingTimer
          color={success}
          onBack={() => setActiveSection(Sections.FORM)}
          progress={progress}
          timeRemaining={timeRemaining}
          description={i18n.t("addTab.duringShiftWait")}
        />
      ) : activeSection === Sections.AFTER_SHIFT_TIMER ? (
        <ReportWaitingTimer
          color={danger}
          onBack={() => setActiveSection(Sections.FORM)}
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
