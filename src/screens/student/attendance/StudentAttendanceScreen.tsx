import React, {
  useCallback,
  useEffect,
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
  useFocusEffect,
} from "@react-navigation/native";

import api from "../../../api/axios";

import {
  formatDate,
} from "utils/studentHelpers";


type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "HALF_DAY";


interface AttendanceCalendarItem {
  date: string;

  status: AttendanceStatus;

  remarks?: string;
}


interface AttendanceSummary {
  presentDays: number;

  absentDays: number;

  leaveDays: number;

  halfDays: number;

  workingDays: number;

  attendancePercentage: number;

  below75: boolean;
}


interface StudentInfo {
  _id: string;

  name: string;

  admissionNumber?: string;

  rollNumber?: number;

  classId?: {
    _id: string;
    name: string;
  };

  sectionId?: {
    _id: string;
    name: string;
  };

  sessionId?: {
    _id: string;
    name: string;
  };
}


interface AttendanceData {
  student: StudentInfo;

  summary: AttendanceSummary;

  calendar: AttendanceCalendarItem[];
}


const initialSummary: AttendanceSummary = {
  presentDays: 0,
  absentDays: 0,
  leaveDays: 0,
  halfDays: 0,
  workingDays: 0,
  attendancePercentage: 0,
  below75: false,
};


const StudentAttendanceScreen =
  () => {
    const [
      attendance,
      setAttendance,
    ] = useState<
      AttendanceCalendarItem[]
    >([]);

    const [
      summary,
      setSummary,
    ] = useState<
      AttendanceSummary
    >(initialSummary);

    const [
      student,
      setStudent,
    ] = useState<
      StudentInfo | null
    >(null);

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


    /* =========================================
       LOAD ATTENDANCE
    ========================================= */

    const loadAttendance =
      useCallback(
        async (
          showLoader = true
        ) => {
          try {
            if (showLoader) {
              setLoading(true);
            }

            setError(null);


            const response =
              await api.get(
                "/attendance/me"
              );


            console.log(
              "STUDENT ATTENDANCE:",
              JSON.stringify(
                response.data,
                null,
                2
              )
            );


            /*
             * Backend response:
             *
             * response.data.data.student
             * response.data.data.summary
             * response.data.data.calendar
             */

            const data =
              response.data
                ?.data as
                | AttendanceData
                | undefined;


            if (!data) {
              setStudent(null);

              setSummary(
                initialSummary
              );

              setAttendance([]);

              return;
            }


            setStudent(
              data.student ??
                null
            );


            setSummary(
              data.summary ??
                initialSummary
            );


            setAttendance(
              Array.isArray(
                data.calendar
              )
                ? data.calendar
                : []
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "STUDENT ATTENDANCE ERROR:",
              requestError
                ?.response
                ?.data ??
                requestError
                  ?.message
            );


            setError(
              requestError
                ?.response
                ?.data
                ?.message ??
                "Unable to load attendance."
            );
          } finally {
            if (showLoader) {
              setLoading(false);
            }

            setRefreshing(false);
          }
        },
        []
      );


    /* =========================================
       INITIAL LOAD
    ========================================= */

    useEffect(() => {
      loadAttendance();
    }, [loadAttendance]);


    /*
     * Important:
     *
     * Student Attendance tab dobara open
     * karega to latest attendance fetch hogi.
     *
     * Teacher attendance mark karne ke baad
     * student ko old state nahi dikhegi.
     */

    useFocusEffect(
      useCallback(() => {
        loadAttendance(false);
      }, [loadAttendance])
    );


    /* =========================================
       REFRESH
    ========================================= */

    const handleRefresh =
      () => {
        setRefreshing(true);

        loadAttendance(false);
      };


    /* =========================================
       STATUS UI
    ========================================= */

    const getStatusStyle = (
      status: AttendanceStatus
    ) => {
      switch (status) {
        case "PRESENT":
          return {
            container:
              "bg-[#E7F7F1]",
            text:
              "text-[#1F9D70]",
            icon:
              "checkmark-circle" as const,
            iconColor:
              "#1F9D70",
          };

        case "ABSENT":
          return {
            container:
              "bg-[#FDECEE]",
            text:
              "text-[#D84A5B]",
            icon:
              "close-circle" as const,
            iconColor:
              "#D84A5B",
          };

        case "LEAVE":
          return {
            container:
              "bg-[#FFF2DE]",
            text:
              "text-[#D88A20]",
            icon:
              "calendar" as const,
            iconColor:
              "#D88A20",
          };

        case "HALF_DAY":
          return {
            container:
              "bg-[#EEF0FF]",
            text:
              "text-[#4355D8]",
            icon:
              "time" as const,
            iconColor:
              "#4355D8",
          };

        default:
          return {
            container:
              "bg-[#F1F3F7]",
            text:
              "text-[#606F88]",
            icon:
              "help-circle" as const,
            iconColor:
              "#606F88",
          };
      }
    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm text-[#606F88]">
            Loading attendance...
          </Text>

        </SafeAreaView>
      );
    }


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
          contentContainerClassName="px-5 pb-10 pt-5"
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor="#4355D8"
              colors={[
                "#4355D8",
              ]}
            />
          }
        >

          {/* HEADER */}

          <View className="flex-row items-center justify-between">

            <View>

              <Text className="text-2xl font-extrabold text-[#15213B]">
                Attendance
              </Text>

              {student ? (
                <Text className="mt-1 text-sm text-[#606F88]">
                  {student.name}
                </Text>
              ) : null}

            </View>


            <Pressable
              onPress={() =>
                loadAttendance()
              }
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
            >
              <Ionicons
                name="refresh"
                size={20}
                color="#4355D8"
              />
            </Pressable>

          </View>


          {/* CLASS INFO */}

          {student ? (
            <View className="mt-4 flex-row flex-wrap items-center">

              {student.classId
                ?.name ? (
                <View className="mr-2 rounded-full bg-[#EEF0FF] px-3 py-2">

                  <Text className="text-xs font-bold text-[#4355D8]">
                    {
                      student
                        .classId
                        .name
                    }
                  </Text>

                </View>
              ) : null}


              {student.sectionId
                ?.name ? (
                <View className="mr-2 rounded-full bg-[#EEF0FF] px-3 py-2">

                  <Text className="text-xs font-bold text-[#4355D8]">
                    Section{" "}
                    {
                      student
                        .sectionId
                        .name
                    }
                  </Text>

                </View>
              ) : null}


              {student.rollNumber !==
              undefined ? (
                <View className="rounded-full bg-[#F0F2F6] px-3 py-2">

                  <Text className="text-xs font-bold text-[#606F88]">
                    Roll No.{" "}
                    {
                      student.rollNumber
                    }
                  </Text>

                </View>
              ) : null}

            </View>
          ) : null}


          {/* ERROR */}

          {error ? (
            <View className="mt-5 rounded-2xl border border-[#F0C9CE] bg-[#FDF2F2] p-4">

              <View className="flex-row items-center">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#CC3D4E"
                />

                <Text className="ml-2 flex-1 text-sm font-medium text-[#CC3D4E]">
                  {error}
                </Text>

              </View>

            </View>
          ) : null}


          {/* =====================================
              ATTENDANCE SUMMARY
          ====================================== */}

          <View className="mt-5 flex-row items-center rounded-3xl bg-white p-5">

            {/* Percentage Circle */}

            <View
              className={
                `h-28 w-28 items-center justify-center rounded-full border-[9px] ${
                  summary.below75
                    ? "border-[#E65A6A]"
                    : "border-[#2BAA7B]"
                }`
              }
            >

              <Text className="text-2xl font-extrabold text-[#15213B]">
                {
                  summary
                    .attendancePercentage
                }
                %
              </Text>

              <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
                ATTENDANCE
              </Text>

            </View>


            {/* Stats */}

            <View className="ml-6 flex-1">

              <View className="flex-row items-center justify-between">

                <Text className="text-sm text-[#606F88]">
                  Present
                </Text>

                <Text className="font-extrabold text-[#2BAA7B]">
                  {
                    summary
                      .presentDays
                  }
                </Text>

              </View>


              <View className="mt-2 flex-row items-center justify-between">

                <Text className="text-sm text-[#606F88]">
                  Absent
                </Text>

                <Text className="font-extrabold text-[#D84A5B]">
                  {
                    summary
                      .absentDays
                  }
                </Text>

              </View>


              <View className="mt-2 flex-row items-center justify-between">

                <Text className="text-sm text-[#606F88]">
                  Leave
                </Text>

                <Text className="font-extrabold text-[#D88A20]">
                  {
                    summary
                      .leaveDays
                  }
                </Text>

              </View>


              <View className="mt-2 flex-row items-center justify-between">

                <Text className="text-sm text-[#606F88]">
                  Half Day
                </Text>

                <Text className="font-extrabold text-[#4355D8]">
                  {
                    summary
                      .halfDays
                  }
                </Text>

              </View>


              <View className="my-3 h-px bg-[#EEF0F4]" />


              <View className="flex-row items-center justify-between">

                <Text className="font-bold text-[#15213B]">
                  Working Days
                </Text>

                <Text className="font-extrabold text-[#15213B]">
                  {
                    summary
                      .workingDays
                  }
                </Text>

              </View>

            </View>

          </View>


          {/* BELOW 75 WARNING */}

          {summary.below75 ? (
            <View className="mt-4 flex-row items-center rounded-2xl bg-[#FFF2DE] p-4">

              <Ionicons
                name="warning-outline"
                size={21}
                color="#D88A20"
              />

              <Text className="ml-3 flex-1 text-xs font-medium leading-5 text-[#A66A16]">
                Your attendance is below 75%. Please maintain regular attendance.
              </Text>

            </View>
          ) : null}


          {/* =====================================
              RECENT ATTENDANCE
          ====================================== */}

          <View className="mb-3 mt-7 flex-row items-center justify-between">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Recent Attendance
            </Text>

            <Text className="text-xs font-bold text-[#606F88]">
              {
                summary
                  .workingDays
              }{" "}
              days
            </Text>

          </View>


          {/* EMPTY */}

          {attendance.length ===
          0 ? (
            <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-6 py-10">

              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EEF0FF]">

                <Ionicons
                  name="calendar-outline"
                  size={29}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No Attendance Yet
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-[#606F88]">
                Your attendance records will appear here after your teacher marks attendance.
              </Text>

            </View>
          ) : (
            attendance.map(
              (
                record,
                index
              ) => {
                const statusStyle =
                  getStatusStyle(
                    record.status
                  );

                return (
                  <View
                    key={`${record.date}-${index}`}
                    className="mb-3 rounded-2xl border border-[#E5E8F0] bg-white p-4"
                  >

                    <View className="flex-row items-center justify-between">

                      <View className="flex-1 flex-row items-center">

                        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F5FA]">

                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#4355D8"
                          />

                        </View>


                        <View className="ml-3 flex-1">

                          <Text className="font-extrabold text-[#15213B]">
                            {formatDate(
                              record.date
                            )}
                          </Text>

                          {record.remarks ? (
                            <Text
                              numberOfLines={
                                1
                              }
                              className="mt-1 text-xs text-[#606F88]"
                            >
                              {
                                record.remarks
                              }
                            </Text>
                          ) : (
                            <Text className="mt-1 text-xs text-[#9AA3B4]">
                              Attendance marked
                            </Text>
                          )}

                        </View>

                      </View>


                      <View
                        className={`ml-3 flex-row items-center rounded-xl px-3 py-2 ${statusStyle.container}`}
                      >

                        <Ionicons
                          name={
                            statusStyle.icon
                          }
                          size={15}
                          color={
                            statusStyle.iconColor
                          }
                        />

                        <Text
                          className={`ml-1 text-[11px] font-extrabold ${statusStyle.text}`}
                        >
                          {
                            record.status ===
                            "HALF_DAY"
                              ? "HALF DAY"
                              : record.status
                          }
                        </Text>

                      </View>

                    </View>

                  </View>
                );
              }
            )
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default StudentAttendanceScreen;