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
import { TeacherStackParamList } from "types/navigation.types";



/* =====================================================
   TYPES
===================================================== */

interface TeacherProfile {
  _id?: string;
  id?: string;

  employeeId?: string;
  name?: string;
  email?: string;
  mobile?: string;

  gender?: string;
  qualification?: string;

  joiningDate?: string;
  profileImage?: string;

  isActive?: boolean;
}

interface PopulatedItem {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  code?: string;
}

interface SubjectAssignment {
  _id?: string;
  id?: string;

  subjectId?: string | PopulatedItem;
  subject?: string | PopulatedItem;

  classId?: string | PopulatedItem;
  class?: string | PopulatedItem;

  sectionId?: string | PopulatedItem;
  section?: string | PopulatedItem;

  academicSessionId?:
    | string
    | PopulatedItem;

  weeklyPeriods?: number;

  isActive?: boolean;
}

interface TimetableEntry {
  _id?: string;
  id?: string;

  day?: string;

  startTime?: string;
  endTime?: string;

  period?: number;
  periodNumber?: number;

  room?: string;

  type?: string;

  subjectId?: string | PopulatedItem;
  subject?: string | PopulatedItem;

  classId?: string | PopulatedItem;
  class?: string | PopulatedItem;

  sectionId?: string | PopulatedItem;
  section?: string | PopulatedItem;
}

type NavigationProp =
  NativeStackNavigationProp<TeacherStackParamList>;

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
  data: any,
  keys: string[]
): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};

const getName = (
  value: unknown
): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object"
  ) {
    const item =
      value as PopulatedItem;

    return (
      item.name ??
      item.title ??
      item.code ??
      ""
    );
  }

  return "";
};

const getTodayName = () => {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return days[
    new Date().getDay()
  ];
};

/* =====================================================
   COMPONENT
===================================================== */

const TeacherDashboardScreen =
  () => {
    const navigation =
      useNavigation<NavigationProp>();

    /* =================================================
       STATE
    ================================================= */

    const [
      teacher,
      setTeacher,
    ] =
      useState<TeacherProfile | null>(
        null
      );

    const [
      assignments,
      setAssignments,
    ] = useState<
      SubjectAssignment[]
    >([]);

    const [
      timetable,
      setTimetable,
    ] = useState<
      TimetableEntry[]
    >([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      refreshing,
      setRefreshing,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState<
      string | null
    >(null);

    /* =================================================
       FETCH DASHBOARD
    ================================================= */

    const fetchDashboard =
      useCallback(
        async (
          refresh = false
        ) => {
          try {
            if (refresh) {
              setRefreshing(
                true
              );
            } else {
              setLoading(true);
            }

            setError(null);

            const results =
              await Promise.allSettled(
                [
                  api.get(
                    "/teachers/me"
                  ),

                  api.get(
                    "/academic/subject-assignments/teacher/me"
                  ),

                  api.get(
                    "/timetable/teacher/me"
                  ),
                ]
              );

            const [
              teacherResult,
              assignmentResult,
              timetableResult,
            ] = results;

            /* ===============================
               TEACHER PROFILE
            =============================== */

            if (
              teacherResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  teacherResult.value
                );

              const profile =
                data?.teacher ??
                data?.profile ??
                data;

              setTeacher(
                profile ?? null
              );
            } else {
              console.log(
                "TEACHER PROFILE ERROR:",
                teacherResult.reason
                  ?.response?.data ??
                  teacherResult.reason
                    ?.message ??
                  teacherResult.reason
              );
            }

            /* ===============================
               SUBJECT ASSIGNMENTS
            =============================== */

            if (
              assignmentResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  assignmentResult.value
                );

              setAssignments(
                extractArray(
                  data,
                  [
                    "assignments",
                    "subjectAssignments",
                    "subjects",
                    "data",
                  ]
                )
              );
            } else {
              console.log(
                "ASSIGNMENT ERROR:",
                assignmentResult.reason
                  ?.response?.data ??
                  assignmentResult
                    .reason
                    ?.message ??
                  assignmentResult
                    .reason
              );
            }

            /* ===============================
               TIMETABLE
            =============================== */

            if (
              timetableResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  timetableResult.value
                );

              setTimetable(
                extractArray(
                  data,
                  [
                    "timetable",
                    "entries",
                    "periods",
                    "schedules",
                    "data",
                  ]
                )
              );
            } else {
              console.log(
                "TIMETABLE ERROR:",
                timetableResult.reason
                  ?.response?.data ??
                  timetableResult.reason
                    ?.message ??
                  timetableResult.reason
              );
            }

            /* ===============================
               ALL FAILED
            =============================== */

            const failed =
              results.filter(
                (item) =>
                  item.status ===
                  "rejected"
              );

            if (
              failed.length ===
              results.length
            ) {
              setError(
                "Teacher dashboard data load nahi ho saka."
              );
            }
          } catch (err: any) {
            console.log(
              "TEACHER DASHBOARD ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response?.data
                ?.message ??
                err?.message ??
                "Something went wrong."
            );
          } finally {
            setLoading(false);
            setRefreshing(
              false
            );
          }
        },
        []
      );

    useEffect(() => {
      fetchDashboard();
    }, [fetchDashboard]);

    /* =================================================
       DERIVED DATA
    ================================================= */

    const teacherName =
      teacher?.name ??
      "Teacher";

    const firstName =
      teacherName
        .trim()
        .split(" ")[0] ||
      "Teacher";

    /* =================================================
       UNIQUE SUBJECTS
    ================================================= */

    const uniqueSubjects =
      useMemo(() => {
        const map =
          new Map<
            string,
            string
          >();

        assignments.forEach(
          (item) => {
            const subject =
              item.subjectId ??
              item.subject;

            const name =
              getName(subject);

            let id = name;

            if (
              typeof subject ===
              "object" &&
              subject
            ) {
              id =
                subject._id ??
                subject.id ??
                name;
            }

            if (
              name &&
              !map.has(id)
            ) {
              map.set(
                id,
                name
              );
            }
          }
        );

        return Array.from(
          map.values()
        );
      }, [assignments]);

    /* =================================================
       UNIQUE CLASSES
    ================================================= */

    const uniqueClasses =
      useMemo(() => {
        const classes =
          new Set<string>();

        assignments.forEach(
          (item) => {
            const className =
              getName(
                item.classId ??
                  item.class
              );

            const sectionName =
              getName(
                item.sectionId ??
                  item.section
              );

            if (className) {
              classes.add(
                sectionName
                  ? `${className} - ${sectionName}`
                  : className
              );
            }
          }
        );

        return Array.from(
          classes
        );
      }, [assignments]);

    /* =================================================
       WEEKLY PERIODS
    ================================================= */

    const weeklyPeriods =
      useMemo(() => {
        return assignments.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.weeklyPeriods ??
                0
            ),
          0
        );
      }, [assignments]);

    /* =================================================
       TODAY'S CLASSES
    ================================================= */

    const todayClasses =
      useMemo(() => {
        const today =
          getTodayName();

        return timetable
          .filter(
            (item) =>
              !item.day ||
              item.day.toUpperCase() ===
                today
          )
          .sort((a, b) =>
            (
              a.startTime ?? ""
            ).localeCompare(
              b.startTime ??
                ""
            )
          );
      }, [timetable]);

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="mb-5 h-20 w-20 items-center justify-center rounded-[24px] bg-[#4355D8]">

            <Ionicons
              name="school"
              size={36}
              color="#FFFFFF"
            />

          </View>

          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-4 text-sm font-semibold text-[#606F88]">
            Loading teacher
            dashboard...
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
        className="flex-1 bg-[#4355D8]"
      >

        <View className="flex-1 bg-[#F7F7FB]">

          {/* ==========================================
              HEADER
          ========================================== */}

          <View className="rounded-b-[35px] bg-[#4355D8] px-5 pb-16 pt-6">

            <View className="flex-row items-center justify-between">

              <View className="flex-1">

                <Text className="text-sm font-medium text-white/80">
                  Good day 👋
                </Text>

                <Text className="mt-1 text-3xl font-extrabold text-white">
                  {firstName}
                </Text>

                <Text className="mt-1 text-xs text-white/70">
                  Here's your teaching
                  schedule for today.
                </Text>

              </View>

              <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color="#FFFFFF"
                />

                <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FFCF55]" />

              </Pressable>

            </View>

          </View>

          {/* ==========================================
              CONTENT
          ========================================== */}

          <ScrollView
            className="-mt-8"
            showsVerticalScrollIndicator={
              false
            }
            contentContainerClassName="px-5 pb-10"
            refreshControl={
              <RefreshControl
                refreshing={
                  refreshing
                }
                onRefresh={() =>
                  fetchDashboard(
                    true
                  )
                }
                tintColor="#4355D8"
              />
            }
          >

            {/* ERROR */}

            {error ? (
              <View className="mb-4 flex-row items-center rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC4C5A"
                />

                <Text className="ml-2 flex-1 text-xs font-medium text-[#DC4C5A]">
                  {error}
                </Text>

              </View>
            ) : null}

            {/* ========================================
                TEACHER PROFILE CARD
            ======================================== */}

            <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

              <View className="flex-row items-center">

                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                  <Text className="text-xl font-extrabold text-[#4355D8]">
                    {teacherName
                      .charAt(0)
                      .toUpperCase()}
                  </Text>

                </View>

                <View className="ml-4 flex-1">

                  <Text className="text-lg font-extrabold text-[#15213B]">
                    {teacherName}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    {teacher
                      ?.qualification ??
                      "Teacher"}
                  </Text>

                </View>

                <View className="rounded-xl bg-[#E7F7F1] px-3 py-2">

                  <Text className="text-[9px] font-bold text-[#606F88]">
                    EMPLOYEE ID
                  </Text>

                  <Text className="mt-0.5 text-[11px] font-extrabold text-[#2BAA7B]">
                    {teacher
                      ?.employeeId ??
                      "-"}
                  </Text>

                </View>

              </View>

            </View>

            {/* ========================================
                TODAY AT A GLANCE
            ======================================== */}

            <View className="mt-6">

              <Text className="mb-3 text-lg font-extrabold text-[#15213B]">
                Today at a glance
              </Text>

              <View className="flex-row flex-wrap justify-between gap-y-3">

                {/* TODAY CLASSES */}

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Timetable"
                    )
                  }
                  className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
                >

                  <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#4355D8"
                    />

                  </View>

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    TODAY'S CLASSES
                  </Text>

                  <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
                    {
                      todayClasses.length
                    }
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Scheduled periods
                  </Text>

                </Pressable>

                {/* SUBJECTS */}

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Subjects"
                    )
                  }
                  className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
                >

                  <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E7F7F1]">

                    <Ionicons
                      name="book-outline"
                      size={20}
                      color="#2BAA7B"
                    />

                  </View>

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    SUBJECTS
                  </Text>

                  <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
                    {
                      uniqueSubjects.length
                    }
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Assigned subjects
                  </Text>

                </Pressable>

                {/* CLASSES */}

                <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

                  <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2DE]">

                    <Ionicons
                      name="people-outline"
                      size={20}
                      color="#E59A2F"
                    />

                  </View>

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    MY CLASSES
                  </Text>

                  <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
                    {
                      uniqueClasses.length
                    }
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Class & sections
                  </Text>

                </View>

                {/* WEEKLY PERIODS */}

                <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

                  <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#F5ECFF]">

                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="#8B5CF6"
                    />

                  </View>

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    WEEKLY PERIODS
                  </Text>

                  <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
                    {weeklyPeriods}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Assigned periods
                  </Text>

                </View>

              </View>

            </View>

            {/* ========================================
                QUICK ACCESS
            ======================================== */}

            <View className="mt-6">

              <Text className="mb-3 text-lg font-extrabold text-[#15213B]">
                Quick access
              </Text>

              <View className="flex-row gap-3">

                {/* TIMETABLE */}

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Timetable"
                    )
                  }
                  className="flex-1 items-center rounded-2xl bg-[#EEF0FF] p-4"
                >

                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color="#4355D8"
                    />

                  </View>

                  <Text className="mt-2 text-center text-xs font-bold text-[#15213B]">
                    Timetable
                  </Text>

                </Pressable>

                {/* SUBJECTS */}

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Subjects"
                    )
                  }
                  className="flex-1 items-center rounded-2xl bg-[#E7F7F1] p-4"
                >

                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                    <Ionicons
                      name="book-outline"
                      size={23}
                      color="#2BAA7B"
                    />

                  </View>

                  <Text className="mt-2 text-center text-xs font-bold text-[#15213B]">
                    Subjects
                  </Text>

                </Pressable>

                {/* SALARY */}

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Salary"
                    )
                  }
                  className="flex-1 items-center rounded-2xl bg-[#FFF2DE] p-4"
                >

                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                    <Ionicons
                      name="wallet-outline"
                      size={23}
                      color="#E59A2F"
                    />

                  </View>

                  <Text className="mt-2 text-center text-xs font-bold text-[#15213B]">
                    Salary
                  </Text>

                </Pressable>

              </View>

            </View>

            {/* ========================================
                TODAY'S CLASSES
            ======================================== */}

            <View className="mt-6">

              <View className="mb-3 flex-row items-center justify-between">

                <Text className="text-lg font-extrabold text-[#15213B]">
                  Today's classes
                </Text>

                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      "Timetable"
                    )
                  }
                >
                  <Text className="text-xs font-bold text-[#4355D8]">
                    View timetable
                  </Text>
                </Pressable>

              </View>

              {todayClasses.length >
              0 ? (
                todayClasses
                  .slice(0, 4)
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <View
                        key={
                          item._id ??
                          item.id ??
                          String(
                            index
                          )
                        }
                        className="mb-3 rounded-2xl border border-[#E5E8F0] bg-white p-4"
                      >

                        <View className="flex-row items-start">

                          {/* TIME */}

                          <View className="w-[72px]">

                            <Text className="text-xs font-extrabold text-[#4355D8]">
                              {item.startTime ??
                                "--:--"}
                            </Text>

                            <Text className="mt-1 text-[10px] text-[#606F88]">
                              {item.endTime ??
                                ""}
                            </Text>

                          </View>

                          {/* INDICATOR */}

                          <View className="mr-4 items-center">

                            <View className="h-3 w-3 rounded-full bg-[#2BAA7B]" />

                            <View className="mt-1 h-14 w-px bg-[#E5E8F0]" />

                          </View>

                          {/* INFO */}

                          <View className="flex-1">

                            <View className="self-start rounded-md bg-[#EEF0FF] px-2 py-1">

                              <Text className="text-[8px] font-extrabold text-[#4355D8]">
                                PERIOD{" "}
                                {item.periodNumber ??
                                  item.period ??
                                  index +
                                    1}
                              </Text>

                            </View>

                            <Text className="mt-2 text-base font-extrabold text-[#15213B]">
                              {getName(
                                item.subjectId ??
                                  item.subject
                              ) ||
                                "Subject"}
                            </Text>

                            <Text className="mt-1 text-xs text-[#606F88]">
                              {getName(
                                item.classId ??
                                  item.class
                              ) ||
                                "Class"}

                              {getName(
                                item.sectionId ??
                                  item.section
                              )
                                ? ` • Section ${getName(
                                    item.sectionId ??
                                      item.section
                                  )}`
                                : ""}
                            </Text>

                            {item.room ? (
                              <View className="mt-2 flex-row items-center">

                                <Ionicons
                                  name="location-outline"
                                  size={12}
                                  color="#606F88"
                                />

                                <Text className="ml-1 text-[10px] text-[#606F88]">
                                  Room{" "}
                                  {
                                    item.room
                                  }
                                </Text>

                              </View>
                            ) : null}

                          </View>

                        </View>

                      </View>
                    )
                  )
              ) : (
                <View className="items-center rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-7">

                  <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                    <Ionicons
                      name="calendar-clear-outline"
                      size={27}
                      color="#4355D8"
                    />

                  </View>

                  <Text className="mt-3 text-sm font-extrabold text-[#15213B]">
                    No classes today
                  </Text>

                  <Text className="mt-1 text-center text-xs text-[#606F88]">
                    Your schedule is
                    clear for today.
                  </Text>

                </View>
              )}

            </View>

            {/* ========================================
                TEACHING SUMMARY
            ======================================== */}

            <View className="mt-6">

              <Text className="mb-3 text-lg font-extrabold text-[#15213B]">
                Teaching summary
              </Text>

              <View className="rounded-3xl bg-[#15213B] p-5">

                <View className="flex-row justify-between">

                  <View>

                    <Text className="text-xs font-medium text-white/60">
                      My subjects
                    </Text>

                    <Text className="mt-1 text-2xl font-extrabold text-white">
                      {
                        uniqueSubjects.length
                      }
                    </Text>

                  </View>

                  <View>

                    <Text className="text-xs font-medium text-white/60">
                      Classes
                    </Text>

                    <Text className="mt-1 text-2xl font-extrabold text-white">
                      {
                        uniqueClasses.length
                      }
                    </Text>

                  </View>

                  <View>

                    <Text className="text-xs font-medium text-white/60">
                      Periods/week
                    </Text>

                    <Text className="mt-1 text-2xl font-extrabold text-white">
                      {weeklyPeriods}
                    </Text>

                  </View>

                </View>

              </View>

            </View>

          </ScrollView>

        </View>

      </SafeAreaView>
    );
  };

export default TeacherDashboardScreen;