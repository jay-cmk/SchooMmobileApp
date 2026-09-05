import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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
    "CreateHomework"
  >;

/* =====================================================
   TYPES
===================================================== */

type HomeworkStatus =
  | "DRAFT"
  | "PUBLISHED";

interface RelationItem {
  _id?: string;
  id?: string;

  name?: string;
  title?: string;
  code?: string;

  sessionName?: string;
}

interface TeacherProfile {
  _id?: string;
  id?: string;

  name?: string;

  firstName?: string;
  lastName?: string;
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

  teacher?:
    | string
    | RelationItem;

  isActive?: boolean;
}

interface AssignmentOption {
  key: string;

  sessionId: string;
  classId: string;
  sectionId: string;
  subjectId: string;

  sessionName: string;
  className: string;
  sectionName: string;
  subjectName: string;
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

/* =====================================================
   RELATION ID
===================================================== */

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

/* =====================================================
   RELATION NAME
===================================================== */

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

  if (
    typeof value ===
    "object"
  ) {
    const item =
      value as RelationItem;

    return (
      item.name ??
      item.sessionName ??
      item.title ??
      item.code ??
      ""
    );
  }

  return "";
};

/* =====================================================
   TODAY YYYY-MM-DD
===================================================== */

const getToday = (): string => {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
};

/* =====================================================
   DATE VALIDATION
===================================================== */

const isValidDate = (
  value: string
): boolean => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  return !Number.isNaN(
    date.getTime()
  );
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherCreateHomeworkScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    /* =================================================
       API STATE
    ================================================= */

    const [
      assignments,
      setAssignments,
    ] = useState<
      SubjectAssignment[]
    >([]);

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
      submitting,
      setSubmitting,
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
       FORM STATE
    ================================================= */

    const [
      selectedAssignmentKey,
      setSelectedAssignmentKey,
    ] = useState("");

    const [
      title,
      setTitle,
    ] = useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [
      assignedDate,
      setAssignedDate,
    ] = useState(
      getToday()
    );

    const [
      dueDate,
      setDueDate,
    ] = useState("");

    const [
      status,
      setStatus,
    ] = useState<
      HomeworkStatus
    >("DRAFT");

    /* =================================================
       ASSIGNMENT OPTIONS
    ================================================= */

    const assignmentOptions =
      useMemo<
        AssignmentOption[]
      >(() => {
        const map =
          new Map<
            string,
            AssignmentOption
          >();

        assignments.forEach(
          (assignment) => {
            const sessionValue =
              assignment
                .academicSessionId ??
              assignment.sessionId;

            const classValue =
              assignment.classId ??
              assignment.class;

            const sectionValue =
              assignment.sectionId ??
              assignment.section;

            const subjectValue =
              assignment.subjectId ??
              assignment.subject;

            const sessionId =
              getId(
                sessionValue
              );

            const classId =
              getId(
                classValue
              );

            const sectionId =
              getId(
                sectionValue
              );

            const subjectId =
              getId(
                subjectValue
              );

            if (
              !sessionId ||
              !classId ||
              !sectionId ||
              !subjectId
            ) {
              return;
            }

            const key =
              `${sessionId}-${classId}-${sectionId}-${subjectId}`;

            if (
              map.has(key)
            ) {
              return;
            }

            map.set(
              key,
              {
                key,

                sessionId,
                classId,
                sectionId,
                subjectId,

                sessionName:
                  getName(
                    sessionValue
                  ) ||
                  "Session",

                className:
                  getName(
                    classValue
                  ) ||
                  "Class",

                sectionName:
                  getName(
                    sectionValue
                  ) ||
                  "Section",

                subjectName:
                  getName(
                    subjectValue
                  ) ||
                  "Subject",
              }
            );
          }
        );

        return Array.from(
          map.values()
        );
      }, [
        assignments,
      ]);

    /* =================================================
       SELECTED ASSIGNMENT
    ================================================= */

    const selectedAssignment =
      useMemo(() => {
        return (
          assignmentOptions.find(
            (item) =>
              item.key ===
              selectedAssignmentKey
          ) ?? null
        );
      }, [
        assignmentOptions,
        selectedAssignmentKey,
      ]);

    /* =================================================
       TEACHER ID
    ================================================= */

    const teacherId =
      useMemo(() => {
        return (
          teacher?._id ??
          teacher?.id ??
          ""
        );
      }, [
        teacher,
      ]);

    /* =================================================
       LOAD DATA
    ================================================= */

    const fetchData =
      useCallback(
        async () => {
          try {
            setLoading(
              true
            );

            setError(
              null
            );

            const [
              teacherResult,
              assignmentResult,
            ] =
              await Promise.allSettled(
                [
                  api.get(
                    "/teachers/me"
                  ),

                  api.get(
                    "/academic/subject-assignments/teacher/me"
                  ),
                ]
              );

            /* =========================================
               TEACHER
            ========================================= */

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
                profile ??
                  null
              );
            } else {
              throw (
                teacherResult.reason
              );
            }

            /* =========================================
               ASSIGNMENTS
            ========================================= */

            if (
              assignmentResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  assignmentResult.value
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
            } else {
              throw (
                assignmentResult.reason
              );
            }
          } catch (
            err: any
          ) {
            console.log(
              "CREATE HOMEWORK INITIAL ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Homework form data load nahi ho saka."
            );
          } finally {
            setLoading(
              false
            );
          }
        },
        []
      );

    /* =================================================
       INITIAL
    ================================================= */

    useEffect(() => {
      fetchData();
    }, [
      fetchData,
    ]);

    /* =================================================
       FIRST ASSIGNMENT
    ================================================= */

    useEffect(() => {
      if (
        !selectedAssignmentKey &&
        assignmentOptions.length >
          0
      ) {
        setSelectedAssignmentKey(
          assignmentOptions[0]
            .key
        );
      }
    }, [
      assignmentOptions,
      selectedAssignmentKey,
    ]);

    /* =================================================
       VALIDATE
    ================================================= */

    const validateForm =
      (): string | null => {
        if (
          !selectedAssignment
        ) {
          return "Class, section aur subject select karein.";
        }

        if (
          !teacherId
        ) {
          return "Teacher profile ID nahi mila.";
        }

        if (
          !title.trim()
        ) {
          return "Homework title required hai.";
        }

        if (
          !description.trim()
        ) {
          return "Homework description required hai.";
        }

        if (
          !isValidDate(
            assignedDate
          )
        ) {
          return "Assigned date YYYY-MM-DD format me dalein.";
        }

        if (
          !isValidDate(
            dueDate
          )
        ) {
          return "Due date YYYY-MM-DD format me dalein.";
        }

        const assigned =
          new Date(
            `${assignedDate}T00:00:00`
          );

        const due =
          new Date(
            `${dueDate}T00:00:00`
          );

        if (
          due <
          assigned
        ) {
          return "Due date assigned date se pehle nahi ho sakti.";
        }

        return null;
      };

    /* =================================================
       SUBMIT
    ================================================= */

    const handleSubmit =
      async () => {
        const validationError =
          validateForm();

        if (
          validationError
        ) {
          Alert.alert(
            "Check Form",
            validationError
          );

          return;
        }

        if (
          !selectedAssignment
        ) {
          return;
        }

        try {
          setSubmitting(
            true
          );

          setError(
            null
          );

          const payload = {
            sessionId:
              selectedAssignment
                .sessionId,

            classId:
              selectedAssignment
                .classId,

            sectionId:
              selectedAssignment
                .sectionId,

            subjectId:
              selectedAssignment
                .subjectId,

            teacherId,

            title:
              title.trim(),

            description:
              description.trim(),

            assignedDate,

            dueDate,

            status,
          };

          console.log(
            "CREATE HOMEWORK PAYLOAD:",
            payload
          );

          await api.post(
            "/homework",
            payload
          );

          Alert.alert(
            "Success",
            status ===
              "PUBLISHED"
              ? "Homework created and published successfully."
              : "Homework draft created successfully.",
            [
              {
                text:
                  "OK",

                onPress:
                  () =>
                    navigation.goBack(),
              },
            ]
          );
        } catch (
          err: any
        ) {
          console.log(
            "CREATE HOMEWORK ERROR:",
            err?.response
              ?.data ??
              err?.message
          );

          const message =
            err?.response?.data
              ?.message ??
            "Homework create nahi ho saka.";

          setError(
            message
          );

          Alert.alert(
            "Create Homework",
            message
          );
        } finally {
          setSubmitting(
            false
          );
        }
      };

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="create-outline"
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
            Preparing homework form...
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

        <KeyboardAvoidingView
          className="flex-1"
          behavior={
            Platform.OS ===
            "ios"
              ? "padding"
              : undefined
          }
        >

          {/* ============================================
              HEADER
          ============================================ */}

          <View className="flex-row items-center bg-[#4355D8] px-5 pb-6 pt-4">

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
                Create Homework
              </Text>

              <Text className="mt-1 text-xs text-white/70">
                Assign work to your students
              </Text>

            </View>

          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="pb-36"
          >

            {/* ==========================================
                ERROR
            ========================================== */}

            {error ? (
              <View className="px-5 pt-5">

                <View className="flex-row items-center rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#DC4C5A"
                  />

                  <Text className="ml-2 flex-1 text-xs font-semibold text-[#DC4C5A]">
                    {error}
                  </Text>

                </View>

              </View>
            ) : null}

            {/* ==========================================
                ASSIGNMENT
            ========================================== */}

            <View className="px-5 pt-6">

              <Text className="text-base font-extrabold text-[#15213B]">
                Class & Subject
              </Text>

              <Text className="mt-1 text-xs text-[#606F88]">
                Sirf aapko assigned subjects yahan dikh rahe hain.
              </Text>

              {assignmentOptions.length >
              0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  className="mt-4"
                >

                  {assignmentOptions.map(
                    (
                      item
                    ) => {
                      const active =
                        item.key ===
                        selectedAssignmentKey;

                      return (
                        <Pressable
                          key={
                            item.key
                          }
                          onPress={() =>
                            setSelectedAssignmentKey(
                              item.key
                            )
                          }
                          className={`mr-3 w-[210px] rounded-3xl border p-4 ${
                            active
                              ? "border-[#4355D8] bg-[#4355D8]"
                              : "border-[#E5E8F0] bg-white"
                          }`}
                        >

                          <View className="flex-row items-center">

                            <View
                              className={`h-10 w-10 items-center justify-center rounded-xl ${
                                active
                                  ? "bg-white/15"
                                  : "bg-[#EEF0FF]"
                              }`}
                            >

                              <Ionicons
                                name="book-outline"
                                size={20}
                                color={
                                  active
                                    ? "#FFFFFF"
                                    : "#4355D8"
                                }
                              />

                            </View>

                            <View className="ml-3 flex-1">

                              <Text
                                numberOfLines={
                                  1
                                }
                                className={`text-sm font-extrabold ${
                                  active
                                    ? "text-white"
                                    : "text-[#15213B]"
                                }`}
                              >
                                {
                                  item.subjectName
                                }
                              </Text>

                              <Text
                                numberOfLines={
                                  1
                                }
                                className={`mt-1 text-[10px] ${
                                  active
                                    ? "text-white/70"
                                    : "text-[#606F88]"
                                }`}
                              >
                                {
                                  item.sessionName
                                }
                              </Text>

                            </View>

                          </View>

                          <View
                            className={`mt-4 rounded-2xl p-3 ${
                              active
                                ? "bg-white/10"
                                : "bg-[#F7F7FB]"
                            }`}
                          >

                            <Text
                              className={`text-xs font-bold ${
                                active
                                  ? "text-white"
                                  : "text-[#15213B]"
                              }`}
                            >
                              {
                                item.className
                              }{" "}
                              • Section{" "}
                              {
                                item.sectionName
                              }
                            </Text>

                          </View>

                        </Pressable>
                      );
                    }
                  )}

                </ScrollView>
              ) : (
                <View className="mt-4 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white p-8">

                  <Ionicons
                    name="albums-outline"
                    size={32}
                    color="#9AA4B5"
                  />

                  <Text className="mt-3 text-sm font-extrabold text-[#15213B]">
                    No subject assignment
                  </Text>

                  <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                    Aapko abhi koi class,
                    section aur subject
                    assign nahi hua hai.
                  </Text>

                </View>
              )}

            </View>

            {/* ==========================================
                TITLE
            ========================================== */}

            <View className="px-5 pt-6">

              <Text className="text-sm font-extrabold text-[#15213B]">
                Homework Title
              </Text>

              <TextInput
                value={
                  title
                }
                onChangeText={
                  setTitle
                }
                placeholder="Example: Algebra Exercise 5"
                placeholderTextColor="#9AA4B5"
                maxLength={
                  150
                }
                className="mt-3 rounded-2xl border border-[#E5E8F0] bg-white px-4 py-4 text-sm text-[#15213B]"
              />

              <Text className="mt-1 text-right text-[9px] text-[#9AA4B5]">
                {title.length}/150
              </Text>

            </View>

            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            <View className="px-5 pt-5">

              <Text className="text-sm font-extrabold text-[#15213B]">
                Description
              </Text>

              <TextInput
                value={
                  description
                }
                onChangeText={
                  setDescription
                }
                placeholder="Homework instructions likhein..."
                placeholderTextColor="#9AA4B5"
                multiline
                textAlignVertical="top"
                className="mt-3 min-h-[140px] rounded-2xl border border-[#E5E8F0] bg-white px-4 py-4 text-sm leading-5 text-[#15213B]"
              />

            </View>

            {/* ==========================================
                DATES
            ========================================== */}

            <View className="px-5 pt-5">

              <Text className="text-sm font-extrabold text-[#15213B]">
                Dates
              </Text>

              <View className="mt-3 flex-row gap-3">

                {/* ASSIGNED */}

                <View className="flex-1">

                  <Text className="mb-2 text-[10px] font-bold text-[#606F88]">
                    Assigned Date
                  </Text>

                  <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-3">

                    <Ionicons
                      name="calendar-outline"
                      size={17}
                      color="#4355D8"
                    />

                    <TextInput
                      value={
                        assignedDate
                      }
                      onChangeText={
                        setAssignedDate
                      }
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9AA4B5"
                      maxLength={
                        10
                      }
                      className="ml-2 flex-1 py-4 text-xs text-[#15213B]"
                    />

                  </View>

                </View>

                {/* DUE */}

                <View className="flex-1">

                  <Text className="mb-2 text-[10px] font-bold text-[#606F88]">
                    Due Date
                  </Text>

                  <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-3">

                    <Ionicons
                      name="time-outline"
                      size={17}
                      color="#E59A2F"
                    />

                    <TextInput
                      value={
                        dueDate
                      }
                      onChangeText={
                        setDueDate
                      }
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9AA4B5"
                      maxLength={
                        10
                      }
                      className="ml-2 flex-1 py-4 text-xs text-[#15213B]"
                    />

                  </View>

                </View>

              </View>

            </View>

            {/* ==========================================
                STATUS
            ========================================== */}

            <View className="px-5 pt-6">

              <Text className="text-sm font-extrabold text-[#15213B]">
                Homework Status
              </Text>

              <Text className="mt-1 text-xs text-[#606F88]">
                Draft ko students nahi dekhte. Publish karne par student app me available hoga.
              </Text>

              <View className="mt-4 flex-row gap-3">

                {/* DRAFT */}

                <Pressable
                  onPress={() =>
                    setStatus(
                      "DRAFT"
                    )
                  }
                  className={`flex-1 rounded-2xl border p-4 ${
                    status ===
                    "DRAFT"
                      ? "border-[#E59A2F] bg-[#FFF2DE]"
                      : "border-[#E5E8F0] bg-white"
                  }`}
                >

                  <View className="flex-row items-center">

                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">

                      <Ionicons
                        name="document-outline"
                        size={18}
                        color="#E59A2F"
                      />

                    </View>

                    <View className="ml-3">

                      <Text className="text-sm font-extrabold text-[#15213B]">
                        Draft
                      </Text>

                      <Text className="mt-1 text-[9px] text-[#606F88]">
                        Save only
                      </Text>

                    </View>

                  </View>

                </Pressable>

                {/* PUBLISHED */}

                <Pressable
                  onPress={() =>
                    setStatus(
                      "PUBLISHED"
                    )
                  }
                  className={`flex-1 rounded-2xl border p-4 ${
                    status ===
                    "PUBLISHED"
                      ? "border-[#2BAA7B] bg-[#E7F7F1]"
                      : "border-[#E5E8F0] bg-white"
                  }`}
                >

                  <View className="flex-row items-center">

                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">

                      <Ionicons
                        name="send-outline"
                        size={18}
                        color="#2BAA7B"
                      />

                    </View>

                    <View className="ml-3">

                      <Text className="text-sm font-extrabold text-[#15213B]">
                        Publish
                      </Text>

                      <Text className="mt-1 text-[9px] text-[#606F88]">
                        Send to students
                      </Text>

                    </View>

                  </View>

                </Pressable>

              </View>

            </View>

            {/* ==========================================
                SUMMARY
            ========================================== */}

            {selectedAssignment ? (
              <View className="px-5 pt-6">

                <View className="rounded-3xl bg-[#EEF0FF] p-5">

                  <View className="flex-row items-center">

                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#4355D8"
                    />

                    <Text className="ml-2 text-sm font-extrabold text-[#4355D8]">
                      Assignment Summary
                    </Text>

                  </View>

                  <View className="mt-4">

                    <Text className="text-xs font-bold text-[#15213B]">
                      {
                        selectedAssignment.subjectName
                      }
                    </Text>

                    <Text className="mt-1 text-[11px] text-[#606F88]">
                      {
                        selectedAssignment.className
                      }{" "}
                      • Section{" "}
                      {
                        selectedAssignment.sectionName
                      }
                    </Text>

                    <Text className="mt-1 text-[11px] text-[#606F88]">
                      {
                        selectedAssignment.sessionName
                      }
                    </Text>

                  </View>

                </View>

              </View>
            ) : null}

          </ScrollView>

          {/* ============================================
              FOOTER
          ============================================ */}

          <View className="absolute bottom-0 left-0 right-0 border-t border-[#E5E8F0] bg-white px-5 pb-5 pt-3">

            <View className="flex-row gap-3">

              <Pressable
                disabled={
                  submitting
                }
                onPress={() =>
                  navigation.goBack()
                }
                className="flex-1 items-center justify-center rounded-2xl border border-[#D8DDEA] bg-white py-4"
              >

                <Text className="text-sm font-extrabold text-[#606F88]">
                  Cancel
                </Text>

              </Pressable>

              <Pressable
                disabled={
                  submitting ||
                  assignmentOptions.length ===
                    0
                }
                onPress={
                  handleSubmit
                }
                className={`flex-[1.7] flex-row items-center justify-center rounded-2xl py-4 ${
                  submitting ||
                  assignmentOptions.length ===
                    0
                    ? "bg-[#9BA4E8]"
                    : "bg-[#4355D8]"
                }`}
              >

                {submitting ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Ionicons
                    name={
                      status ===
                      "PUBLISHED"
                        ? "send-outline"
                        : "save-outline"
                    }
                    size={19}
                    color="#FFFFFF"
                  />
                )}

                <Text className="ml-2 text-sm font-extrabold text-white">
                  {submitting
                    ? "Saving..."
                    : status ===
                        "PUBLISHED"
                      ? "Create & Publish"
                      : "Save Draft"}
                </Text>

              </Pressable>

            </View>

          </View>

        </KeyboardAvoidingView>

      </SafeAreaView>
    );
  };

export default TeacherCreateHomeworkScreen;