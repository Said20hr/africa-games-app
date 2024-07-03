import { Button, Input } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { ForwardedRef, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "@/components/ThemedText";
import { Image } from "expo-image";
import { useSession } from "@/app/ctx";
import { heightPixel } from "@/shared/util/normalise";
import { SvgProps } from "react-native-svg";
import {
  Calendar,
  Envelope,
  Phone,
  Edit,
  Lock,
  User,
  TwoUsers,
  UserCircle,
  MapPin,
  ThreeUsers,
  Flag,
  EmptyHome,
  Money,
  Suitcase,
  List,
} from "@/assets/icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { X } from "react-native-feather";
import { i18n } from "@/constants/i18n";
import Toast from "react-native-toast-message";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.35;

type EditProfileItemProps = {
  label: string;
  value: string;
  onPress?: () => void;
  Icon: React.FC<SvgProps>;
  canEdit?: boolean;
};

const EditProfileItem = ({
  Icon,
  label,
  value,
  onPress,
  canEdit = false,
}: EditProfileItemProps) => {
  const { background, primary } = useThemeColor();
  return (
    <TouchableOpacity
      style={[styles.editProfileItemContainer, { backgroundColor: background }]}
      disabled={!onPress}
      onPress={onPress}
    >
      <Icon stroke={primary} width={22} height={22} />
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text type="SubtitleLight">{label}</Text>
          <Text type="BodySmall" style={{ color: "#9E9D9D" }}>
            {value}
          </Text>
        </View>
        {canEdit && <Edit width={22} height={22} />}
      </View>
    </TouchableOpacity>
  );
};

const ProfileGeneralInfo = () => {
  const { session } = useSession();
  const modalRef = useRef<BottomSheetModal>(null);
  return (
    <ScrollView
      contentContainerStyle={{
        gap: heightPixel(20),
        paddingBottom: "8%",
        paddingHorizontal: 8,
      }}
      style={{
        width: SCREEN_WIDTH,
        height: "100%",
      }}
    >
      <EditProfileItem
        label={i18n.t("editProfile.name")}
        value={`${session?.user.firstname} ${session?.user.lastname}`}
        Icon={User}
      />
      <EditProfileItem
        label={i18n.t("editProfile.email")}
        value={session?.user.email ?? ""}
        Icon={Envelope}
      />
      <EditProfileItem
        label={i18n.t("editProfile.dateOfBirth")}
        value={session?.user.birth_date ?? ""}
        Icon={Calendar}
      />
      <EditProfileItem
        label={i18n.t("editProfile.phoneNumber")}
        value={session?.user.phone ?? ""}
        Icon={Phone}
        canEdit
        onPress={() => {}}
      />
      <EditProfileItem
        label={i18n.t("editProfile.password")}
        value="**********"
        Icon={Lock}
        canEdit
        onPress={() => {
          modalRef.current?.present();
        }}
      />
      <ChangePasswordModal modalRef={modalRef} />
    </ScrollView>
  );
};

const ProfileAdditionalInfo = () => {
  const { session } = useSession();

  if (!session) return null;

  return (
    <ScrollView
      contentContainerStyle={{
        gap: heightPixel(20),
        paddingBottom: "8%",
        paddingHorizontal: 8,
      }}
      style={{
        width: SCREEN_WIDTH,
        height: "100%",
      }}
    >
      <EditProfileItem
        label={i18n.t("editProfile.socialSecurityNumber")}
        value={session?.user.insurance_number}
        Icon={User}
      />
      <EditProfileItem
        label={i18n.t("editProfile.category")}
        value={session?.user.category_level}
        Icon={TwoUsers}
      />
      <EditProfileItem
        label={i18n.t("editProfile.maritalStatus")}
        value={session?.user.marital_status}
        Icon={UserCircle}
      />
      <EditProfileItem
        label={i18n.t("editProfile.city")}
        value={session?.user.status}
        Icon={MapPin}
      />
      <EditProfileItem
        label={i18n.t("editProfile.status")}
        value={session?.user.status}
        Icon={ThreeUsers}
      />
      <EditProfileItem
        label={i18n.t("editProfile.nationality")}
        value={session?.user.nationality}
        Icon={Flag}
      />
    </ScrollView>
  );
};

const ProfileBankInfo = () => {
  const { session } = useSession();
  return (
    <ScrollView
      contentContainerStyle={{
        gap: heightPixel(20),
        paddingBottom: "8%",
        paddingHorizontal: 8,
      }}
      style={{
        width: SCREEN_WIDTH,
        height: "100%",
      }}
    >
      <EditProfileItem
        label={i18n.t("editProfile.bankName")}
        value={session?.user.bank ?? ""}
        Icon={EmptyHome}
      />
      <EditProfileItem
        label={i18n.t("editProfile.bankAccount")}
        value={session?.user.account_number ?? ""}
        Icon={EmptyHome}
      />
      <EditProfileItem
        label={i18n.t("editProfile.basicSalary")}
        value={session?.user.base_salary ?? ""}
        Icon={Money}
      />
      <EditProfileItem
        label={i18n.t("editProfile.service")}
        value={session?.user.service ?? ""}
        Icon={User}
      />
      <EditProfileItem
        label={i18n.t("editProfile.post")}
        value={session?.user.position ?? ""}
        Icon={Suitcase}
      />
      <EditProfileItem
        label={i18n.t("editProfile.dateOfHiring")}
        value={session?.user.hire_date ?? ""}
        Icon={Calendar}
      />
      <EditProfileItem
        label={i18n.t("editProfile.workingDays")}
        value="Sun / Mon"
        Icon={List}
      />
    </ScrollView>
  );
};

interface ChangePasswordModalProps {
  modalRef: ForwardedRef<BottomSheetModal>;
}

const ChangePasswordModal = ({ modalRef }: ChangePasswordModalProps) => {
  const { background, text } = useThemeColor();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function closeModal() {
    //@ts-ignore
    modalRef?.current?.close();
  }

  function handleChangePassword() {
    setPassword("");
    setConfirmPassword("");
    closeModal();
    Toast.show({ type: "success", text1: "Password updated successfully" });
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
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
          <Text style={{ textAlign: "center", flex: 1 }}>
            {i18n.t("editProfile.changePassword")}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={closeModal}
          >
            <X color={text} />
          </TouchableOpacity>
        </View>
        <Input
          textContentType="password"
          InitialIcon={<Lock stroke={text} />}
          label={i18n.t("editProfile.password")}
          placeholder="**********"
          bottomSheetInput
          value={password}
          onChangeText={setPassword}
        />
        <Input
          textContentType="password"
          InitialIcon={<Lock stroke={text} />}
          placeholder="**********"
          label={i18n.t("editProfile.confirmPassword")}
          bottomSheetInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          label={i18n.t("editProfile.change")}
          style={{ paddingVertical: 12, marginBottom: 40 }}
          disabled={
            password !== confirmPassword ||
            password === "" ||
            password.length < 6
          }
          onPress={handleChangePassword}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const EditProfile: React.FC = () => {
  const { black, text, primary, accent } = useThemeColor();
  const { goBack } = useNavigation();
  const { session } = useSession();
  const scrollRefUserDetails = useRef<ScrollView>(null);
  const [translateX] = useState(() => new Animated.Value(0));

  function translateWithScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    Animated.timing(translateX, {
      toValue: e.nativeEvent.contentOffset.x / 3,
      useNativeDriver: true,
      duration: 0,
      // delay: 1000,
    }).start();
  }

  function onPressSection(index: number) {
    scrollRefUserDetails.current?.scrollTo({
      animated: true,
      x: SCREEN_WIDTH * index,
    });
  }

  return (
    <View style={{ backgroundColor: black, flex: 1 }}>
      <View style={styles.imageContainer}>
        <TouchableOpacity>
          <Image
            source={require("@/assets/images/user-header.png")}
            style={styles.image}
          />
          <View style={[styles.iconContainer, { backgroundColor: primary }]}>
            <Edit color={text} strokeWidth={3} />
          </View>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text type="TitleMedium">
            {session?.user.firstname.toUpperCase()}{" "}
            {session?.user.lastname.toUpperCase()}
          </Text>
          <Text type="BodySmall" style={{ color: accent }}>
            {session?.user.matricule}
          </Text>
        </View>
      </View>
      <View>
        <ScrollView
          horizontal
          style={{ width: SCREEN_WIDTH }}
          contentContainerStyle={{
            position: "relative",
          }}
          scrollEnabled={false}
        >
          <TouchableOpacity
            style={styles.profileSectionContainer}
            onPress={() => onPressSection(0)}
          >
            <Text type="TitleSmallest">{i18n.t("editProfile.general")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileSectionContainer}
            onPress={() => onPressSection(1)}
          >
            <Text type="TitleSmallest">{i18n.t("editProfile.additional")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileSectionContainer}
            onPress={() => onPressSection(2)}
          >
            <Text type="TitleSmallest">{i18n.t("editProfile.bank")}</Text>
          </TouchableOpacity>
          <Animated.View
            style={{
              position: "absolute",
              width: SCREEN_WIDTH / 3,
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
        contentContainerStyle={{
          // width: SCREEN_WIDTH * 3,
          backgroundColor: black,
        }}
        scrollEventThrottle={16}
        onScroll={translateWithScroll}
        ref={scrollRefUserDetails}
      >
        <ProfileGeneralInfo />
        <ProfileAdditionalInfo />
        <ProfileBankInfo />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  spacedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 200,
  },
  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    borderRadius: 100,
    padding: 8,
    bottom: 0,
  },
  profileSectionContainer: {
    width: SCREEN_WIDTH / 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },

  editProfileItemContainer: {
    borderRadius: 12,
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default EditProfile;
