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
  useNavigation,
} from "@react-navigation/native";

import {
  getAcademicClassesApi,
  getAcademicSectionsApi,
  getAcademicSessionsApi,
  getSchoolAttendanceApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
  AttendanceRecord,
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

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return value._id;
};


const getStudentName = (
  record: AttendanceRecord
): string => {
  if (
    record.studentId &&
    typeof record.studentId ===
      "object"
  ) {
    return (
      record.studentId.name ??
      "Student"
    );
  }

  return "Student";
};


const getTodayDate = () => {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


/* =====================================================
   SIMPLE SELECT
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
    opened,
    setOpened,
  ] = useState(false);


  const selected =
    options.find(
      (option) =>
        option.id === value
    );


  return (
    <View className="mb-4">

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
          color="#606F88"
        />

      </Pressable>


      {opened &&
      !disabled ? (
        <View className="mt-2 overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white">

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
                        {
                          option.label
                        }
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

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   ATTENDANCE STATUS BADGE
===================================================== */

interface StatusBadgeProps {
  status?: string;
}


const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const value =
    status?.toUpperCase() ??
    "UNKNOWN";


  if (value === "PRESENT") {
    return (
      <View className="rounded-full bg-[#E7F7F1] px-3 py-1.5">
        <Text className="text-[9px] font-extrabold text-[#24976D]">
          PRESENT
        </Text>
      </View>
    );
  }


  if (value === "ABSENT") {
    return (
      <View className="rounded-full bg-[#FDECEE] px-3 py-1.5">
        <Text className="text-[9px] font-extrabold text-[#DC4C5A]">
          ABSENT
        </Text>
      </View>
    );
  }


  if (value === "LEAVE") {
    return (
      <View className="rounded-full bg-[#FFF2DE] px-3 py-1.5">
        <Text className="text-[9px] font-extrabold text-[#D68B23]">
          LEAVE
        </Text>
      </View>
    );
  }


  if (value === "HALF_DAY") {
    return (
      <View className="rounded-full bg-[#F3EBFF] px-3 py-1.5">
        <Text className="text-[9px] font-extrabold text-[#7B55C7]">
          HALF DAY
        </Text>
      </View>
    );
  }


  return (
    <View className="rounded-full bg-[#EEF0F5] px-3 py-1.5">
      <Text className="text-[9px] font-extrabold text-[#606F88]">
        {value}
      </Text>
    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAttendanceScreen =
  () => {
    const navigation =
      useNavigation();


    /* ===================================================
       ACADEMIC DATA
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


    /* ===================================================
       SELECTED FILTERS
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
      date,
      setDate,
    ] = useState(
      getTodayDate()
    );


    /* ===================================================
       ATTENDANCE
    =================================================== */

    const [
      attendance,
      setAttendance,
    ] = useState<
      AttendanceRecord[]
    >([]);

    const [
      dataLoaded,
      setDataLoaded,
    ] = useState(false);


    /* ===================================================
       UI
    =================================================== */

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      attendanceLoading,
      setAttendanceLoading,
    ] = useState(false);

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
       LOAD FILTER DATA
    =================================================== */

    const loadAcademicData =
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
              sessionData,
              classData,
              sectionData,
            ] =
              await Promise.all([
                getAcademicSessionsApi(),
                getAcademicClassesApi(),
                getAcademicSectionsApi(),
              ]);


            setSessions(
              sessionData
            );

            setClasses(
              classData
            );

            setSections(
              sectionData
            );


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
          } catch (
            requestError: any
          ) {
            console.log(
              "ATTENDANCE FILTER DATA ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Academic data load nahi ho saka."
            );
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
        },
        [sessionId]
      );


    useFocusEffect(
      useCallback(() => {
        loadAcademicData();
      }, [loadAcademicData])
    );


    /* ===================================================
       FILTER CLASSES
    =================================================== */

    const filteredClasses =
      useMemo(() => {
        if (!sessionId) {
          return [];
        }

        return classes.filter(
          (item) =>
            getRelationId(
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
        if (!classId) {
          return [];
        }

        return sections.filter(
          (item) => {
            const sameClass =
              getRelationId(
                item.classId
              ) === classId;

            const sectionSessionId =
              getRelationId(
                item.academicSessionId
              );

            const sameSession =
              !sectionSessionId ||
              sectionSessionId ===
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
       OPTIONS
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


    /* ===================================================
       RESET ATTENDANCE
    =================================================== */

    const resetAttendance =
      () => {
        setAttendance([]);
        setDataLoaded(false);
        setError(null);
      };


    /* ===================================================
       CHANGE SESSION
    =================================================== */

    const handleSessionChange = (
      value: string
    ) => {
      setSessionId(value);

      setClassId("");
      setSectionId("");

      resetAttendance();
    };


    /* ===================================================
       CHANGE CLASS
    =================================================== */

    const handleClassChange = (
      value: string
    ) => {
      setClassId(value);

      setSectionId("");

      resetAttendance();
    };


    /* ===================================================
       CHANGE SECTION
    =================================================== */

    const handleSectionChange = (
      value: string
    ) => {
      setSectionId(value);

      resetAttendance();
    };


    /* ===================================================
       LOAD ATTENDANCE
    =================================================== */

    const loadAttendance =
      async () => {
        if (
          !sessionId ||
          !classId ||
          !sectionId ||
          !date.trim()
        ) {
          setError(
            "Session, class, section aur date select karein."
          );

          return;
        }


        try {
          setAttendanceLoading(
            true
          );

          setError(null);


          const data =
            await getSchoolAttendanceApi(
              {
                academicSessionId:
                  sessionId,

                classId,

                sectionId,

                date:
                  date.trim(),
              }
            );


          console.log(
            "SCHOOL ATTENDANCE RESPONSE:",
            data
          );


          let records:
            AttendanceRecord[] =
            [];


          if (
            Array.isArray(data)
          ) {
            records =
              data as AttendanceRecord[];
          } else if (
            Array.isArray(
              data?.attendance
            )
          ) {
            records =
              data.attendance;
          } else if (
            Array.isArray(
              data?.records
            )
          ) {
            records =
              data.records;
          } else if (
            Array.isArray(
              data?.attendances
            )
          ) {
            records =
              data.attendances;
          }


          setAttendance(
            records
          );

          setDataLoaded(true);
        } catch (
          requestError: any
        ) {
          console.log(
            "SCHOOL ATTENDANCE ERROR:",
            requestError
              ?.response?.data ??
              requestError?.message ??
              requestError
          );


          setAttendance([]);

          setDataLoaded(false);


          setError(
            requestError
              ?.response?.data
              ?.message ??
              "Attendance load nahi ho saka."
          );
        } finally {
          setAttendanceLoading(
            false
          );
        }
      };


    /* ===================================================
       SUMMARY
    =================================================== */

    const summary =
      useMemo(() => {
        let present = 0;
        let absent = 0;
        let leave = 0;
        let halfDay = 0;


        attendance.forEach(
          (record) => {
            const status =
              record.status
                ?.toUpperCase();


            if (
              status ===
              "PRESENT"
            ) {
              present += 1;
            } else if (
              status ===
              "ABSENT"
            ) {
              absent += 1;
            } else if (
              status ===
              "LEAVE"
            ) {
              leave += 1;
            } else if (
              status ===
              "HALF_DAY"
            ) {
              halfDay += 1;
            }
          }
        );


        return {
          present,
          absent,
          leave,
          halfDay,
        };
      }, [attendance]);


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
            Loading attendance...
          </Text>

        </SafeAreaView>
      );
    }


    /* ===================================================
       SCREEN
    =================================================== */

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">

        {/* HEADER */}

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
              Attendance
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              View student attendance
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
                loadAcademicData(
                  true
                )
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {/* FILTER */}

          <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

            <View className="mb-5 flex-row items-center">

              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                <Ionicons
                  name="options-outline"
                  size={21}
                  color="#4355D8"
                />
              </View>

              <View className="ml-3">
                <Text className="text-base font-extrabold text-[#15213B]">
                  Attendance Filter
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Select class and date
                </Text>
              </View>

            </View>


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


            <View className="mb-4">

              <Text className="mb-2 text-[10px] font-extrabold tracking-wider text-[#606F88]">
                DATE
              </Text>

              <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4">

                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#606F88"
                />

                <TextInput
                  value={date}
                  onChangeText={(
                    value
                  ) => {
                    setDate(
                      value
                    );

                    resetAttendance();
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9AA3B2"
                  autoCapitalize="none"
                  className="ml-3 flex-1 py-4 text-sm font-semibold text-[#15213B]"
                />

              </View>

              <Text className="mt-2 text-[10px] text-[#8A94A6]">
                Format: YYYY-MM-DD
              </Text>

            </View>


            <Pressable
              disabled={
                attendanceLoading
              }
              onPress={
                loadAttendance
              }
              className={
                attendanceLoading
                  ? "items-center rounded-2xl bg-[#A9B0E8] py-4"
                  : "items-center rounded-2xl bg-[#4355D8] py-4"
              }
            >

              {attendanceLoading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <View className="flex-row items-center">

                  <Ionicons
                    name="search-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-sm font-extrabold text-white">
                    View Attendance
                  </Text>

                </View>
              )}

            </Pressable>

          </View>


          {/* ERROR */}

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

            </View>
          ) : null}


          {/* SUMMARY */}

          {dataLoaded ? (
            <>
              <View className="mb-4 mt-7">

                <Text className="text-xl font-extrabold text-[#15213B]">
                  Summary
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {attendance.length} attendance records
                </Text>

              </View>


              <View className="flex-row">

                <View className="mr-1.5 flex-1 rounded-2xl bg-[#E7F7F1] p-3">
                  <Text className="text-xl font-extrabold text-[#24976D]">
                    {summary.present}
                  </Text>

                  <Text className="mt-1 text-[8px] font-extrabold text-[#24976D]">
                    PRESENT
                  </Text>
                </View>


                <View className="mx-1.5 flex-1 rounded-2xl bg-[#FDECEE] p-3">
                  <Text className="text-xl font-extrabold text-[#DC4C5A]">
                    {summary.absent}
                  </Text>

                  <Text className="mt-1 text-[8px] font-extrabold text-[#DC4C5A]">
                    ABSENT
                  </Text>
                </View>


                <View className="mx-1.5 flex-1 rounded-2xl bg-[#FFF2DE] p-3">
                  <Text className="text-xl font-extrabold text-[#D68B23]">
                    {summary.leave}
                  </Text>

                  <Text className="mt-1 text-[8px] font-extrabold text-[#D68B23]">
                    LEAVE
                  </Text>
                </View>


                <View className="ml-1.5 flex-1 rounded-2xl bg-[#F3EBFF] p-3">
                  <Text className="text-xl font-extrabold text-[#7B55C7]">
                    {summary.halfDay}
                  </Text>

                  <Text className="mt-1 text-[8px] font-extrabold text-[#7B55C7]">
                    HALF DAY
                  </Text>
                </View>

              </View>


              {/* RECORDS */}

              <View className="mb-4 mt-7">

                <Text className="text-xl font-extrabold text-[#15213B]">
                  Student Attendance
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {date}
                </Text>

              </View>


              {attendance.map(
                (
                  record,
                  index
                ) => (
                  <View
                    key={
                      record._id ??
                      `${getStudentName(
                        record
                      )}-${index}`
                    }
                    className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-4"
                  >

                    <View className="flex-row items-center">

                      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                        <Text className="font-extrabold text-[#4355D8]">
                          {getStudentName(
                            record
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </Text>

                      </View>


                      <View className="ml-3 flex-1">

                        <Text
                          numberOfLines={1}
                          className="text-sm font-extrabold text-[#15213B]"
                        >
                          {getStudentName(
                            record
                          )}
                        </Text>

                        {record.date ? (
                          <Text className="mt-1 text-xs text-[#606F88]">
                            {record.date}
                          </Text>
                        ) : null}

                      </View>


                      <StatusBadge
                        status={
                          record.status
                        }
                      />

                    </View>

                  </View>
                )
              )}


              {attendance.length ===
              0 ? (
                <View className="mt-3 items-center rounded-3xl border border-[#E5E8F0] bg-white py-10">

                  <Ionicons
                    name="calendar-outline"
                    size={38}
                    color="#8A94A6"
                  />

                  <Text className="mt-3 text-sm font-extrabold text-[#15213B]">
                    No attendance records
                  </Text>

                  <Text className="mt-2 px-8 text-center text-xs leading-5 text-[#606F88]">
                    Selected class, section and date ke liye attendance record nahi mila.
                  </Text>

                </View>
              ) : null}

            </>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAttendanceScreen;