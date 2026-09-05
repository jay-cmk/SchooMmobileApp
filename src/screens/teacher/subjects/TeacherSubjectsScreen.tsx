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
    "Subjects"
  >;

/* =====================================================
   TYPES
===================================================== */

interface RelationItem {
  _id?: string;
  id?: string;

  name?: string;
  code?: string;

  sessionName?: string;

  isCurrent?: boolean;
}

interface SubjectAssignment {
  _id?: string;
  id?: string;

  sessionId?:
    | string
    | RelationItem;

  academicSessionId?:
    | string
    | RelationItem;

  classId?:
    | string
    | RelationItem;

  class?:
    | string
    | RelationItem;

  sectionId?:
    | string
    | RelationItem;

  section?:
    | string
    | RelationItem;

  subjectId?:
    | string
    | RelationItem;

  subject?:
    | string
    | RelationItem;

  teacherId?:
    | string
    | RelationItem;

  weeklyPeriods?: number;

  status?: string;

  isActive?: boolean;
}

interface SubjectGroup {
  key: string;

  subjectId: string;

  subjectName: string;

  subjectCode: string;

  totalWeeklyPeriods: number;

  assignments: SubjectAssignment[];
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

const getId = (
  value: unknown
): string => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    typeof value ===
    "object"
  ) {
    const item =
      value as RelationItem;

    return (
      item._id ??
      item.id ??
      ""
    );
  }

  return "";
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
    item.sessionName ??
    ""
  );
};

const getCode = (
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
    item.code ??
    ""
  );
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherSubjectsScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    const [
      assignments,
      setAssignments,
    ] = useState<
      SubjectAssignment[]
    >([]);

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

    const fetchSubjects =
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
                "/academic/subject-assignments/teacher/me"
              );

            const data =
              getApiData(
                response
              );

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

            setAssignments(
              list
            );
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER SUBJECTS ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Assigned subjects load nahi ho sake."
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
      fetchSubjects();
    }, [
      fetchSubjects,
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

          await fetchSubjects(
            false
          );
        } finally {
          setRefreshing(
            false
          );
        }
      };

    /* =================================================
       GROUP BY SUBJECT
    ================================================= */

    const subjectGroups =
      useMemo<
        SubjectGroup[]
      >(() => {
        const map =
          new Map<
            string,
            SubjectGroup
          >();

        assignments.forEach(
          (assignment) => {
            const subjectValue =
              assignment.subjectId ??
              assignment.subject;

            const subjectId =
              getId(
                subjectValue
              );

            const subjectName =
              getName(
                subjectValue
              ) ||
              "Subject";

            const subjectCode =
              getCode(
                subjectValue
              );

            const key =
              subjectId ||
              subjectName;

            const existing =
              map.get(
                key
              );

            if (existing) {
              existing.assignments.push(
                assignment
              );

              existing.totalWeeklyPeriods +=
                Number(
                  assignment.weeklyPeriods ??
                    0
                );

              return;
            }

            map.set(
              key,
              {
                key,

                subjectId,

                subjectName,

                subjectCode,

                totalWeeklyPeriods:
                  Number(
                    assignment.weeklyPeriods ??
                      0
                  ),

                assignments: [
                  assignment,
                ],
              }
            );
          }
        );

        return Array.from(
          map.values()
        ).sort(
          (a, b) =>
            a.subjectName.localeCompare(
              b.subjectName
            )
        );
      }, [
        assignments,
      ]);

    /* =================================================
       STATS
    ================================================= */

    const stats =
      useMemo(() => {
        const classSet =
          new Set<string>();

        const sectionSet =
          new Set<string>();

        let weeklyPeriods =
          0;

        assignments.forEach(
          (assignment) => {
            const classValue =
              assignment.classId ??
              assignment.class;

            const sectionValue =
              assignment.sectionId ??
              assignment.section;

            const classId =
              getId(
                classValue
              );

            const sectionId =
              getId(
                sectionValue
              );

            if (classId) {
              classSet.add(
                classId
              );
            }

            if (
              classId &&
              sectionId
            ) {
              sectionSet.add(
                `${classId}-${sectionId}`
              );
            }

            weeklyPeriods +=
              Number(
                assignment.weeklyPeriods ??
                  0
              );
          }
        );

        return {
          subjects:
            subjectGroups.length,

          classes:
            classSet.size,

          sections:
            sectionSet.size,

          weeklyPeriods,
        };
      }, [
        assignments,
        subjectGroups,
      ]);

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="book-outline"
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
            Loading subjects...
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
                My Subjects
              </Text>

              <Text className="mt-1 text-xs text-white/70">
                Assigned subjects and classes
              </Text>

            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

              <Ionicons
                name="library-outline"
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
              STATS
          ========================================== */}

          <View className="px-5 pt-5">

            <View className="flex-row gap-2">

              <View className="flex-1 rounded-2xl bg-[#EEF0FF] p-3">

                <Text className="text-[9px] font-extrabold text-[#4355D8]">
                  SUBJECTS
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#4355D8]">
                  {
                    stats.subjects
                  }
                </Text>

              </View>

              <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">

                <Text className="text-[9px] font-extrabold text-[#2BAA7B]">
                  CLASSES
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#2BAA7B]">
                  {
                    stats.classes
                  }
                </Text>

              </View>

              <View className="flex-1 rounded-2xl bg-[#FFF2DE] p-3">

                <Text className="text-[9px] font-extrabold text-[#E59A2F]">
                  PERIODS
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-[#E59A2F]">
                  {
                    stats.weeklyPeriods
                  }
                </Text>

              </View>

            </View>

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
                    fetchSubjects()
                  }
                  className="mt-3 self-start rounded-xl bg-[#DC4C5A] px-4 py-2.5"
                >

                  <Text className="text-xs font-bold text-white">
                    Retry
                  </Text>

                </Pressable>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              TITLE
          ========================================== */}

          <View className="px-5 pb-3 pt-6">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Assigned Subjects
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {
                subjectGroups.length
              }{" "}
              unique subject
              {subjectGroups.length ===
              1
                ? ""
                : "s"}
            </Text>

          </View>

          {/* ==========================================
              SUBJECT LIST
          ========================================== */}

          {subjectGroups.length >
          0 ? (
            <View className="px-5">

              {subjectGroups.map(
                (
                  group,
                  index
                ) => {
                  return (
                    <View
                      key={
                        group.key ||
                        `subject-${index}`
                      }
                      className="mb-4 overflow-hidden rounded-3xl border border-[#E5E8F0] bg-white"
                    >

                      {/* SUBJECT HEADER */}

                      <View className="flex-row items-center p-5">

                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                          <Ionicons
                            name="book-outline"
                            size={25}
                            color="#4355D8"
                          />

                        </View>

                        <View className="ml-4 flex-1">

                          <Text className="text-base font-extrabold text-[#15213B]">
                            {
                              group.subjectName
                            }
                          </Text>

                          {group.subjectCode ? (
                            <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
                              Code:{" "}
                              {
                                group.subjectCode
                              }
                            </Text>
                          ) : null}

                        </View>

                        <View className="items-center rounded-2xl bg-[#FFF2DE] px-3 py-2">

                          <Text className="text-base font-extrabold text-[#E59A2F]">
                            {
                              group.totalWeeklyPeriods
                            }
                          </Text>

                          <Text className="text-[8px] font-bold text-[#E59A2F]">
                            PERIODS
                          </Text>

                        </View>

                      </View>

                      {/* DIVIDER */}

                      <View className="mx-5 h-px bg-[#EEF0F3]" />

                      {/* ASSIGNMENTS */}

                      <View className="p-5">

                        <Text className="mb-3 text-[10px] font-extrabold uppercase text-[#9AA4B5]">
                          Teaching In
                        </Text>

                        {group.assignments.map(
                          (
                            assignment,
                            assignmentIndex
                          ) => {
                            const classValue =
                              assignment.classId ??
                              assignment.class;

                            const sectionValue =
                              assignment.sectionId ??
                              assignment.section;

                            const sessionValue =
                              assignment.academicSessionId ??
                              assignment.sessionId;

                            const className =
                              getName(
                                classValue
                              ) ||
                              "Class";

                            const sectionName =
                              getName(
                                sectionValue
                              ) ||
                              "-";

                            const sessionName =
                              getName(
                                sessionValue
                              );

                            return (
                              <View
                                key={
                                  assignment._id ??
                                  assignment.id ??
                                  `${group.key}-${assignmentIndex}`
                                }
                                className={`flex-row items-center py-3 ${
                                  assignmentIndex <
                                  group.assignments
                                    .length -
                                    1
                                    ? "border-b border-[#EEF0F3]"
                                    : ""
                                }`}
                              >

                                <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#F7F7FB]">

                                  <Ionicons
                                    name="school-outline"
                                    size={18}
                                    color="#4355D8"
                                  />

                                </View>

                                <View className="ml-3 flex-1">

                                  <Text className="text-sm font-extrabold text-[#15213B]">
                                    {
                                      className
                                    }{" "}
                                    • Section{" "}
                                    {
                                      sectionName
                                    }
                                  </Text>

                                  {sessionName ? (
                                    <Text className="mt-1 text-[10px] text-[#606F88]">
                                      {
                                        sessionName
                                      }
                                    </Text>
                                  ) : null}

                                </View>

                                <View className="rounded-xl bg-[#E7F7F1] px-3 py-2">

                                  <Text className="text-xs font-extrabold text-[#2BAA7B]">
                                    {Number(
                                      assignment.weeklyPeriods ??
                                        0
                                    )}
                                  </Text>

                                  <Text className="text-[7px] font-bold text-[#2BAA7B]">
                                    / WEEK
                                  </Text>

                                </View>

                              </View>
                            );
                          }
                        )}

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
                  name="library-outline"
                  size={30}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No subjects assigned
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                Abhi aapko kisi class ya
                section ka subject assign
                nahi kiya gaya hai.
              </Text>

            </View>
          )}

          {/* ==========================================
              TIMETABLE BUTTON
          ========================================== */}

          {subjectGroups.length >
          0 ? (
            <View className="px-5 pt-2">

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Timetable"
                  )
                }
                className="flex-row items-center justify-center rounded-2xl bg-[#4355D8] py-4"
              >

                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#FFFFFF"
                />

                <Text className="ml-2 text-sm font-extrabold text-white">
                  View My Timetable
                </Text>

              </Pressable>

            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };

export default TeacherSubjectsScreen;