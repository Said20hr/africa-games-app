import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import {
  AlertCircle,
  Check,
  ChevronDown,
  LogOut,
  X,
} from "react-native-feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "@/components/ThemedText";
import { Image } from "expo-image";
import NavigationButton from "@/components/profile/NavigationButton";
import { useNavigation } from "expo-router";
import { useSession } from "@/app/ctx";
import React, {
  RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { StackActions } from "@react-navigation/native";
import { changeLanguage, i18n } from "@/constants/i18n";
import {
  CreditCard,
  CurvedFlag,
  Edit,
  Lock,
  Money,
  Suitcase,
  TwoUsers,
  User,
} from "@/assets/icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { heightPixel } from "@/shared/util/normalise";
import { Button, Input } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageOptions } from "@/shared/type/Utils.type";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";

const Flags = {
  England: require(`@/assets/images/flags/flagEngland.png`),
  France: require(`@/assets/images/flags/flagFrance.png`),
  Spain: require(`@/assets/images/flags/flagSpain.png`),
  Germany: require(`@/assets/images/flags/flagGermany.png`),
  Portugal: require(`@/assets/images/flags/flagPortugal.png`),
};

let checkSelectedLanguage = Object.keys(LanguageOptions).find(
  // @ts-ignore
  (key) => LanguageOptions[key] === i18n.locale
);

const ChangeLanguageModal = forwardRef<BottomSheetModal>((_, modalRef) => {
  const { handleSheetPositionChange } = useBottomSheetBackHandler(
    modalRef as RefObject<BottomSheetModal>
  );
  const { background, text, black } = useThemeColor();
  const [showMore, setShowMore] = useState(false);
  const { locale, setLocale } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    checkSelectedLanguage ?? "English"
  );
  const opacityAnim = useRef(new Animated.Value(0)).current;

  function getFlagCountry(locale: string): string {
    let countryName = "";
    switch (locale) {
      case LanguageOptions.English:
        countryName = "England";
        break;
      case LanguageOptions.Espagnol:
        countryName = "Spain";
        break;
      case LanguageOptions.Allemand:
        countryName = "Germany";
        break;
      case LanguageOptions.French:
        countryName = "France";
        break;
      case LanguageOptions.Portugais:
        countryName = "Portugal";
        break;
    }
    return countryName;
  }

  useEffect(() => {
    if (showMore) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.in(Easing.quad),
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.in(Easing.quad),
      }).start();
    }
  }, [showMore]);

  const [flagCountry, setFlagCountry] = useState<string>(
    getFlagCountry(locale)
  );

  function handleShowMenu() {
    setShowMore(true);
  }

  function closeModal() {
    // @ts-ignore
    modalRef?.current?.close();
  }

  function handleLanguageSelection(value: LanguageOptions) {
    setFlagCountry(getFlagCountry(value));
    setLocale(value);
    checkSelectedLanguage = Object.keys(LanguageOptions).find(
      // @ts-ignore
      (key) => LanguageOptions[key] === value
    );
    setSelectedLanguage(checkSelectedLanguage || "English");
    closeModal();
    setShowMore(false);
    changeLanguage(value);
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      onChange={handleSheetPositionChange}
      handleIndicatorStyle={{ width: "0%", height: 0 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      backgroundStyle={{ backgroundColor: background }}
    >
      <BottomSheetView
        style={{
          backgroundColor: background,
          paddingVertical: 30,
          gap: heightPixel(20),
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ textAlign: "center", flex: 1 }} type="TitleMedium">
            {i18n.t("profile.changeLanguage")}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={closeModal}
          >
            <X color={text} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleShowMenu}>
            <Input
              editable={false}
              InitialIcon={
                <Image
                  source={Flags[flagCountry]}
                  style={{ width: 18, aspectRatio: 1 }}
                />
              }
              value={selectedLanguage}
              RightIcon1={
                <ChevronDown
                  color={text}
                  width={20}
                  height={20}
                  onPress={handleShowMenu}
                />
              }
              onPress={handleShowMenu}
            />
          </TouchableOpacity>
          {showMore && (
            <Animated.View
              style={{
                borderRadius: 12,
                backgroundColor: text,
                padding: 14,
                marginTop: 6,
                gap: heightPixel(10),
                opacity: opacityAnim,
              }}
            >
              {locale !== LanguageOptions.English && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onPress={() =>
                    handleLanguageSelection(LanguageOptions.English)
                  }
                >
                  <Image
                    source={require("@/assets/images/flags/flagEngland.png")}
                    style={{ width: 18, aspectRatio: 1 }}
                  />
                  <Text type="BodySmall" style={{ flex: 1, color: black }}>
                    English
                  </Text>
                </TouchableOpacity>
              )}
              {locale !== LanguageOptions.French && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onPress={() =>
                    handleLanguageSelection(LanguageOptions.French)
                  }
                >
                  <Image
                    source={require("@/assets/images/flags/flagFrance.png")}
                    style={{ width: 18, aspectRatio: 1 }}
                  />
                  <Text type="BodySmall" style={{ flex: 1, color: black }}>
                    French
                  </Text>
                </TouchableOpacity>
              )}
              {locale !== LanguageOptions.Allemand && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onPress={() =>
                    handleLanguageSelection(LanguageOptions.Allemand)
                  }
                >
                  <Image
                    source={require("@/assets/images/flags/flagGermany.png")}
                    style={{ width: 18, aspectRatio: 1 }}
                  />
                  <Text type="BodySmall" style={{ flex: 1, color: black }}>
                    Allemand
                  </Text>
                </TouchableOpacity>
              )}
              {locale !== LanguageOptions.Espagnol && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onPress={() =>
                    handleLanguageSelection(LanguageOptions.Espagnol)
                  }
                >
                  <Image
                    source={require("@/assets/images/flags/flagSpain.png")}
                    style={{ width: 18, aspectRatio: 1 }}
                  />
                  <Text type="BodySmall" style={{ flex: 1, color: black }}>
                    Espagnol
                  </Text>
                </TouchableOpacity>
              )}
              {locale !== LanguageOptions.Portugais && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onPress={() =>
                    handleLanguageSelection(LanguageOptions.Portugais)
                  }
                >
                  <Image
                    source={require("@/assets/images/flags/flagPortugal.png")}
                    style={{ width: 18, aspectRatio: 1 }}
                  />
                  <Text type="BodySmall" style={{ flex: 1, color: black }}>
                    Portugais
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </View>
        <Button
          label={i18n.t("editProfile.change")}
          style={{ paddingVertical: 12, marginBottom: 40 }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default function ProfileScreen() {
  const { black, primary, text, background } = useThemeColor();
  const { signOut, session } = useSession();
  const { dispatch, navigate } = useNavigation();
  const modalRef = useRef<BottomSheetModal>(null);

  function handleSignOut() {
    dispatch(StackActions.replace("guest"));
    signOut();
  }

  function handleChangeLanguagePress() {
    modalRef.current?.present();
  }

  return (
    <View style={{ flex: 1, backgroundColor: black }}>
      <Header title={i18n.t("profile.title")} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
          gap: heightPixel(12),
        }}
      >
        <ScrollView
          style={{
            backgroundColor: black,
            borderRadius: 10,
            // marginBottom: 8,
          }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.editProfileButton, { backgroundColor: primary }]}
          >
            <View style={styles.userInfo}>
              <Image
                source={require("@/assets/images/user-header.jpeg")}
                style={styles.image}
              />
              <View>
                <Text type="HeadingMediumBold">
                  {session?.user.firstname} {session?.user.lastname}
                </Text>
                <Text type="BodySmall">
                  {session?.casino.roulettes &&
                  session?.casino.roulettes.length > 0
                    ? session?.casino.roulettes[0].identifier
                    : session?.casino.name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* <Link href="profile/EditProfile" asChild> */}
          <View style={{ backgroundColor: background, marginTop: 14 }}>
            <NavigationButton
              icon={User}
              text={i18n.t("profile.myProfile")}
              description={i18n.t("profile.makeChangesToMyProfile")}
              onPress={() => {
                navigate("profile/EditProfile");
              }}
            />
            <NavigationButton
              icon={Money}
              text={i18n.t("profile.mySalaries")}
              description={i18n.t("profile.viewMyLatestSalaries")}
            />
            <NavigationButton
              icon={TwoUsers}
              text={i18n.t("profile.myAbsences")}
              description={i18n.t("profile.checkMyAbsences")}
            />
            <NavigationButton
              icon={Suitcase}
              text={i18n.t("profile.mySchedule")}
              description={i18n.t("profile.viewMySchedule")}
            />
            <NavigationButton
              icon={AlertCircle}
              text={i18n.t("profile.mySanctions")}
              description={i18n.t("profile.makeChangesToYourAccount")}
            />
            <NavigationButton
              icon={CreditCard}
              text={i18n.t("profile.salaryAdvances")}
              description={i18n.t("profile.viewMySalaryAdvances")}
            />
            <NavigationButton
              icon={CurvedFlag}
              text={i18n.t("profile.changeLanguage")}
              description={i18n.t("profile.changeLanguageOfTheApp")}
              onPress={handleChangeLanguagePress}
            />
            <NavigationButton
              icon={LogOut}
              text={i18n.t("profile.logOut")}
              description={i18n.t("profile.logOutMyAccount")}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={handleSignOut}
              showChevron={false}
            />
          </View>
        </ScrollView>
      </View>
      <ChangeLanguageModal ref={modalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  editProfileButton: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
