import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import type {
  TeacherStackParamList,
} from "types/navigation.types";

/* =====================================================
   NAVIGATION
===================================================== */

type NavigationProp =
  NativeStackNavigationProp<
    TeacherStackParamList,
    "Timetable"
  >;

/* =====================================================
   TYPES
===================================================== */

type TimetableDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type PeriodType =
  | "REGULAR"
  | "BREAK"
  | "LUNCH"
  | string;

interface RelationItem {
  _id?: string;
  id?: string;

  name?: string;
  code?: string;

  employeeId?: string;
}

interface TimetableEntry {
  _id?: string;
  id?: string;

  sessionId?:
    | string
    | RelationItem;

  classId?:
    | string
    | RelationItem;

  sectionId?:
    | string
    | RelationItem;

  subjectId?:
    | string
    | RelationItem;

  teacherId?:
    | string
    | RelationItem;

  day?: TimetableDay | string;

  periodNumber?: number;

  startTime?: string;

  endTime?: string;

  periodType?: PeriodType;

  roomNumber?: string;

  isActive?: boolean;
}

/* =====================================================
   DAYS
===================================================== */

const DAYS: {
  key: TimetableDay;
  short: string;
  label: string;
}[] = [
  {
    key: "MONDAY",
    short: "Mon",
    label: "Monday",
  },
  {
    key: "TUESDAY",
    short: "Tue",
    label: "Tuesday",
  },
  {
    key: "WEDNESDAY",
    short: "Wed",
    label: "Wednesday",
  },
  {
    key: "THURSDAY",
    short: "Thu",
    label: "Thursday",
  },
  {
    key: "FRIDAY",
    short: "Fri",
    label: "Friday",
  },
  {
    key: "SATURDAY",
    short: "Sat",
    label: "Saturday",
  },
];

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

const extractArray = (
  value: any,
  keys: string[]
): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  for (const key of keys) {
    if (
      Array.isArray(
        value?.[key]
      )
    ) {
      return value[key];
    }
  }

  return [];
};

const getName = (
  value: unknown
): string => {
  if (
    !value ||
    typeof value ===
      "string"
  ) {
    return "";
  }

  const item =
    value as RelationItem;

  return (
    item.name ??
    item.code ??
    ""
  );
};

const getTodayDay =
  (): TimetableDay => {
    const day =
      new Date().getDay();

    switch (day) {
      case 1:
        return "MONDAY";

      case 2:
        return "TUESDAY";

      case 3:
        return "WEDNESDAY";

      case 4:
        return "THURSDAY";

      case 5:
        return "FRIDAY";

      case 6:
        return "SATURDAY";

      default:
        return "MONDAY";
    }
  };

/* =====================================================
   TIME DISPLAY
===================================================== */

const formatTime = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  const parts =
    value.split(":");

  const hours =
    Number(parts[0]);

  const minutes =
    Number(parts[1] ?? 0);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return value;
  }

  const suffix =
    hours >= 12
      ? "PM"
      : "AM";

  const hour12 =
    hours % 12 || 12;

  return `${hour12}:${String(
    minutes
  ).padStart(
    2,
    "0"
  )} ${suffix}`;
};

/* =====================================================
   PERIOD ICON
===================================================== */

const getPeriodIcon = (
  type?: string
): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case "BREAK":
      return "cafe-outline";

    case "LUNCH":
      return "restaurant-outline";

    default:
      return "book-outline";
  }
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherTimetableScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    const [
      timetable,
      setTimetable,
    ] = useState<
      TimetableEntry[]
    >([]);

    const [
      selectedDay,
      setSelectedDay,
    ] = useState<
      TimetableDay
    >(getTodayDay());

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
       FETCH
    ================================================= */

    const fetchTimetable =
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
                "/timetable/teacher/me"
              );

            const data =
              getApiData(
                response
              );

            const list =
              extractArray(
                data,
                [
                  "timetable",
                  "timetables",
                  "periods",
                  "data",
                ]
              );

            setTimetable(
              list
            );
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER TIMETABLE ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Timetable load nahi ho saka."
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
      fetchTimetable();
    }, [
      fetchTimetable,
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

          await fetchTimetable(
            false
          );
        } finally {
          setRefreshing(
            false
          );
        }
      };

    /* =================================================
       FILTER DAY
    ================================================= */

    const dayPeriods =
      useMemo(() => {
        return timetable
          .filter(
            (item) =>
              item.day ===
              selectedDay
          )
          .sort(
            (a, b) =>
              (
                a.periodNumber ??
                0
              ) -
              (
                b.periodNumber ??
                0
              )
          );
      }, [
        timetable,
        selectedDay,
      ]);

    /* =================================================
       WEEKLY STATS
    ================================================= */

    const weeklyStats =
      useMemo(() => {
        const regular =
          timetable.filter(
            (item) =>
              item.periodType ===
                "REGULAR" ||
              !item.periodType
          );

        const subjects =
          new Set(
            regular
              .map(
                (item) =>
                  getName(
                    item.subjectId
                  )
              )
              .filter(Boolean)
          );

        const classes =
          new Set(
            regular
              .map((item) => {
                const className =
                  getName(
                    item.classId
                  );

                const sectionName =
                  getName(
                    item.sectionId
                  );

                if (
                  !className
                ) {
                  return "";
                }

                return `${className}-${sectionName}`;
              })
              .filter(Boolean)
          );

        return {
          periods:
            regular.length,

          subjects:
            subjects.size,

          classes:
            classes.size,
        };
      }, [
        timetable,
      ]);

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="calendar-outline"
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
            Loading timetable...
          </Text>

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

        {/* ============================================
            HEADER
        ============================================ */}

        <View className="bg-[#4355D8] px-5 pb-7 pt-4">

          <View className="flex-row items-center">

            <Pressable
              onPress={() =>
                navigation.goBack()
              }
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
            >

              <Ionicons
                name="arrow-back"
                size={22}
                color="#FFFFFF"
              />

            </Pressable>

            <View className="ml-4 flex-1">

              <Text className="text-xl font-extrabold text-white">
                My Timetable
              </Text>

              <Text className="mt-1 text-xs text-white/70">
                Weekly teaching schedule
              </Text>

            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

              <Ionicons
                name="calendar-outline"
                size={21}
                color="#FFFFFF"
              />

            </View>

          </View>

        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="pb-24"
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
              WEEKLY STATS
          ========================================== */}

          <View className="px-5 pt-5">

            <View className="flex-row gap-2">

              <View className="flex-1 rounded-2xl bg-white p-3">

                <Text className="text-[9px] font-extrabold text-[#606F88]">
                  PERIODS
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#15213B]">
                  {
                    weeklyStats.periods
                  }
                </Text>

              </View>

              <View className="flex-1 rounded-2xl bg-[#EEF0FF] p-3">

                <Text className="text-[9px] font-extrabold text-[#4355D8]">
                  SUBJECTS
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#4355D8]">
                  {
                    weeklyStats.subjects
                  }
                </Text>

              </View>

              <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">

                <Text className="text-[9px] font-extrabold text-[#2BAA7B]">
                  CLASSES
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#2BAA7B]">
                  {
                    weeklyStats.classes
                  }
                </Text>

              </View>

            </View>

          </View>

          {/* ==========================================
              DAY SELECTOR
          ========================================== */}

          <View className="pt-6">

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerClassName="px-5"
            >

              {DAYS.map(
                (day) => {
                  const active =
                    selectedDay ===
                    day.key;

                  const today =
                    getTodayDay() ===
                    day.key;

                  const count =
                    timetable.filter(
                      (item) =>
                        item.day ===
                          day.key &&
                        (
                          item.periodType ===
                            "REGULAR" ||
                          !item.periodType
                        )
                    ).length;

                  return (
                    <Pressable
                      key={
                        day.key
                      }
                      onPress={() =>
                        setSelectedDay(
                          day.key
                        )
                      }
                      className={`mr-2 min-w-[67px] items-center rounded-2xl border px-3 py-3 ${
                        active
                          ? "border-[#4355D8] bg-[#4355D8]"
                          : "border-[#E5E8F0] bg-white"
                      }`}
                    >

                      <Text
                        className={`text-xs font-extrabold ${
                          active
                            ? "text-white"
                            : "text-[#15213B]"
                        }`}
                      >
                        {day.short}
                      </Text>

                      <Text
                        className={`mt-1 text-[9px] ${
                          active
                            ? "text-white/70"
                            : "text-[#9AA4B5]"
                        }`}
                      >
                        {count} period
                        {count === 1
                          ? ""
                          : "s"}
                      </Text>

                      {today ? (
                        <View
                          className={`mt-2 h-1.5 w-1.5 rounded-full ${
                            active
                              ? "bg-white"
                              : "bg-[#4355D8]"
                          }`}
                        />
                      ) : null}

                    </Pressable>
                  );
                }
              )}

            </ScrollView>

          </View>

          {/* ==========================================
              ERROR
          ========================================== */}

          {error ? (
            <View className="px-5 pt-5">

              <View className="rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                <View className="flex-row items-center">

                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#DC4C5A"
                  />

                  <Text className="ml-2 flex-1 text-xs font-semibold text-[#DC4C5A]">
                    {error}
                  </Text>

                </View>

                <Pressable
                  onPress={() =>
                    fetchTimetable()
                  }
                  className="mt-3 self-start rounded-xl bg-[#DC4C5A] px-4 py-2"
                >
                  <Text className="text-xs font-bold text-white">
                    Retry
                  </Text>
                </Pressable>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              DAY TITLE
          ========================================== */}

          <View className="px-5 pb-3 pt-6">

            <Text className="text-lg font-extrabold text-[#15213B]">
              {
                DAYS.find(
                  (day) =>
                    day.key ===
                    selectedDay
                )?.label
              }
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {
                dayPeriods.length
              }{" "}
              scheduled period
              {dayPeriods.length ===
              1
                ? ""
                : "s"}
            </Text>

          </View>

          {/* ==========================================
              PERIODS
          ========================================== */}

          {dayPeriods.length >
          0 ? (
            <View className="px-5">

              {dayPeriods.map(
                (
                  period,
                  index
                ) => {
                  const isBreak =
                    period.periodType ===
                      "BREAK" ||
                    period.periodType ===
                      "LUNCH";

                  const subjectName =
                    getName(
                      period.subjectId
                    );

                  const className =
                    getName(
                      period.classId
                    );

                  const sectionName =
                    getName(
                      period.sectionId
                    );

                  const key =
                    period._id ??
                    period.id ??
                    `${selectedDay}-${period.periodNumber}-${index}`;

                  return (
                    <View
                      key={key}
                      className={`mb-4 rounded-3xl border p-4 ${
                        isBreak
                          ? "border-[#F2DDBD] bg-[#FFF8EC]"
                          : "border-[#E5E8F0] bg-white"
                      }`}
                    >

                      <View className="flex-row">

                        {/* TIME */}

                        <View className="w-[78px] items-center border-r border-[#EEF0F3] pr-3">

                          <Text className="text-[10px] font-bold text-[#606F88]">
                            {formatTime(
                              period.startTime
                            )}
                          </Text>

                          <View className="my-2 h-5 w-px bg-[#D8DDEA]" />

                          <Text className="text-[10px] font-bold text-[#606F88]">
                            {formatTime(
                              period.endTime
                            )}
                          </Text>

                        </View>

                        {/* DETAILS */}

                        <View className="ml-4 flex-1">

                          <View className="flex-row items-start">

                            <View
                              className={`h-11 w-11 items-center justify-center rounded-2xl ${
                                isBreak
                                  ? "bg-[#FFF0D7]"
                                  : "bg-[#EEF0FF]"
                              }`}
                            >

                              <Ionicons
                                name={getPeriodIcon(
                                  period.periodType
                                )}
                                size={21}
                                color={
                                  isBreak
                                    ? "#E59A2F"
                                    : "#4355D8"
                                }
                              />

                            </View>

                            <View className="ml-3 flex-1">

                              <Text className="text-sm font-extrabold text-[#15213B]">

                                {period.periodType ===
                                "BREAK"
                                  ? "Break"
                                  : period.periodType ===
                                      "LUNCH"
                                    ? "Lunch Break"
                                    : subjectName ||
                                      "Subject"}

                              </Text>

                              {!isBreak ? (
                                <Text className="mt-1 text-xs font-bold text-[#4355D8]">
                                  {className ||
                                    "Class"}
                                  {" • "}
                                  Section{" "}
                                  {sectionName ||
                                    "-"}
                                </Text>
                              ) : null}

                            </View>

                            <View className="rounded-full bg-[#F4F5FA] px-2.5 py-1.5">

                              <Text className="text-[9px] font-extrabold text-[#606F88]">
                                P
                                {period.periodNumber ??
                                  "-"}
                              </Text>

                            </View>

                          </View>

                          {/* ROOM */}

                          {!isBreak &&
                          period.roomNumber ? (
                            <View className="mt-3 flex-row items-center">

                              <Ionicons
                                name="location-outline"
                                size={14}
                                color="#606F88"
                              />

                              <Text className="ml-1.5 text-[10px] font-semibold text-[#606F88]">
                                Room{" "}
                                {
                                  period.roomNumber
                                }
                              </Text>

                            </View>
                          ) : null}

                        </View>

                      </View>

                    </View>
                  );
                }
              )}

            </View>
          ) : (
            <View className="mx-5 mt-3 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white px-6 py-12">

              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                <Ionicons
                  name="calendar-outline"
                  size={30}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No periods scheduled
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                Is din aapki koi
                class scheduled nahi
                hai.
              </Text>

            </View>
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };

export default TeacherTimetableScreen;