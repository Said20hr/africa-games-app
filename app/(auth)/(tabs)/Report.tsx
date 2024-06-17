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

const ReportConfirmModal = ({ continuePress, visible }: ReportModalProps) => {
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
        <Text type="h4" style={{ textAlign: "center" }}>
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
            <Text type="h2">STILL</Text>
            <Text type="h1" style={{ color }}>
              {timeRemaining}
            </Text>
          </View>
        </View>
        <Text style={{ textAlign: "center", marginTop: 50 }} type="h4">
          {description}
        </Text>
      </View>
    </View>
  );
};

type RouletteFormProps = {
  rouletteData: RouletteData;
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

  return (
    <View style={{ justifyContent: "space-between", gap: 20 }}>
      <View style={{ gap: 20 }}>
        <LinearGradient
          colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
          style={{
            backgroundColor: primary,
            width: "60%",
            maxWidth: 300,
            paddingVertical: 14,
            gap: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 12,
          }}
        >
          <MapPin color={text} width={18} />
          <Text type="h4">{rouletteData.identifier}</Text>
        </LinearGradient>
        <Text type="b1">
          Please fill out the following fields to log your daily financial
          transactions
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="h6">Key in start</Text>
          <Text type="h6">{rouletteData.key_in} XAF</Text>
        </View>
        <Input
          InitialIcon={<CashIn color={text} />}
          placeholder="Enter your initial cash"
          keyboardType="decimal-pad"
          onChangeText={keyInChange}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="h6">Key out start</Text>
          <Text type="h6">{rouletteData.key_out} XAF</Text>
        </View>
        <Input
          InitialIcon={<CashOut color={text} />}
          placeholder="Enter your final cash"
          keyboardType="decimal-pad"
          onChangeText={keyOutChange}
        />
      </View>
      {currentIndex === 0 && totalIndexes > 0 ? (
        <Button label="Next" onPress={() => nextHandler(currentIndex)} />
      ) : totalIndexes === 0 ? (
        <Button label="Submit" />
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Button
              label="Back"
              outlined
              onPress={() => backHandler(currentIndex)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Next" onPress={() => nextHandler(currentIndex)} />
          </View>
        </View>
      )}
    </View>
  );
};

const ReportForm = ({ handleSubmit }: ReportFormProps) => {
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
      Toast.show({ type: "error", text1: "Please fill all the fields" });
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
    <KeyboardAwareScrollView
      style={{ paddingBottom: 60 }}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: black,
        flexGrow: 1,
      }}
      // bounces={false}
    >
      <View style={{ flex: 1, height }}>
        <LinearGradient
          colors={["rgba(217, 205, 189, 1)", "rgba(233, 146, 19, 1)"]}
          style={[styles.content, { backgroundColor: primary }]}
        >
          <Text type="h1" style={{ marginBottom: 12 }}>
            {CURRENT_TIME.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            }).toUpperCase()}
          </Text>
          <Text type="h3">
            {CURRENT_TIME.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </LinearGradient>
        <View style={{ position: "relative", flex: 1, marginTop: 10 }}>
          <View style={{ width, aspectRatio }}>
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
          <View style={styles.formContainer}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              scrollEnabled={false}
              ref={scrollRef}
              contentContainerStyle={{
                width: width * (roulettes.length + 1),
                flexDirection: "row",
              }}
            >
              {roulettes.map((item, index) => (
                <View
                  style={{
                    width: FORM_WIDTH,
                  }}
                  key={index}
                >
                  <RouletteForm
                    rouletteData={item}
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
                  gap: 20,
                  width: FORM_WIDTH,
                }}
              >
                <Text type="b1">
                  Please fill out the following fields to log your daily
                  financial transactions
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="h6">Initial Cash</Text>
                  <Text type="h6">{session?.casino.initial_amount} XAF</Text>
                </View>
                <Input
                  InitialIcon={<Money color={text} />}
                  placeholder="Enter your final cash"
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
                    style: { height: 120, alignItems: "flex-start" },
                  }}
                  placeholder="Lorem ipsium..."
                  onChangeText={(value: string) =>
                    setReportForm({ ...reportForm, information: value })
                  }
                />
                {roulettes.length === 0 ? (
                  <Button
                    label="Submit"
                    onPress={handleSubmitForm}
                    loading={isPending}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Back"
                        outlined
                        onPress={() => backHandler(roulettes.length)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Next"
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
  );
};

export default function ReportScreen() {
  const [activeSection, setActiveSection] = useState<Sections | null>(
    Sections.FORM
  );
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
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     CURRENT_TIME.setSeconds(CURRENT_TIME.getSeconds() + 1);
  //     if (!startTime || !endTime || !lastPaymentTime) {
  //       setActiveSection(Sections.FORM);
  //       return;
  //     }

  //     const previousShiftEnd = new Date(endTime);
  //     if (CURRENT_TIME < endTime)
  //       previousShiftEnd.setDate(previousShiftEnd.getDate() - 1);
  //     if (previousShiftEnd > lastPaymentTime) {
  //       setActiveSection(Sections.FORM);
  //       return;
  //     } else if (CURRENT_TIME >= startTime && CURRENT_TIME <= endTime)
  //       setActiveSection(Sections.DURING_SHIFT_TIMER);
  //     else setActiveSection(Sections.AFTER_SHIFT_TIMER);

  //     if (activeSection === Sections.AFTER_SHIFT_TIMER) {
  //       const nextStartTime = new Date(startTime);
  //       if (CURRENT_TIME > nextStartTime)
  //         nextStartTime.setDate(nextStartTime.getDate() + 1);
  //       const previousEndTime = new Date(endTime);
  //       if (CURRENT_TIME < previousEndTime)
  //         previousEndTime.setDate(previousEndTime.getDate() - 1);
  //       setTimeRemaining(getTimeRemaining(CURRENT_TIME, nextStartTime));
  //       setProgress(
  //         getProgressPercentage(previousEndTime, CURRENT_TIME, nextStartTime)
  //       );
  //     } else if (activeSection === Sections.DURING_SHIFT_TIMER) {
  //       setTimeRemaining(getTimeRemaining(CURRENT_TIME, endTime));
  //       setProgress(getProgressPercentage(startTime, CURRENT_TIME, endTime));
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [startTime, endTime, lastPaymentTime, activeSection]);

  if (activeSection === null) return <LoadingScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: black }}>
      <Header image title="Daily Report" />
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
          description="Please wait until the end of your shift to be able to fill out the form."
        />
      ) : activeSection === Sections.AFTER_SHIFT_TIMER ? (
        <ReportWaitingTimer
          color={danger}
          onBack={() => setActiveSection(Sections.FORM)}
          progress={progress}
          timeRemaining={timeRemaining}
          description="Please wait until the end of your next shift to be to fill the form"
        />
      ) : null}
      <ReportConfirmModal
        visible={showModal}
        continuePress={() => {
          toggleModal(false);
          setActiveSection(Sections.DURING_SHIFT_TIMER);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    top: "-8%",
    left: 0,
    right: 0,
    zIndex: 1000,
    height: SVG_HEIGHT,
  },
  formContainer: {
    flex: 1,
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
