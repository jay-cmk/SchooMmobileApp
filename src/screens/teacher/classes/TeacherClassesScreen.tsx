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

  academicSessionId?: string | PopulatedItem;

  weeklyPeriods?: number;

  isActive?: boolean;
}

interface ClassGroup {
  key: string;

  className: string;
  sectionName: string;

  subjects: string[];

  weeklyPeriods: number;

  assignments: SubjectAssignment[];
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

  if (typeof value === "object") {
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

const getId = (
  value: unknown
): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const item =
      value as PopulatedItem;

    return (
      item._id ??
      item.id ??
      ""
    );
  }

  return "";
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherClassesScreen = () => {
  const navigation =
    useNavigation<NavigationProp>();

  /* ===================================================
     STATE
  =================================================== */

  const [
    assignments,
    setAssignments,
  ] = useState<
    SubjectAssignment[]
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
  ] = useState<string | null>(
    null
  );

  /* ===================================================
     FETCH
  =================================================== */

  const fetchClasses =
    useCallback(
      async (
        refresh = false
      ) => {
        try {
          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await api.get(
              "/academic/subject-assignments/teacher/me"
            );

          const data =
            getApiData(response);

          const list =
            extractArray(
              data,
              [
                "assignments",
                "subjectAssignments",
                "subjects",
                "data",
              ]
            );

          setAssignments(list);
        } catch (err: any) {
          console.log(
            "TEACHER CLASSES ERROR:",
            err?.response?.data ??
              err?.message
          );

          setError(
            err?.response?.data
              ?.message ??
              err?.message ??
              "Classes load nahi ho saki."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  /* ===================================================
     GROUP CLASSES
  =================================================== */

  const groupedClasses =
    useMemo<ClassGroup[]>(
      () => {
        const map =
          new Map<
            string,
            ClassGroup
          >();

        assignments.forEach(
          (assignment) => {
            const classValue =
              assignment.classId ??
              assignment.class;

            const sectionValue =
              assignment.sectionId ??
              assignment.section;

            const subjectValue =
              assignment.subjectId ??
              assignment.subject;

            const classId =
              getId(classValue);

            const sectionId =
              getId(sectionValue);

            const className =
              getName(classValue) ||
              "Class";

            const sectionName =
              getName(
                sectionValue
              ) || "-";

            const subjectName =
              getName(
                subjectValue
              );

            const key =
              `${classId || className}-${sectionId || sectionName}`;

            const existing =
              map.get(key);

            if (existing) {
              if (
                subjectName &&
                !existing.subjects.includes(
                  subjectName
                )
              ) {
                existing.subjects.push(
                  subjectName
                );
              }

              existing.weeklyPeriods +=
                Number(
                  assignment.weeklyPeriods ??
                    0
                );

              existing.assignments.push(
                assignment
              );

              return;
            }

            map.set(key, {
              key,

              className,
              sectionName,

              subjects:
                subjectName
                  ? [subjectName]
                  : [],

              weeklyPeriods:
                Number(
                  assignment.weeklyPeriods ??
                    0
                ),

              assignments: [
                assignment,
              ],
            });
          }
        );

        return Array.from(
          map.values()
        );
      },
      [assignments]
    );

  /* ===================================================
     SUMMARY
  =================================================== */

  const totalSubjects =
    useMemo(() => {
      const subjects =
        new Set<string>();

      assignments.forEach(
        (assignment) => {
          const name =
            getName(
              assignment.subjectId ??
                assignment.subject
            );

          if (name) {
            subjects.add(name);
          }
        }
      );

      return subjects.size;
    }, [assignments]);

  const totalWeeklyPeriods =
    useMemo(() => {
      return assignments.reduce(
        (
          total,
          assignment
        ) =>
          total +
          Number(
            assignment.weeklyPeriods ??
              0
          ),
        0
      );
    }, [assignments]);

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <ActivityIndicator
          size="large"
          color="#4355D8"
        />

        <Text className="mt-4 text-sm font-semibold text-[#606F88]">
          Loading classes...
        </Text>
      </SafeAreaView>
    );
  }

  /* ===================================================
     UI
  =================================================== */

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

      <View className="bg-[#4355D8] px-5 pb-7 pt-5">

        <View className="flex-row items-center justify-between">

          <View>
            <Text className="text-2xl font-extrabold text-white">
              My Classes
            </Text>

            <Text className="mt-1 text-xs text-white/70">
              Your assigned classes
              and subjects
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate(
                "Subjects"
              )
            }
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
          >
            <Ionicons
              name="book-outline"
              size={22}
              color="#FFFFFF"
            />
          </Pressable>

        </View>

      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerClassName="px-5 pb-10 pt-5"
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() =>
              fetchClasses(true)
            }
            tintColor="#4355D8"
          />
        }
      >

        {/* ==========================================
            ERROR
        ========================================== */}

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

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <View className="flex-row gap-3">

          <View className="flex-1 rounded-2xl border border-[#E5E8F0] bg-white p-4">

            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF0FF]">
              <Ionicons
                name="people-outline"
                size={19}
                color="#4355D8"
              />
            </View>

            <Text className="mt-3 text-[10px] font-extrabold tracking-wider text-[#606F88]">
              CLASSES
            </Text>

            <Text className="mt-1 text-2xl font-extrabold text-[#15213B]">
              {groupedClasses.length}
            </Text>

          </View>

          <View className="flex-1 rounded-2xl border border-[#E5E8F0] bg-white p-4">

            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#E7F7F1]">
              <Ionicons
                name="book-outline"
                size={19}
                color="#2BAA7B"
              />
            </View>

            <Text className="mt-3 text-[10px] font-extrabold tracking-wider text-[#606F88]">
              SUBJECTS
            </Text>

            <Text className="mt-1 text-2xl font-extrabold text-[#15213B]">
              {totalSubjects}
            </Text>

          </View>

          <View className="flex-1 rounded-2xl border border-[#E5E8F0] bg-white p-4">

            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF2DE]">
              <Ionicons
                name="time-outline"
                size={19}
                color="#E59A2F"
              />
            </View>

            <Text className="mt-3 text-[10px] font-extrabold tracking-wider text-[#606F88]">
              PERIODS
            </Text>

            <Text className="mt-1 text-2xl font-extrabold text-[#15213B]">
              {totalWeeklyPeriods}
            </Text>

          </View>

        </View>

        {/* ==========================================
            TITLE
        ========================================== */}

        <View className="mb-3 mt-6 flex-row items-center justify-between">

          <Text className="text-lg font-extrabold text-[#15213B]">
            Assigned classes
          </Text>

          <Text className="text-xs font-bold text-[#606F88]">
            {groupedClasses.length}{" "}
            Total
          </Text>

        </View>

        {/* ==========================================
            CLASS LIST
        ========================================== */}

        {groupedClasses.length >
        0 ? (
          groupedClasses.map(
            (
              item,
              index
            ) => (
              <View
                key={item.key}
                className="mb-4 overflow-hidden rounded-3xl border border-[#E5E8F0] bg-white"
              >

                {/* TOP */}

                <View className="bg-[#EEF0FF] p-4">

                  <View className="flex-row items-center justify-between">

                    <View className="flex-row items-center">

                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#4355D8]">

                        <Text className="text-base font-extrabold text-white">
                          {index + 1}
                        </Text>

                      </View>

                      <View className="ml-3">

                        <Text className="text-lg font-extrabold text-[#15213B]">
                          {item.className}
                        </Text>

                        <Text className="mt-0.5 text-xs font-semibold text-[#606F88]">
                          Section{" "}
                          {
                            item.sectionName
                          }
                        </Text>

                      </View>

                    </View>

                    <View className="rounded-full bg-white px-3 py-1.5">

                      <Text className="text-[10px] font-extrabold text-[#4355D8]">
                        ACTIVE
                      </Text>

                    </View>

                  </View>

                </View>

                {/* BODY */}

                <View className="p-4">

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    SUBJECTS
                  </Text>

                  <View className="mt-3 flex-row flex-wrap">

                    {item.subjects.length >
                    0 ? (
                      item.subjects.map(
                        (
                          subject
                        ) => (
                          <View
                            key={
                              subject
                            }
                            className="mb-2 mr-2 rounded-lg bg-[#F4F5FA] px-3 py-2"
                          >
                            <Text className="text-xs font-bold text-[#15213B]">
                              {
                                subject
                              }
                            </Text>
                          </View>
                        )
                      )
                    ) : (
                      <Text className="text-xs text-[#606F88]">
                        No subject
                      </Text>
                    )}

                  </View>

                  <View className="mt-4 border-t border-[#EEF0F4] pt-4">

                    <View className="flex-row items-center justify-between">

                      <View className="flex-row items-center">

                        <Ionicons
                          name="time-outline"
                          size={17}
                          color="#606F88"
                        />

                        <Text className="ml-2 text-xs font-medium text-[#606F88]">
                          Weekly periods
                        </Text>

                      </View>

                      <Text className="text-sm font-extrabold text-[#15213B]">
                        {
                          item.weeklyPeriods
                        }
                      </Text>

                    </View>

                  </View>

                </View>

              </View>
            )
          )
        ) : (
          <View className="mt-3 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white px-6 py-10">

            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

              <Ionicons
                name="people-outline"
                size={30}
                color="#4355D8"
              />

            </View>

            <Text className="mt-4 text-base font-extrabold text-[#15213B]">
              No classes assigned
            </Text>

            <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
              Your assigned classes
              will appear here.
            </Text>

          </View>
        )}

        {/* ==========================================
            SUBJECTS BUTTON
        ========================================== */}

        <Pressable
          onPress={() =>
            navigation.navigate(
              "Subjects"
            )
          }
          className="mt-2 flex-row items-center justify-center rounded-2xl bg-[#4355D8] px-5 py-4"
        >

          <Ionicons
            name="book-outline"
            size={19}
            color="#FFFFFF"
          />

          <Text className="ml-2 text-sm font-extrabold text-white">
            View My Subjects
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
};

export default TeacherClassesScreen;