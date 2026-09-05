import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
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
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import {
  createSubjectAssignmentApi,
  getAcademicClassesApi,
  getAcademicSectionsApi,
  getAcademicSessionsApi,
  getAcademicSubjectsApi,
  getSchoolTeachersApi,
  getSubjectAssignmentsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
  AcademicSubject,
  SchoolAdminTeacher,
  SubjectAssignment,
} from "types/schoolAdmin.types";


/* =====================================================
   SELECT OPTION
===================================================== */

interface SelectOption {
  id: string;
  label: string;
  subtitle?: string;
}


/* =====================================================
   SELECT FIELD
===================================================== */

interface SelectFieldProps {
  label: string;

  placeholder: string;

  value: string;

  options: SelectOption[];

  disabled?: boolean;

  onSelect: (
    value: string
  ) => void;
}


const SelectField = ({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onSelect,
}: SelectFieldProps) => {
  const [
    visible,
    setVisible,
  ] = useState(false);


  const selected =
    options.find(
      (option) =>
        option.id === value
    );


  return (
    <>
      <View className="mb-4">

        <Text className="mb-2 text-xs font-extrabold tracking-wider text-[#606F88]">
          {label}
        </Text>

        <Pressable
          disabled={disabled}
          onPress={() =>
            setVisible(true)
          }
          className={
            disabled
              ? "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-[#F1F2F6] px-4 py-4"
              : "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4 py-4"
          }
        >

          <Text
            numberOfLines={1}
            className={
              selected
                ? "flex-1 text-sm font-bold text-[#15213B]"
                : "flex-1 text-sm text-[#9AA3B2]"
            }
          >
            {selected
              ?.label ??
              placeholder}
          </Text>

          <Ionicons
            name="chevron-down"
            size={18}
            color={
              disabled
                ? "#B5BBC5"
                : "#606F88"
            }
          />

        </Pressable>

      </View>


      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setVisible(false)
        }
      >

        <Pressable
          onPress={() =>
            setVisible(false)
          }
          className="flex-1 justify-end bg-black/40"
        >

          <Pressable
            onPress={(
              event
            ) =>
              event.stopPropagation()
            }
            className="max-h-[70%] rounded-t-[32px] bg-[#F7F7FB] px-5 pb-8 pt-5"
          >

            <View className="mb-5 flex-row items-center justify-between">

              <Text className="text-xl font-extrabold text-[#15213B]">
                Select {label}
              </Text>

              <Pressable
                onPress={() =>
                  setVisible(false)
                }
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white"
              >
                <Ionicons
                  name="close"
                  size={21}
                  color="#15213B"
                />
              </Pressable>

            </View>


            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >

              {options.length >
              0 ? (
                options.map(
                  (option) => {
                    const active =
                      option.id ===
                      value;

                    return (
                      <Pressable
                        key={
                          option.id
                        }
                        onPress={() => {
                          onSelect(
                            option.id
                          );

                          setVisible(
                            false
                          );
                        }}
                        className={
                          active
                            ? "mb-2 flex-row items-center rounded-2xl border border-[#4355D8] bg-[#EEF0FF] p-4"
                            : "mb-2 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4"
                        }
                      >

                        <View className="flex-1">

                          <Text
                            className={
                              active
                                ? "text-sm font-extrabold text-[#4355D8]"
                                : "text-sm font-bold text-[#15213B]"
                            }
                          >
                            {
                              option.label
                            }
                          </Text>

                          {option.subtitle ? (
                            <Text className="mt-1 text-xs text-[#606F88]">
                              {
                                option.subtitle
                              }
                            </Text>
                          ) : null}

                        </View>


                        {active ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color="#4355D8"
                          />
                        ) : (
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#8A94A6"
                          />
                        )}

                      </Pressable>
                    );
                  }
                )
              ) : (
                <View className="items-center py-10">

                  <Ionicons
                    name="file-tray-outline"
                    size={38}
                    color="#8A94A6"
                  />

                  <Text className="mt-3 text-sm font-semibold text-[#606F88]">
                    No options available
                  </Text>

                </View>
              )}

            </ScrollView>

          </Pressable>

        </Pressable>

      </Modal>
    </>
  );
};


/* =====================================================
   HELPERS
===================================================== */

const getId = (
  value:
    | string
    | {
        _id: string;
      }
    | undefined
) => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return value._id;
};


const getName = (
  value:
    | string
    | {
        _id: string;
        name?: string;
      }
    | undefined,
  fallback = "—"
) => {
  if (
    value &&
    typeof value ===
    "object"
  ) {
    return (
      value.name ??
      fallback
    );
  }

  return fallback;
};


/* =====================================================
   SCREEN
===================================================== */

const SubjectAssignmentScreen =
  () => {
    const navigation =
      useNavigation();


    /* ===================================================
       DATA
    =================================================== */

    const [
      sessions,
      setSessions,
    ] = useState<
      AcademicSession[]
    >([]);

    const [
      classes,
      setClasses,
    ] = useState<
      AcademicClass[]
    >([]);

    const [
      sections,
      setSections,
    ] = useState<
      AcademicSection[]
    >([]);

    const [
      subjects,
      setSubjects,
    ] = useState<
      AcademicSubject[]
    >([]);

    const [
      teachers,
      setTeachers,
    ] = useState<
      SchoolAdminTeacher[]
    >([]);

    const [
      assignments,
      setAssignments,
    ] = useState<
      SubjectAssignment[]
    >([]);


    /* ===================================================
       SELECTED VALUES
    =================================================== */

    const [
      sessionId,
      setSessionId,
    ] = useState("");

    const [
      classId,
      setClassId,
    ] = useState("");

    const [
      sectionId,
      setSectionId,
    ] = useState("");

    const [
      subjectId,
      setSubjectId,
    ] = useState("");

    const [
      teacherId,
      setTeacherId,
    ] = useState("");


    /* ===================================================
       UI STATE
    =================================================== */

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      refreshing,
      setRefreshing,
    ] = useState(false);

    const [
      saving,
      setSaving,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState<
      string | null
    >(null);


    /* ===================================================
       LOAD DATA
    =================================================== */

    const loadData =
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


            const results =
              await Promise.allSettled([
                getAcademicSessionsApi(),
                getAcademicClassesApi(),
                getAcademicSectionsApi(),
                getAcademicSubjectsApi(),
                getSchoolTeachersApi(),
                getSubjectAssignmentsApi(),
              ]);


            const [
              sessionResult,
              classResult,
              sectionResult,
              subjectResult,
              teacherResult,
              assignmentResult,
            ] = results;


            const sessionData =
              sessionResult.status ===
              "fulfilled"
                ? sessionResult.value
                : [];


            setSessions(
              sessionData
            );

            setClasses(
              classResult.status ===
              "fulfilled"
                ? classResult.value
                : []
            );

            setSections(
              sectionResult.status ===
              "fulfilled"
                ? sectionResult.value
                : []
            );

            setSubjects(
              subjectResult.status ===
              "fulfilled"
                ? subjectResult.value
                : []
            );

            setTeachers(
              teacherResult.status ===
              "fulfilled"
                ? teacherResult.value
                : []
            );

            setAssignments(
              assignmentResult.status ===
              "fulfilled"
                ? assignmentResult.value
                : []
            );


            /*
             * Current academic session
             * automatically select kar dete hain.
             */

            if (!sessionId) {
              const current =
                sessionData.find(
                  (session) =>
                    session.isCurrent
                ) ??
                sessionData[0];

              if (current) {
                setSessionId(
                  current._id
                );
              }
            }


            results.forEach(
              (
                result,
                index
              ) => {
                if (
                  result.status ===
                  "rejected"
                ) {
                  const names = [
                    "SESSIONS",
                    "CLASSES",
                    "SECTIONS",
                    "SUBJECTS",
                    "TEACHERS",
                    "ASSIGNMENTS",
                  ];

                  console.log(
                    `SUBJECT ASSIGNMENT ${names[index]} ERROR:`,
                    result.reason
                      ?.response
                      ?.data ??
                      result.reason
                        ?.message ??
                      result.reason
                  );
                }
              }
            );


            if (
              results.some(
                (result) =>
                  result.status ===
                  "rejected"
              )
            ) {
              setError(
                "Kuch data load nahi hua. Console check karein ya refresh karein."
              );
            }
          } catch (
            requestError: any
          ) {
            console.log(
              "SUBJECT ASSIGNMENT LOAD ERROR:",
              requestError
                ?.response
                ?.data ??
                requestError
                  ?.message ??
                requestError
            );

            setError(
              requestError
                ?.response
                ?.data
                ?.message ??
                "Assignment data load nahi ho saka."
            );
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
        },
        [
          sessionId,
        ]
      );


    useFocusEffect(
      useCallback(() => {
        loadData();
      }, [loadData])
    );


    /* ===================================================
       FILTER CLASSES BY SESSION
    =================================================== */

    const filteredClasses =
      useMemo(() => {
        if (!sessionId) {
          return [];
        }

        return classes.filter(
          (item) =>
            getId(
              item.academicSessionId
            ) === sessionId
        );
      }, [
        classes,
        sessionId,
      ]);


    /* ===================================================
       FILTER SECTIONS
    =================================================== */

    const filteredSections =
      useMemo(() => {
        if (
          !classId
        ) {
          return [];
        }

        return sections.filter(
          (item) => {
            const sameClass =
              getId(
                item.classId
              ) === classId;

            const itemSessionId =
              getId(
                item.academicSessionId
              );

            const sameSession =
              !itemSessionId ||
              itemSessionId ===
                sessionId;

            return (
              sameClass &&
              sameSession
            );
          }
        );
      }, [
        sections,
        classId,
        sessionId,
      ]);


    /* ===================================================
       SELECT OPTIONS
    =================================================== */

    const sessionOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          sessions.map(
            (item) => ({
              id: item._id,
              label: item.name,
              subtitle:
                item.isCurrent
                  ? "Current Session"
                  : item.status,
            })
          ),
        [sessions]
      );


    const classOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          filteredClasses.map(
            (item) => ({
              id: item._id,
              label: item.name,
            })
          ),
        [
          filteredClasses,
        ]
      );


    const sectionOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          filteredSections.map(
            (item) => ({
              id: item._id,
              label: item.name,
            })
          ),
        [
          filteredSections,
        ]
      );


    const subjectOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          subjects.map(
            (item) => ({
              id: item._id,
              label: item.name,
              subtitle:
                item.code,
            })
          ),
        [subjects]
      );


    const teacherOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          teachers
            .filter(
              (teacher) =>
                teacher.isActive !==
                  false &&
                (
                  !teacher.status ||
                  teacher.status
                    .toUpperCase() ===
                    "ACTIVE"
                )
            )
            .map(
              (teacher) => ({
                id: teacher._id,
                label:
                  teacher.name,
                subtitle:
                  teacher.email,
              })
            ),
        [teachers]
      );


    /* ===================================================
       CHANGE HANDLERS
    =================================================== */

    const handleSessionChange = (
      value: string
    ) => {
      setSessionId(value);

      setClassId("");
      setSectionId("");
      setSubjectId("");
      setTeacherId("");
    };


    const handleClassChange = (
      value: string
    ) => {
      setClassId(value);

      setSectionId("");
      setSubjectId("");
      setTeacherId("");
    };


    const handleSectionChange = (
      value: string
    ) => {
      setSectionId(value);

      setSubjectId("");
      setTeacherId("");
    };


    /* ===================================================
       CREATE ASSIGNMENT
    =================================================== */

    const handleAssign =
      async () => {
        if (!sessionId) {
          Alert.alert(
            "Session Required",
            "Academic session select karein."
          );

          return;
        }

        if (!classId) {
          Alert.alert(
            "Class Required",
            "Class select karein."
          );

          return;
        }

        if (!sectionId) {
          Alert.alert(
            "Section Required",
            "Section select karein."
          );

          return;
        }

        if (!subjectId) {
          Alert.alert(
            "Subject Required",
            "Subject select karein."
          );

          return;
        }

        if (!teacherId) {
          Alert.alert(
            "Teacher Required",
            "Teacher select karein."
          );

          return;
        }


        try {
          setSaving(true);


          const payload = {
            academicSessionId:
              sessionId,

            classId,

            sectionId,

            subjectId,

            teacherId,
          };


          console.log(
            "CREATE SUBJECT ASSIGNMENT:",
            payload
          );


          await createSubjectAssignmentApi(
            payload
          );


          Alert.alert(
            "Assigned",
            "Subject teacher ko successfully assign ho gaya."
          );


          /*
           * Session/class/section same rakhenge,
           * taaki admin next subject quickly assign kar sake.
           */

          setSubjectId("");
          setTeacherId("");


          const updated =
            await getSubjectAssignmentsApi();

          setAssignments(
            updated
          );
        } catch (
          requestError: any
        ) {
          console.log(
            "CREATE SUBJECT ASSIGNMENT ERROR:",
            requestError
              ?.response?.data ??
              requestError?.message ??
              requestError
          );


          Alert.alert(
            "Assignment Failed",
            requestError
              ?.response?.data
              ?.message ??
              "Subject assign nahi ho saka."
          );
        } finally {
          setSaving(false);
        }
      };


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

          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading assignment data...
          </Text>

        </SafeAreaView>
      );
    }


    /* ===================================================
       UI
    =================================================== */

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">

        {/* =============================================
            HEADER
        ============================================= */}

        <View className="flex-row items-center px-5 py-4">

          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color="#15213B"
            />

          </Pressable>


          <View className="ml-4 flex-1">

            <Text className="text-xl font-extrabold text-[#15213B]">
              Subject Assignment
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              Assign subjects to teachers
            </Text>

          </View>

        </View>


        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="px-5 pb-12"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadData(true)
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {/* ===========================================
              INFO
          =========================================== */}

          <View className="mb-5 flex-row rounded-3xl bg-[#4355D8] p-5">

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <Ionicons
                name="git-network-outline"
                size={24}
                color="#FFFFFF"
              />

            </View>


            <View className="ml-4 flex-1">

              <Text className="text-base font-extrabold text-white">
                Teacher Assignment
              </Text>

              <Text className="mt-1 text-xs leading-5 text-white/70">
                Select academic structure,
                subject and teacher to create
                an assignment.
              </Text>

            </View>

          </View>


          {/* ===========================================
              ERROR
          =========================================== */}

          {error ? (
            <View className="mb-5 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

              <Text className="text-xs font-semibold leading-5 text-[#DC4C5A]">
                {error}
              </Text>

            </View>
          ) : null}


          {/* ===========================================
              FORM
          =========================================== */}

          <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

            <Text className="mb-5 text-lg font-extrabold text-[#15213B]">
              Assignment Details
            </Text>


            {/* SESSION */}

            <SelectField
              label="ACADEMIC SESSION"
              placeholder="Select session"
              value={
                sessionId
              }
              options={
                sessionOptions
              }
              onSelect={
                handleSessionChange
              }
            />


            {/* CLASS */}

            <SelectField
              label="CLASS"
              placeholder={
                sessionId
                  ? "Select class"
                  : "Select session first"
              }
              value={
                classId
              }
              options={
                classOptions
              }
              disabled={
                !sessionId
              }
              onSelect={
                handleClassChange
              }
            />


            {/* SECTION */}

            <SelectField
              label="SECTION"
              placeholder={
                classId
                  ? "Select section"
                  : "Select class first"
              }
              value={
                sectionId
              }
              options={
                sectionOptions
              }
              disabled={
                !classId
              }
              onSelect={
                handleSectionChange
              }
            />


            {/* SUBJECT */}

            <SelectField
              label="SUBJECT"
              placeholder={
                sectionId
                  ? "Select subject"
                  : "Select section first"
              }
              value={
                subjectId
              }
              options={
                subjectOptions
              }
              disabled={
                !sectionId
              }
              onSelect={
                setSubjectId
              }
            />


            {/* TEACHER */}

            <SelectField
              label="TEACHER"
              placeholder={
                subjectId
                  ? "Select teacher"
                  : "Select subject first"
              }
              value={
                teacherId
              }
              options={
                teacherOptions
              }
              disabled={
                !subjectId
              }
              onSelect={
                setTeacherId
              }
            />


            {/* ASSIGN BUTTON */}

            <Pressable
              disabled={
                saving
              }
              onPress={
                handleAssign
              }
              className={
                saving
                  ? "mt-2 items-center rounded-2xl bg-[#A9B0E8] py-4"
                  : "mt-2 items-center rounded-2xl bg-[#4355D8] py-4"
              }
            >

              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <View className="flex-row items-center">

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-sm font-extrabold text-white">
                    Assign Teacher
                  </Text>

                </View>
              )}

            </Pressable>

          </View>


          {/* ===========================================
              EXISTING ASSIGNMENTS
          =========================================== */}

          <View className="mb-4 mt-7">

            <Text className="text-xl font-extrabold text-[#15213B]">
              Existing Assignments
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {assignments.length} assignments
            </Text>

          </View>


          {assignments.map(
            (assignment) => (
              <View
                key={
                  assignment._id
                }
                className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-4"
              >

                <View className="flex-row items-center">

                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                    <Ionicons
                      name="book-outline"
                      size={21}
                      color="#4355D8"
                    />

                  </View>


                  <View className="ml-3 flex-1">

                    <Text className="text-sm font-extrabold text-[#15213B]">
                      {getName(
                        assignment.subjectId,
                        "Subject"
                      )}
                    </Text>

                    <Text className="mt-1 text-xs text-[#606F88]">
                      {getName(
                        assignment.classId,
                        "Class"
                      )}
                      {" • "}
                      {getName(
                        assignment.sectionId,
                        "Section"
                      )}
                    </Text>

                  </View>


                  {assignment.status ? (
                    <View className="rounded-full bg-[#E7F7F1] px-3 py-1.5">

                      <Text className="text-[9px] font-extrabold text-[#24976D]">
                        {
                          assignment.status
                        }
                      </Text>

                    </View>
                  ) : null}

                </View>


                <View className="mt-4 flex-row items-center border-t border-[#EEF0F5] pt-4">

                  <Ionicons
                    name="person-outline"
                    size={16}
                    color="#606F88"
                  />

                  <Text className="ml-2 text-xs text-[#606F88]">
                    Teacher:{" "}
                    <Text className="font-bold text-[#33415C]">
                      {getName(
                        assignment.teacherId,
                        "Teacher"
                      )}
                    </Text>
                  </Text>

                </View>

              </View>
            )
          )}


          {assignments.length ===
          0 ? (
            <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white py-10">

              <Ionicons
                name="git-network-outline"
                size={38}
                color="#8A94A6"
              />

              <Text className="mt-3 text-sm font-bold text-[#15213B]">
                No assignments found
              </Text>

            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SubjectAssignmentScreen;