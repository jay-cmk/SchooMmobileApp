import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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
  useFocusEffect,
} from "@react-navigation/native";

import {
  getAcademicClassesApi,
  getAcademicSectionsApi,
  getAcademicSessionsApi,
  getSchoolStudentsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
  SchoolAdminStudent,
} from "types/schoolAdmin.types";


/* =====================================================
   TYPES
===================================================== */

interface SelectOption {
  id: string;
  label: string;
}


/* =====================================================
   HELPERS
===================================================== */

const getRelationId = (
  value:
    | string
    | {
        _id: string;
      }
    | undefined
): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value._id;
};


const getRelationName = (
  value:
    | string
    | {
        _id: string;
        name?: string;
      }
    | undefined
): string => {
  if (
    value &&
    typeof value === "object"
  ) {
    return value.name ?? "";
  }

  return "";
};


/* =====================================================
   SELECT FIELD
===================================================== */

interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  onSelect: (value: string) => void;
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
    opened,
    setOpened,
  ] = useState(false);


  const selected =
    options.find(
      (option) =>
        option.id === value
    );


  return (
    <View className="mb-3">

      <Text className="mb-2 text-[10px] font-extrabold tracking-wider text-[#606F88]">
        {label}
      </Text>


      <Pressable
        disabled={disabled}
        onPress={() =>
          setOpened(
            (previous) =>
              !previous
          )
        }
        className={
          disabled
            ? "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-[#F1F2F6] px-4 py-3.5"
            : "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4 py-3.5"
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
          {selected?.label ??
            placeholder}
        </Text>


        <Ionicons
          name={
            opened
              ? "chevron-up"
              : "chevron-down"
          }
          size={18}
          color={
            disabled
              ? "#B5BBC5"
              : "#606F88"
          }
        />

      </Pressable>


      {opened && !disabled ? (
        <View className="mt-2 max-h-52 overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white">

          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={
              false
            }
          >

            {options.length > 0 ? (
              options.map(
                (option) => {
                  const active =
                    option.id ===
                    value;

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => {
                        onSelect(
                          option.id
                        );

                        setOpened(
                          false
                        );
                      }}
                      className={
                        active
                          ? "border-b border-[#EEF0F5] bg-[#EEF0FF] px-4 py-4"
                          : "border-b border-[#EEF0F5] px-4 py-4"
                      }
                    >

                      <View className="flex-row items-center">

                        <Text
                          className={
                            active
                              ? "flex-1 text-sm font-extrabold text-[#4355D8]"
                              : "flex-1 text-sm font-semibold text-[#15213B]"
                          }
                        >
                          {option.label}
                        </Text>


                        {active ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#4355D8"
                          />
                        ) : null}

                      </View>

                    </Pressable>
                  );
                }
              )
            ) : (
              <View className="px-4 py-5">

                <Text className="text-center text-xs text-[#8A94A6]">
                  No options available
                </Text>

              </View>
            )}

          </ScrollView>

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   STUDENT CARD
===================================================== */

interface StudentCardProps {
  student: SchoolAdminStudent;
}


const StudentCard = ({
  student,
}: StudentCardProps) => {
  const className =
    getRelationName(
      student.classId
    );

  const sectionName =
    getRelationName(
      student.sectionId
    );


  const isActive =
    !student.status ||
    student.status.toUpperCase() ===
      "ACTIVE";


  const initial =
    student.name
      ?.trim()
      .charAt(0)
      .toUpperCase() || "S";


  return (
    <View className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-4">

      {/* TOP */}

      <View className="flex-row items-center">

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">

          <Text className="text-lg font-extrabold text-[#4355D8]">
            {initial}
          </Text>

        </View>


        <View className="ml-3 flex-1">

          <Text
            numberOfLines={1}
            className="text-base font-extrabold text-[#15213B]"
          >
            {student.name}
          </Text>


          {student.admissionNumber ? (
            <Text className="mt-1 text-xs text-[#606F88]">
              Admission No:{" "}
              {student.admissionNumber}
            </Text>
          ) : null}

        </View>


        <View
          className={
            isActive
              ? "rounded-full bg-[#E7F7F1] px-3 py-1.5"
              : "rounded-full bg-[#FDECEE] px-3 py-1.5"
          }
        >

          <Text
            className={
              isActive
                ? "text-[9px] font-extrabold text-[#24976D]"
                : "text-[9px] font-extrabold text-[#DC4C5A]"
            }
          >
            {isActive
              ? "ACTIVE"
              : student.status ??
                "INACTIVE"}
          </Text>

        </View>

      </View>


      {/* CLASS / SECTION / ROLL */}

      <View className="mt-4 flex-row border-t border-[#EEF0F5] pt-4">

        <View className="flex-1">

          <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
            CLASS
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-xs font-bold text-[#33415C]"
          >
            {className ||
              "Not Assigned"}
          </Text>

        </View>


        <View className="flex-1">

          <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
            SECTION
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-xs font-bold text-[#33415C]"
          >
            {sectionName ||
              "Not Assigned"}
          </Text>

        </View>


        <View className="flex-1">

          <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
            ROLL NO.
          </Text>

          <Text className="mt-1 text-xs font-bold text-[#33415C]">
            {student.rollNumber ??
              "—"}
          </Text>

        </View>

      </View>


      {/* CONTACT */}

      {student.email ||
      student.mobile ? (
        <View className="mt-4 rounded-2xl bg-[#F7F7FB] p-3">

          {student.email ? (
            <View className="flex-row items-center">

              <Ionicons
                name="mail-outline"
                size={14}
                color="#606F88"
              />

              <Text
                numberOfLines={1}
                className="ml-2 flex-1 text-xs text-[#606F88]"
              >
                {student.email}
              </Text>

            </View>
          ) : null}


          {student.mobile ? (
            <View
              className={
                student.email
                  ? "mt-2 flex-row items-center"
                  : "flex-row items-center"
              }
            >

              <Ionicons
                name="call-outline"
                size={14}
                color="#606F88"
              />

              <Text className="ml-2 text-xs text-[#606F88]">
                {student.mobile}
              </Text>

            </View>
          ) : null}

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminStudentsScreen =
  () => {

    /* ===================================================
       DATA
    =================================================== */

    const [
      students,
      setStudents,
    ] = useState<
      SchoolAdminStudent[]
    >([]);

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


    /* ===================================================
       FILTER STATE
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
      search,
      setSearch,
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


            const [
              studentData,
              sessionData,
              classData,
              sectionData,
            ] =
              await Promise.all([
                getSchoolStudentsApi(),
                getAcademicSessionsApi(),
                getAcademicClassesApi(),
                getAcademicSectionsApi(),
              ]);


            setStudents(
              studentData
            );

            setSessions(
              sessionData
            );

            setClasses(
              classData
            );

            setSections(
              sectionData
            );


            /*
             * Current academic session ko
             * automatically select karega.
             */

            setSessionId(
              (previous) => {
                if (previous) {
                  return previous;
                }

                const current =
                  sessionData.find(
                    (session) =>
                      session.isCurrent ===
                      true
                  ) ??
                  sessionData[0];

                return (
                  current?._id ??
                  ""
                );
              }
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SCHOOL ADMIN STUDENTS ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );


            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Students data load nahi ho saka."
            );
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
        },
        []
      );


    useFocusEffect(
      useCallback(() => {
        loadData();
      }, [loadData])
    );


    /* ===================================================
       CLASSES FOR SELECTED SESSION
    =================================================== */

    const filteredClasses =
      useMemo(() => {
        if (!sessionId) {
          return [];
        }


        return classes.filter(
          (item) => {
            return (
              getRelationId(
                item.academicSessionId
              ) === sessionId
            );
          }
        );
      }, [
        classes,
        sessionId,
      ]);


    /* ===================================================
       SECTIONS FOR SELECTED CLASS
    =================================================== */

    const filteredSections =
      useMemo(() => {
        if (!classId) {
          return [];
        }


        return sections.filter(
          (item) => {
            const sameClass =
              getRelationId(
                item.classId
              ) === classId;


            const itemSessionId =
              getRelationId(
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
            (session) => ({
              id: session._id,

              label:
                session.isCurrent
                  ? `${session.name} (Current)`
                  : session.name,
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
        [filteredClasses]
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
        [filteredSections]
      );


    /* ===================================================
       FILTER STUDENTS
    =================================================== */

    const filteredStudents =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();


        return students.filter(
          (student) => {

            /* -------------------------------------------
               SESSION FILTER
            ------------------------------------------- */

            if (sessionId) {
              const studentSessionId =
                getRelationId(
                  student.sessionId
                );

              if (
                studentSessionId &&
                studentSessionId !==
                  sessionId
              ) {
                return false;
              }
            }


            /* -------------------------------------------
               CLASS FILTER
            ------------------------------------------- */

            if (classId) {
              const studentClassId =
                getRelationId(
                  student.classId
                );

              if (
                studentClassId !==
                classId
              ) {
                return false;
              }
            }


            /* -------------------------------------------
               SECTION FILTER
            ------------------------------------------- */

            if (sectionId) {
              const studentSectionId =
                getRelationId(
                  student.sectionId
                );

              if (
                studentSectionId !==
                sectionId
              ) {
                return false;
              }
            }


            /* -------------------------------------------
               SEARCH
            ------------------------------------------- */

            if (!query) {
              return true;
            }


            const className =
              getRelationName(
                student.classId
              ).toLowerCase();


            const sectionName =
              getRelationName(
                student.sectionId
              ).toLowerCase();


            return (
              student.name
                ?.toLowerCase()
                .includes(query) ||
              student
                .admissionNumber
                ?.toLowerCase()
                .includes(query) ||
              String(
                student.rollNumber ??
                  ""
              ).includes(query) ||
              student.email
                ?.toLowerCase()
                .includes(query) ||
              student.mobile
                ?.toLowerCase()
                .includes(query) ||
              className.includes(
                query
              ) ||
              sectionName.includes(
                query
              )
            );
          }
        );
      }, [
        students,
        sessionId,
        classId,
        sectionId,
        search,
      ]);


    /* ===================================================
       ACTIVE STUDENTS
    =================================================== */

    const activeStudents =
      useMemo(() => {
        return filteredStudents.filter(
          (student) =>
            !student.status ||
            student.status
              .toUpperCase() ===
              "ACTIVE"
        ).length;
      }, [filteredStudents]);


    /* ===================================================
       FILTER HANDLERS
    =================================================== */

    const handleSessionChange = (
      value: string
    ) => {
      setSessionId(value);

      setClassId("");

      setSectionId("");
    };


    const handleClassChange = (
      value: string
    ) => {
      setClassId(value);

      setSectionId("");
    };


    const handleSectionChange = (
      value: string
    ) => {
      setSectionId(value);
    };


    const clearFilters =
      () => {
        setClassId("");
        setSectionId("");
        setSearch("");
      };


    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

            <Ionicons
              name="people-outline"
              size={34}
              color="#4355D8"
            />

          </View>


          <ActivityIndicator
            className="mt-6"
            size="large"
            color="#4355D8"
          />


          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading students...
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

        {/* ===============================================
            HEADER
        =============================================== */}

        <View className="flex-row items-center px-5 pb-4 pt-4">

          <View className="flex-1">

            <Text className="text-3xl font-extrabold text-[#15213B]">
              Students
            </Text>

            <Text className="mt-1 text-sm text-[#606F88]">
              Class & section wise students
            </Text>

          </View>


          <View className="h-12 min-w-12 items-center justify-center rounded-2xl bg-[#EEF0FF] px-3">

            <Text className="text-base font-extrabold text-[#4355D8]">
              {filteredStudents.length}
            </Text>

          </View>

        </View>


        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-5 pb-28"
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

          {/* =============================================
              FILTER CARD
          ============================================= */}

          <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

            <View className="mb-5 flex-row items-center">

              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                <Ionicons
                  name="filter-outline"
                  size={21}
                  color="#4355D8"
                />

              </View>


              <View className="ml-3 flex-1">

                <Text className="text-base font-extrabold text-[#15213B]">
                  Filter Students
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Session → Class → Section
                </Text>

              </View>


              {(classId ||
                sectionId ||
                search) ? (
                <Pressable
                  onPress={
                    clearFilters
                  }
                >

                  <Text className="text-xs font-extrabold text-[#4355D8]">
                    Clear
                  </Text>

                </Pressable>
              ) : null}

            </View>


            {/* SESSION */}

            <SelectField
              label="ACADEMIC SESSION"
              placeholder="Select session"
              value={sessionId}
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
              value={classId}
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
                  ? "All sections"
                  : "Select class first"
              }
              value={sectionId}
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


            {/* SEARCH */}

            <View className="mt-1">

              <Text className="mb-2 text-[10px] font-extrabold tracking-wider text-[#606F88]">
                SEARCH STUDENT
              </Text>


              <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-[#F9FAFC] px-4">

                <Ionicons
                  name="search-outline"
                  size={19}
                  color="#8A94A6"
                />


                <TextInput
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  placeholder="Name, admission no, roll no..."
                  placeholderTextColor="#9AA3B2"
                  className="ml-3 flex-1 py-4 text-sm text-[#15213B]"
                />


                {search ? (
                  <Pressable
                    onPress={() =>
                      setSearch("")
                    }
                  >

                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="#8A94A6"
                    />

                  </Pressable>
                ) : null}

              </View>

            </View>

          </View>


          {/* =============================================
              ERROR
          ============================================= */}

          {error ? (
            <View className="mt-4 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

              <View className="flex-row items-start">

                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color="#DC4C5A"
                />


                <Text className="ml-2 flex-1 text-xs font-semibold leading-5 text-[#DC4C5A]">
                  {error}
                </Text>

              </View>


              <Pressable
                onPress={() =>
                  loadData()
                }
                className="mt-3 self-start"
              >

                <Text className="text-xs font-extrabold text-[#4355D8]">
                  Try Again
                </Text>

              </Pressable>

            </View>
          ) : null}


          {/* =============================================
              SUMMARY
          ============================================= */}

          <View className="mb-5 mt-6 flex-row">

            <View className="mr-2 flex-1 rounded-2xl bg-[#EEF0FF] p-4">

              <Text className="text-2xl font-extrabold text-[#4355D8]">
                {filteredStudents.length}
              </Text>

              <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
                STUDENTS
              </Text>

            </View>


            <View className="ml-2 flex-1 rounded-2xl bg-[#E7F7F1] p-4">

              <Text className="text-2xl font-extrabold text-[#24976D]">
                {activeStudents}
              </Text>

              <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
                ACTIVE
              </Text>

            </View>

          </View>


          {/* =============================================
              SELECTED CLASS INFO
          ============================================= */}

          {classId ? (
            <View className="mb-5 flex-row items-center rounded-2xl bg-[#15213B] px-4 py-3">

              <Ionicons
                name="school-outline"
                size={18}
                color="#FFFFFF"
              />


              <Text className="ml-2 flex-1 text-xs font-bold text-white">

                {
                  classOptions.find(
                    (item) =>
                      item.id ===
                      classId
                  )?.label
                }

                {sectionId
                  ? ` • ${
                      sectionOptions.find(
                        (item) =>
                          item.id ===
                          sectionId
                      )?.label ??
                      ""
                    }`
                  : " • All Sections"}

              </Text>


              <Text className="text-xs font-extrabold text-white">
                {filteredStudents.length}
              </Text>

            </View>
          ) : null}


          {/* =============================================
              STUDENT LIST TITLE
          ============================================= */}

          <View className="mb-4 flex-row items-end">

            <View className="flex-1">

              <Text className="text-xl font-extrabold text-[#15213B]">
                Student List
              </Text>

              <Text className="mt-1 text-xs text-[#606F88]">
                {classId
                  ? sectionId
                    ? "Selected section students"
                    : "Selected class students"
                  : "Select a class to view class-wise students"}
              </Text>

            </View>

          </View>


          {/* =============================================
              STUDENTS
          ============================================= */}

          {filteredStudents.length >
          0 ? (
            filteredStudents.map(
              (student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                />
              )
            )
          ) : (
            <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-6 py-12">

              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

                <Ionicons
                  name="people-outline"
                  size={36}
                  color="#4355D8"
                />

              </View>


              <Text className="mt-5 text-lg font-extrabold text-[#15213B]">
                No students found
              </Text>


              <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                {classId
                  ? "Selected class/section ke liye koi student nahi mila."
                  : "Current filter ke according koi student nahi mila."}
              </Text>

            </View>
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminStudentsScreen;