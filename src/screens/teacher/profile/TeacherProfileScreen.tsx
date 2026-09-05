import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import api from "../../../api/axios";


import {
  logout,
} from "../../../features/auth/auth.slice";

import type {
  TeacherStackParamList,
} from "types/navigation.types";
import { useAppDispatch } from "@/store/hook";

/* =====================================================
   NAVIGATION
===================================================== */

type NavigationProp =
  NativeStackNavigationProp<
    TeacherStackParamList
  >;

/* =====================================================
   TYPES
===================================================== */

interface RelationItem {
  _id?: string;
  id?: string;
  name?: string;
  code?: string;
}

interface TeacherProfile {
  _id?: string;
  id?: string;

  name?: string;

  email?: string;

  mobile?: string;

  employeeId?: string;

  qualification?: string;

  specialization?: string;

  experience?: number;

  gender?: string;

  dateOfBirth?: string;

  joiningDate?: string;

  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  schoolId?:
    | string
    | RelationItem;

  status?: string;

  isActive?: boolean;

  createdAt?: string;
}

/* =====================================================
   HELPERS
===================================================== */

const getApiData = (
  response: any
): any => {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
};

const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getInitials = (
  name?: string
): string => {
  if (!name) {
    return "T";
  }

  const parts =
    name
      .trim()
      .split(" ")
      .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      ?.charAt(0)
      .toUpperCase() ?? "T";
  }

  return `${parts[0]?.charAt(0) ?? ""}${
    parts[
      parts.length - 1
    ]?.charAt(0) ?? ""
  }`.toUpperCase();
};

/* =====================================================
   INFO ROW
===================================================== */

interface InfoRowProps {
  icon:
    keyof typeof Ionicons.glyphMap;

  label: string;

  value?: string | number;
}

const InfoRow = ({
  icon,
  label,
  value,
}: InfoRowProps) => {
  return (
    <View className="flex-row items-center border-b border-[#EEF0F3] py-4">

      <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

        <Ionicons
          name={icon}
          size={19}
          color="#4355D8"
        />

      </View>

      <View className="ml-3 flex-1">

        <Text className="text-[10px] font-bold uppercase text-[#9AA4B5]">
          {label}
        </Text>

        <Text className="mt-1 text-sm font-bold text-[#15213B]">
          {value ||
            "-"}
        </Text>

      </View>

    </View>
  );
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherProfileScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    const dispatch =
      useAppDispatch();

    const [
      teacher,
      setTeacher,
    ] = useState<
      TeacherProfile | null
    >(null);

    const [
      loading,
      setLoading,
    ] = useState(
      true
    );

    const [
      refreshing,
      setRefreshing,
    ] = useState(
      false
    );

    const [
      error,
      setError,
    ] = useState<
      string | null
    >(null);

    /* =================================================
       FETCH PROFILE
    ================================================= */

    const fetchProfile =
      useCallback(
        async (
          showLoader =
            true
        ) => {
          try {
            if (
              showLoader
            ) {
              setLoading(
                true
              );
            }

            setError(
              null
            );

            const response =
              await api.get(
                "/teachers/me"
              );

            const data =
              getApiData(
                response
              );

            /*
             * Backend response:
             *
             * data.teacher
             *
             * Agar direct teacher aaye
             * to fallback bhi handle hai.
             */

            const teacherData =
              data?.teacher ??
              data;

            if (
              !teacherData
            ) {
              throw new Error(
                "Teacher profile not found"
              );
            }

            setTeacher(
              teacherData
            );
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER PROFILE ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Teacher profile load nahi ho saka."
            );
          } finally {
            if (
              showLoader
            ) {
              setLoading(
                false
              );
            }
          }
        },
        []
      );

    /* =================================================
       INITIAL
    ================================================= */

    useEffect(() => {
      fetchProfile();
    }, [
      fetchProfile,
    ]);

    /* =================================================
       REFRESH
    ================================================= */

    const handleRefresh =
      async () => {
        try {
          setRefreshing(
            true
          );

          await fetchProfile(
            false
          );
        } finally {
          setRefreshing(
            false
          );
        }
      };

    /* =================================================
       LOGOUT
    ================================================= */

    const performLogout =
      async () => {
        try {
          await dispatch(
            logout()
          );

          /*
           * RootNavigator auth state ke hisab se
           * Login par switch karega.
           *
           * Isliye yahan reset/navigate force
           * nahi kar rahe.
           */

        } catch (
          err
        ) {
          console.log(
            "LOGOUT ERROR:",
            err
          );

          Alert.alert(
            "Logout Failed",
            "Logout nahi ho saka."
          );
        }
      };

    const handleLogout =
      () => {
        Alert.alert(
          "Logout",
          "Kya aap logout karna chahte hain?",
          [
            {
              text:
                "Cancel",
              style:
                "cancel",
            },
            {
              text:
                "Logout",
              style:
                "destructive",
              onPress:
                performLogout,
            },
          ]
        );
      };

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="person-outline"
              size={30}
              color="#4355D8"
            />

          </View>

          <ActivityIndicator
            className="mt-5"
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading profile...
          </Text>

        </SafeAreaView>
      );
    }

    /* =================================================
       ERROR
    ================================================= */

    if (
      error &&
      !teacher
    ) {
      return (
        <SafeAreaView className="flex-1 bg-[#F7F7FB]">

          <View className="flex-1 items-center justify-center px-6">

            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#FDECEE]">

              <Ionicons
                name="alert-circle-outline"
                size={30}
                color="#DC4C5A"
              />

            </View>

            <Text className="mt-4 text-base font-extrabold text-[#15213B]">
              Profile unavailable
            </Text>

            <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
              {error}
            </Text>

            <Pressable
              onPress={() =>
                fetchProfile()
              }
              className="mt-5 rounded-2xl bg-[#4355D8] px-6 py-3"
            >

              <Text className="text-sm font-bold text-white">
                Retry
              </Text>

            </Pressable>

          </View>

        </SafeAreaView>
      );
    }

    /* =================================================
       UI
    ================================================= */

    return (
      <SafeAreaView
        edges={[
          "top",
          "left",
          "right",
        ]}
        className="flex-1 bg-[#F7F7FB]"
      >

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="pb-28"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor="#4355D8"
            />
          }
        >

          {/* ==========================================
              HEADER
          ========================================== */}

          <View className="bg-[#4355D8] px-5 pb-9 pt-5">

            <View className="flex-row items-center justify-between">

              <View>

                <Text className="text-2xl font-extrabold text-white">
                  My Profile
                </Text>

                <Text className="mt-1 text-xs text-white/70">
                  Teacher account information
                </Text>

              </View>

              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#FFFFFF"
                />

              </View>

            </View>

          </View>

          {/* ==========================================
              PROFILE CARD
          ========================================== */}

          <View className="-mt-5 px-5">

            <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-5 py-6">

              <View className="h-20 w-20 items-center justify-center rounded-[26px] bg-[#EEF0FF]">

                <Text className="text-2xl font-extrabold text-[#4355D8]">
                  {getInitials(
                    teacher?.name
                  )}
                </Text>

              </View>

              <Text className="mt-4 text-xl font-extrabold text-[#15213B]">
                {teacher?.name ??
                  "Teacher"}
              </Text>

              <Text className="mt-1 text-xs text-[#606F88]">
                {teacher?.qualification ??
                  "Teacher"}
              </Text>

              {teacher
                ?.employeeId ? (
                <View className="mt-3 rounded-full bg-[#EEF0FF] px-4 py-2">

                  <Text className="text-[10px] font-extrabold text-[#4355D8]">
                    EMP ID:{" "}
                    {
                      teacher.employeeId
                    }
                  </Text>

                </View>
              ) : null}

              {teacher
                ?.status ? (
                <View className="mt-3 flex-row items-center">

                  <View
                    className={`h-2 w-2 rounded-full ${
                      teacher.status ===
                        "ACTIVE" ||
                      teacher.isActive ===
                        true
                        ? "bg-[#2BAA7B]"
                        : "bg-[#DC4C5A]"
                    }`}
                  />

                  <Text className="ml-2 text-[10px] font-bold text-[#606F88]">
                    {
                      teacher.status
                    }
                  </Text>

                </View>
              ) : null}

            </View>

          </View>

          {/* ==========================================
              QUICK ACTION
          ========================================== */}

          <View className="px-5 pt-6">

            <Text className="text-base font-extrabold text-[#15213B]">
              Quick Access
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  "Salary"
                )
              }
              className="mt-3 flex-row items-center rounded-3xl bg-[#E7F7F1] p-4"
            >

              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">

                <Ionicons
                  name="wallet-outline"
                  size={23}
                  color="#2BAA7B"
                />

              </View>

              <View className="ml-4 flex-1">

                <Text className="text-sm font-extrabold text-[#15213B]">
                  My Salary
                </Text>

                <Text className="mt-1 text-[10px] text-[#606F88]">
                  Salary details and payment history
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#2BAA7B"
              />

            </Pressable>

          </View>

          {/* ==========================================
              CONTACT
          ========================================== */}

          <View className="px-5 pt-6">

            <Text className="text-base font-extrabold text-[#15213B]">
              Contact Information
            </Text>

            <View className="mt-3 rounded-3xl border border-[#E5E8F0] bg-white px-4">

              <InfoRow
                icon="mail-outline"
                label="Email"
                value={
                  teacher?.email
                }
              />

              <InfoRow
                icon="call-outline"
                label="Mobile"
                value={
                  teacher?.mobile
                }
              />

            </View>

          </View>

          {/* ==========================================
              PROFESSIONAL
          ========================================== */}

          <View className="px-5 pt-6">

            <Text className="text-base font-extrabold text-[#15213B]">
              Professional Information
            </Text>

            <View className="mt-3 rounded-3xl border border-[#E5E8F0] bg-white px-4">

              <InfoRow
                icon="id-card-outline"
                label="Employee ID"
                value={
                  teacher
                    ?.employeeId
                }
              />

              <InfoRow
                icon="school-outline"
                label="Qualification"
                value={
                  teacher
                    ?.qualification
                }
              />

              <InfoRow
                icon="book-outline"
                label="Specialization"
                value={
                  teacher
                    ?.specialization
                }
              />

              <InfoRow
                icon="briefcase-outline"
                label="Experience"
                value={
                  teacher
                    ?.experience !==
                  undefined
                    ? `${teacher.experience} years`
                    : "-"
                }
              />

              <InfoRow
                icon="calendar-outline"
                label="Joining Date"
                value={
                  formatDate(
                    teacher
                      ?.joiningDate
                  )
                }
              />

            </View>

          </View>

          {/* ==========================================
              PERSONAL
          ========================================== */}

          <View className="px-5 pt-6">

            <Text className="text-base font-extrabold text-[#15213B]">
              Personal Information
            </Text>

            <View className="mt-3 rounded-3xl border border-[#E5E8F0] bg-white px-4">

              <InfoRow
                icon="person-outline"
                label="Gender"
                value={
                  teacher?.gender
                }
              />

              <InfoRow
                icon="calendar-number-outline"
                label="Date of Birth"
                value={
                  formatDate(
                    teacher
                      ?.dateOfBirth
                  )
                }
              />

            </View>

          </View>

          {/* ==========================================
              ADDRESS
          ========================================== */}

          {teacher?.address ? (
            <View className="px-5 pt-6">

              <Text className="text-base font-extrabold text-[#15213B]">
                Address
              </Text>

              <View className="mt-3 rounded-3xl border border-[#E5E8F0] bg-white p-4">

                <View className="flex-row">

                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#4355D8"
                    />

                  </View>

                  <View className="ml-3 flex-1">

                    <Text className="text-xs font-bold leading-5 text-[#15213B]">
                      {[
                        teacher
                          .address
                          .addressLine,

                        teacher
                          .address
                          .city,

                        teacher
                          .address
                          .state,

                        teacher
                          .address
                          .pincode,

                        teacher
                          .address
                          .country,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        ) ||
                        "-"}
                    </Text>

                  </View>

                </View>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              LOGOUT
          ========================================== */}

          <View className="px-5 pt-7">

            <Pressable
              onPress={
                handleLogout
              }
              className="flex-row items-center justify-center rounded-2xl border border-[#F2C8CD] bg-[#FDECEE] py-4"
            >

              <Ionicons
                name="log-out-outline"
                size={20}
                color="#DC4C5A"
              />

              <Text className="ml-2 text-sm font-extrabold text-[#DC4C5A]">
                Logout
              </Text>

            </Pressable>

          </View>

          {/* ==========================================
              VERSION
          ========================================== */}

          <Text className="mt-6 text-center text-[10px] font-semibold text-[#A1AABC]">
            School ERP • Teacher App
          </Text>

        </ScrollView>

      </SafeAreaView>
    );
  };

export default TeacherProfileScreen;