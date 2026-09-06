import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../api/axios";
import { logout } from "../../../features/auth/auth.slice";
import { extractApiData, formatDate, getName } from "utils/studentHelpers";
import { useAppDispatch } from "../../../store/hook";
import type { StudentAddress, StudentProfile } from "types/student.types";

type ProfileWithApaar = StudentProfile & { apaarId?: string };

const COLORS = {
  primary: "#3154D9",
  primaryDark: "#1D327F",
  danger: "#D92D20",
};

const formatEnumValue = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "-";

const formatAddress = (address?: StudentAddress) => {
  if (!address) return "-";

  const parts = [
    address.addressLine,
    address.city,
    address.district,
    address.state,
    address.pincode,
    address.country,
  ].filter((part): part is string => Boolean(part?.trim()));

  return parts.length > 0 ? parts.join(", ") : "-";
};

const getInitials = (name?: string) => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length === 0) return "S";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getProfileImageUrl = (profile: StudentProfile | null) => {
  const image = profile?.photo ?? profile?.profileImage ?? profile?.avatar;

  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;

  const serverUrl = api.defaults.baseURL?.replace(/\/api\/v\d+\/?$/, "");

  return serverUrl ? `${serverUrl}/${image.replace(/^\//, "")}` : image;
};

const StudentProfileScreen = () => {
  const dispatch = useAppDispatch();
  const mountedRef = useRef(true);

  const [profile, setProfile] = useState<ProfileWithApaar | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setProfileError(null);

      try {
        const response = await api.get("/students/me");
        const data = extractApiData(response);
        const studentProfile =
          data?.student ??
          data?.profile ??
          data?.data?.student ??
          data?.data?.profile ??
          data?.data ??
          data;

        if (!mountedRef.current) return;

        if (!studentProfile || typeof studentProfile !== "object") {
          throw new Error("Invalid student profile response");
        }

        setProfile(studentProfile as ProfileWithApaar);
      } catch (error: any) {
        console.log(
          "STUDENT PROFILE ERROR:",
          error?.response?.data ?? error?.message,
        );

        if (error?.response?.status === 401) {
          try {
            await dispatch(logout()).unwrap();
          } catch (logoutError) {
            console.log("AUTO LOGOUT ERROR:", logoutError);
          }
          return;
        }

        if (mountedRef.current) {
          setProfileError(
            error?.response?.data?.message ??
              error?.message ??
              "Unable to load profile.",
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    mountedRef.current = true;
    void loadProfile();

    return () => {
      mountedRef.current = false;
    };
  }, [loadProfile]);

  const performLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
      setLoggingOut(false);
      Alert.alert("Logout Failed", "Unable to logout. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => void performLogout(),
      },
    ]);
  };

  const className = getName(profile?.classId) || getName(profile?.class) || "-";
  const sectionName =
    getName(profile?.sectionId) || getName(profile?.section) || "-";
  const sessionName =
    getName(profile?.sessionId) || getName(profile?.session) || "-";
  const profileImageUrl = useMemo(() => getProfileImageUrl(profile), [profile]);

  if (loading && !profile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F7FB]">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <Text className="mt-4 text-sm font-semibold text-[#667085]">
          Loading your profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (profileError && !profile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F7FB] px-6">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <Ionicons name="alert-circle-outline" size={32} color={COLORS.danger} />
        </View>
        <Text className="mt-4 text-xl font-extrabold text-[#14213D]">
          Unable to load profile
        </Text>
        <Text className="mt-2 text-center text-sm leading-6 text-[#667085]">
          {profileError}
        </Text>

        <View className="mt-6 w-full flex-row gap-3">
          <Pressable
            onPress={() => void loadProfile()}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#3154D9] px-4"
          >
            <Ionicons name="refresh-outline" size={19} color="#FFFFFF" />
            <Text className="font-bold text-white">Try Again</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-[#E4E8F0] bg-white px-4"
          >
            <Ionicons name="log-out-outline" size={19} color={COLORS.danger} />
            <Text className="font-bold text-[#D92D20]">Logout</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadProfile(true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View className="overflow-hidden rounded-b-[32px] bg-[#1D327F] px-5 pb-20 pt-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-widest text-blue-200">
                Student Portal
              </Text>
              <Text className="mt-1 text-2xl font-extrabold text-white">My Profile</Text>
            </View>
            <Pressable
              onPress={() => void loadProfile(true)}
              disabled={refreshing}
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh-outline" size={21} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </View>

        <View className="-mt-14 px-5">
          <View className="rounded-3xl border border-[#E4E8F0] bg-white p-5 shadow-sm">
            <View className="flex-row items-center">
              <View className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-[#EEF1FF] shadow-sm">
                {profileImageUrl ? (
                  <Image
                    source={{ uri: profileImageUrl }}
                    resizeMode="cover"
                    className="h-full w-full"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-2xl font-extrabold text-[#3154D9]">
                      {getInitials(profile?.name)}
                    </Text>
                  </View>
                )}
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-xl font-extrabold text-[#14213D]" numberOfLines={2}>
                  {profile?.name?.trim() || "Student"}
                </Text>
                <View className="mt-2 flex-row flex-wrap items-center gap-2">
                  <Badge icon="school-outline" label={`Class ${className}`} />
                  <Badge icon="people-outline" label={`Section ${sectionName}`} />
                </View>
              </View>
            </View>

            <View className="mt-5 flex-row rounded-2xl bg-[#F7F8FC] p-3">
              <SummaryItem label="Roll No." value={String(profile?.rollNumber ?? profile?.rollNo ?? "-")} />
              <View className="mx-3 w-px bg-[#E4E8F0]" />
              <SummaryItem label="Session" value={sessionName} />
              <View className="mx-3 w-px bg-[#E4E8F0]" />
              <SummaryItem label="Status" value={formatEnumValue(profile?.status)} success />
            </View>
          </View>

          <ProfileCard icon="school-outline" title="Academic Details">
            <ProfileRow label="Admission Number" value={String(profile?.admissionNumber ?? profile?.admissionNo ?? profile?.admissionId ?? "-")} />
            <ProfileRow label="Academic Session" value={sessionName} />
            <ProfileRow label="Class & Section" value={`${className} · ${sectionName}`} />
            <ProfileRow label="Admission Date" value={formatDate(profile?.admissionDate)} />
            <ProfileRow label="Admission Type" value={formatEnumValue(profile?.admissionType)} />
            <ProfileRow label="Admission Category" value={formatEnumValue(profile?.admissionCategory)} last />
          </ProfileCard>

          <ProfileCard icon="person-outline" title="Personal Details">
            <ProfileRow label="Gender" value={formatEnumValue(profile?.gender)} />
            <ProfileRow label="Date of Birth" value={formatDate(profile?.dob ?? profile?.dateOfBirth)} />
            <ProfileRow label="Blood Group" value={profile?.bloodGroup ?? "-"} />
            <ProfileRow label="Mobile" value={profile?.mobile ?? "-"} />
            <ProfileRow label="Email" value={profile?.email ?? "-"} />
            <ProfileRow label="Category" value={formatEnumValue(profile?.category)} />
            <ProfileRow label="Religion" value={profile?.religion ?? "-"} />
            <ProfileRow label="Caste" value={profile?.caste ?? "-"} />
            <ProfileRow label="Aadhaar Number" value={profile?.aadhaarNumber ?? "-"} />
            <ProfileRow label="APAAR ID" value={profile?.apaarId ?? "-"} last />
          </ProfileCard>

          <ProfileCard icon="people-outline" title="Parent Details">
            <ProfileRow label="Father Name" value={profile?.father?.name ?? "-"} />
            <ProfileRow label="Father Mobile" value={profile?.father?.mobile ?? "-"} />
            <ProfileRow label="Father Occupation" value={profile?.father?.occupation ?? "-"} />
            <ProfileRow label="Father Aadhaar" value={profile?.father?.aadhaarNumber ?? "-"} />
            <ProfileRow label="Mother Name" value={profile?.mother?.name ?? "-"} />
            <ProfileRow label="Mother Mobile" value={profile?.mother?.mobile ?? "-"} />
            <ProfileRow label="Mother Occupation" value={profile?.mother?.occupation ?? "-"} />
            <ProfileRow label="Mother Aadhaar" value={profile?.mother?.aadhaarNumber ?? "-"} last />
          </ProfileCard>

          <ProfileCard icon="location-outline" title="Address Details">
            <ProfileRow label="Current Address" value={formatAddress(profile?.currentAddress ?? profile?.address)} multiline />
            <ProfileRow label="Permanent Address" value={formatAddress(profile?.permanentAddress)} multiline last />
          </ProfileCard>

          {profileError && (
            <View className="mt-4 flex-row items-start rounded-xl border border-amber-200 bg-amber-50 p-3">
              <Ionicons name="warning-outline" size={19} color="#B54708" />
              <Text className="ml-2 flex-1 text-sm leading-5 text-amber-800">
                Latest profile refresh failed. Showing previously loaded details.
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            className={`mt-5 min-h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 ${loggingOut ? "opacity-60" : ""}`}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color={COLORS.danger} />
            ) : (
              <Ionicons name="log-out-outline" size={21} color={COLORS.danger} />
            )}
            <Text className="font-extrabold text-[#D92D20]">
              {loggingOut ? "Logging out..." : "Logout"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Badge = ({ icon, label }: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
}) => (
  <View className="flex-row items-center rounded-full bg-[#EEF1FF] px-2.5 py-1">
    <Ionicons name={icon} size={13} color={COLORS.primary} />
    <Text className="ml-1 text-xs font-bold text-[#3154D9]">{label}</Text>
  </View>
);

const SummaryItem = ({ label, value, success = false }: {
  label: string;
  value: string;
  success?: boolean;
}) => (
  <View className="min-w-0 flex-1 items-center">
    <Text className="text-[10px] font-bold uppercase tracking-wide text-[#98A2B3]">{label}</Text>
    <Text
      className={`mt-1 text-center text-xs font-extrabold ${success ? "text-emerald-600" : "text-[#14213D]"}`}
      numberOfLines={1}
    >
      {value}
    </Text>
  </View>
);

const ProfileCard = ({ icon, title, children }: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mt-4 overflow-hidden rounded-2xl border border-[#E4E8F0] bg-white shadow-sm">
    <View className="flex-row items-center border-b border-[#EEF1F5] px-4 py-3.5">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FF]">
        <Ionicons name={icon} size={19} color={COLORS.primary} />
      </View>
      <Text className="ml-3 text-base font-extrabold text-[#14213D]">{title}</Text>
    </View>
    <View className="px-4">{children}</View>
  </View>
);

const ProfileRow = ({ label, value, multiline = false, last = false }: {
  label: string;
  value: string;
  multiline?: boolean;
  last?: boolean;
}) => (
  <View
    className={`${multiline ? "py-3.5" : "min-h-12 flex-row items-center py-2.5"} ${!last ? "border-b border-[#EEF1F5]" : ""}`}
  >
    <Text className="text-sm text-[#667085]">{label}</Text>
    <Text className={`${multiline ? "mt-1 leading-5" : "ml-4 flex-1 text-right"} text-sm font-bold text-[#14213D]`}>
      {value}
    </Text>
  </View>
);

export default StudentProfileScreen;
