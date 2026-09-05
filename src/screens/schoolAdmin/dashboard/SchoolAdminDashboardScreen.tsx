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

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import {
  useAppSelector,
} from "../../../store/hook";

import {
  getSchoolAdminDashboardApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  SchoolAdminDashboardData,
} from "types/schoolAdmin.types";

import type {
  SchoolAdminStackParamList,
} from "types/navigation.types";


/* =====================================================
   NAVIGATION
===================================================== */

type NavigationProp =
  NativeStackNavigationProp<
    SchoolAdminStackParamList
  >;


/* =====================================================
   INITIAL DATA
===================================================== */

const initialDashboardData:
  SchoolAdminDashboardData = {
    students: [],
    teachers: [],
    sessions: [],
    classes: [],
    sections: [],
    subjects: [],
    homework: [],
  };


/* =====================================================
   DASHBOARD CARD
===================================================== */

interface DashboardCardProps {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  title: string;

  value: number;

  subtitle: string;

  iconBackground: string;

  iconColor: string;

  onPress?: () => void;
}


const DashboardCard = ({
  icon,
  title,
  value,
  subtitle,
  iconBackground,
  iconColor,
  onPress,
}: DashboardCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="mb-3 w-[48%] rounded-3xl border border-[#E5E8F0] bg-white p-4"
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-2xl ${iconBackground}`}
      >
        <Ionicons
          name={icon}
          size={22}
          color={iconColor}
        />
      </View>

      <Text className="mt-4 text-[10px] font-extrabold tracking-wider text-[#606F88]">
        {title}
      </Text>

      <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
        {value}
      </Text>

      <View className="mt-1 flex-row items-center">
        <Text className="flex-1 text-xs text-[#606F88]">
          {subtitle}
        </Text>

        {onPress ? (
          <Ionicons
            name="chevron-forward"
            size={14}
            color="#8A94A6"
          />
        ) : null}
      </View>
    </Pressable>
  );
};


/* =====================================================
   QUICK ACTION
===================================================== */

interface QuickActionProps {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  title: string;

  description: string;

  onPress: () => void;
}


const QuickAction = ({
  icon,
  title,
  description,
  onPress,
}: QuickActionProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">
        <Ionicons
          name={icon}
          size={22}
          color="#4355D8"
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-sm font-extrabold text-[#15213B]">
          {title}
        </Text>

        <Text className="mt-1 text-xs text-[#606F88]">
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color="#8A94A6"
      />
    </Pressable>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminDashboardScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    const user =
      useAppSelector(
        (state) =>
          state.auth.user
      );


    /* ===================================================
       STATE
    =================================================== */

    const [
      dashboard,
      setDashboard,
    ] =
      useState<
        SchoolAdminDashboardData
      >(
        initialDashboardData
      );

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
       LOAD REAL DASHBOARD DATA
    =================================================== */

    const loadDashboard =
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
              setLoading(
                true
              );
            }

            setError(null);

            const data =
              await getSchoolAdminDashboardApi();

            console.log(
              "SCHOOL ADMIN DASHBOARD:",
              {
                students:
                  data.students
                    .length,

                teachers:
                  data.teachers
                    .length,

                sessions:
                  data.sessions
                    .length,

                classes:
                  data.classes
                    .length,

                sections:
                  data.sections
                    .length,

                subjects:
                  data.subjects
                    .length,

                homework:
                  data.homework
                    .length,
              }
            );

            setDashboard(
              data
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SCHOOL ADMIN DASHBOARD ERROR:",
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
                "Dashboard data load nahi ho saka."
            );
          } finally {
            setLoading(
              false
            );

            setRefreshing(
              false
            );
          }
        },
        []
      );


    /*
     * Dashboard jab bhi focus hoga,
     * latest school data fetch hoga.
     */

    useFocusEffect(
      useCallback(() => {
        loadDashboard();
      }, [loadDashboard])
    );


    /* ===================================================
       CURRENT SESSION
    =================================================== */

    const currentSession =
      useMemo(() => {
        return (
          dashboard.sessions.find(
            (session) =>
              session.isCurrent ===
              true
          ) ??
          dashboard.sessions[0] ??
          null
        );
      }, [
        dashboard.sessions,
      ]);


    /* ===================================================
       ACTIVE HOMEWORK
    =================================================== */

    const activeHomeworkCount =
      useMemo(() => {
        return dashboard.homework.filter(
          (item) => {
            const status =
              (
                item.status ??
                "ACTIVE"
              ).toUpperCase();

            return (
              status !==
                "CLOSED" &&
              status !==
                "INACTIVE"
            );
          }
        ).length;
      }, [
        dashboard.homework,
      ]);


    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-20 w-20 items-center justify-center rounded-[26px] bg-[#4355D8]">
            <Ionicons
              name="business"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <ActivityIndicator
            className="mt-6"
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading school dashboard...
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
        className="flex-1 bg-[#4355D8]"
      >

        <View className="flex-1 bg-[#F7F7FB]">

          {/* =============================================
              HEADER
          ============================================= */}

          <View className="rounded-b-[35px] bg-[#4355D8] px-5 pb-16 pt-6">

            <View className="flex-row items-start justify-between">

              <View className="flex-1">

                <Text className="text-xs font-extrabold tracking-widest text-white/70">
                  SCHOOL ADMIN
                </Text>

                <Text className="mt-2 text-3xl font-extrabold text-white">
                  Hi,{" "}
                  {user?.name ??
                    "Admin"}
                </Text>

                <Text className="mt-2 text-sm leading-5 text-white/70">
                  Monitor and manage your school
                  from anywhere.
                </Text>

              </View>


              <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color="#FFFFFF"
                />

              </Pressable>

            </View>

          </View>


          {/* =============================================
              CONTENT
          ============================================= */}

          <ScrollView
            className="-mt-8"
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
                  loadDashboard(
                    true
                  )
                }
                tintColor="#4355D8"
                colors={[
                  "#4355D8",
                ]}
              />
            }
          >

            {/* ===========================================
                SESSION CARD
            =========================================== */}

            <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

              <View className="flex-row items-center">

                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                  <Ionicons
                    name="calendar-outline"
                    size={23}
                    color="#4355D8"
                  />

                </View>

                <View className="ml-4 flex-1">

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    CURRENT SESSION
                  </Text>

                  <Text className="mt-1 text-lg font-extrabold text-[#15213B]">
                    {currentSession
                      ?.name ??
                      "No current session"}
                  </Text>

                </View>

                {currentSession ? (
                  <View className="rounded-full bg-[#E7F7F1] px-3 py-1.5">

                    <Text className="text-[10px] font-extrabold text-[#24976D]">
                      ACTIVE
                    </Text>

                  </View>
                ) : null}

              </View>

            </View>


            {/* ===========================================
                ERROR
            =========================================== */}

            {error ? (
              <View className="mt-4 flex-row items-start rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC4C5A"
                />

                <Text className="ml-2 flex-1 text-xs font-semibold leading-5 text-[#DC4C5A]">
                  {error}
                </Text>

              </View>
            ) : null}


            {/* ===========================================
                SCHOOL OVERVIEW
            =========================================== */}

            <View className="mt-7">

              <View className="mb-4">

                <Text className="text-xl font-extrabold text-[#15213B]">
                  School Overview
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Live data from your school
                </Text>

              </View>


              <View className="flex-row flex-wrap justify-between">

                {/* STUDENTS */}

                <DashboardCard
                  icon="people-outline"
                  title="STUDENTS"
                  value={
                    dashboard
                      .students
                      .length
                  }
                  subtitle="Total students"
                  iconBackground="bg-[#EEF0FF]"
                  iconColor="#4355D8"
                  onPress={() =>
                    navigation.navigate(
                      "SchoolAdminTabs",
                      {
                        screen:
                          "Students",
                      } as never
                    )
                  }
                />


                {/* TEACHERS */}

                <DashboardCard
                  icon="school-outline"
                  title="TEACHERS"
                  value={
                    dashboard
                      .teachers
                      .length
                  }
                  subtitle="Total teachers"
                  iconBackground="bg-[#E7F7F1]"
                  iconColor="#24976D"
                  onPress={() =>
                    navigation.navigate(
                      "SchoolAdminTabs",
                      {
                        screen:
                          "Teachers",
                      } as never
                    )
                  }
                />


                {/* CLASSES */}

                <DashboardCard
                  icon="library-outline"
                  title="CLASSES"
                  value={
                    dashboard
                      .classes
                      .length
                  }
                  subtitle="Academic classes"
                  iconBackground="bg-[#FFF2DE]"
                  iconColor="#E59A2F"
                  onPress={() =>
                    navigation.navigate(
                      "Classes"
                    )
                  }
                />


                {/* SECTIONS */}

                <DashboardCard
                  icon="grid-outline"
                  title="SECTIONS"
                  value={
                    dashboard
                      .sections
                      .length
                  }
                  subtitle="School sections"
                  iconBackground="bg-[#F3EBFF]"
                  iconColor="#7B55C7"
                  onPress={() =>
                    navigation.navigate(
                      "Sections"
                    )
                  }
                />


                {/* SUBJECTS */}

                <DashboardCard
                  icon="book-outline"
                  title="SUBJECTS"
                  value={
                    dashboard
                      .subjects
                      .length
                  }
                  subtitle="Total subjects"
                  iconBackground="bg-[#E8F4FF]"
                  iconColor="#3D8BC9"
                  onPress={() =>
                    navigation.navigate(
                      "Subjects"
                    )
                  }
                />


                {/* HOMEWORK */}

                <DashboardCard
                  icon="document-text-outline"
                  title="HOMEWORK"
                  value={
                    activeHomeworkCount
                  }
                  subtitle="Active homework"
                  iconBackground="bg-[#FDECEE]"
                  iconColor="#DC4C5A"
                  onPress={() =>
                    navigation.navigate(
                      "Homework"
                    )
                  }
                />

              </View>

            </View>


            {/* ===========================================
                QUICK MANAGEMENT
            =========================================== */}

            <View className="mt-6">

              <Text className="mb-1 text-xl font-extrabold text-[#15213B]">
                Quick Management
              </Text>

              <Text className="mb-4 text-xs text-[#606F88]">
                Important school administration actions
              </Text>


              {/* SUBJECT ASSIGNMENT */}

              <QuickAction
                icon="git-network-outline"
                title="Subject Assignment"
                description="Assign subjects and classes to teachers"
                onPress={() =>
                  navigation.navigate(
                    "SubjectAssignment"
                  )
                }
              />


              {/* ATTENDANCE */}

              <QuickAction
                icon="checkmark-circle-outline"
                title="Attendance"
                description="View school attendance records"
                onPress={() =>
                  navigation.navigate(
                    "Attendance"
                  )
                }
              />


              {/* TIMETABLE */}

              <QuickAction
                icon="time-outline"
                title="Timetable"
                description="View academic timetable"
                onPress={() =>
                  navigation.navigate(
                    "Timetable"
                  )
                }
              />


              {/* ACADEMICS */}

              <QuickAction
                icon="library-outline"
                title="Academic Management"
                description="Sessions, classes, sections and subjects"
                onPress={() =>
                  navigation.navigate(
                    "SchoolAdminTabs",
                    {
                      screen:
                        "Academics",
                    } as never
                  )
                }
              />

            </View>


            {/* ===========================================
                ACADEMIC SUMMARY
            =========================================== */}

            <View className="mt-6 rounded-3xl bg-[#15213B] p-5">

              <View className="flex-row items-center justify-between">

                <View>

                  <Text className="text-xs font-bold tracking-wider text-white/60">
                    ACADEMIC SETUP
                  </Text>

                  <Text className="mt-1 text-lg font-extrabold text-white">
                    School Structure
                  </Text>

                </View>

                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10">

                  <Ionicons
                    name="layers-outline"
                    size={22}
                    color="#FFFFFF"
                  />

                </View>

              </View>


              <View className="mt-5 flex-row justify-between">

                <View>

                  <Text className="text-2xl font-extrabold text-white">
                    {
                      dashboard
                        .sessions
                        .length
                    }
                  </Text>

                  <Text className="mt-1 text-[10px] text-white/60">
                    Sessions
                  </Text>

                </View>


                <View>

                  <Text className="text-2xl font-extrabold text-white">
                    {
                      dashboard
                        .classes
                        .length
                    }
                  </Text>

                  <Text className="mt-1 text-[10px] text-white/60">
                    Classes
                  </Text>

                </View>


                <View>

                  <Text className="text-2xl font-extrabold text-white">
                    {
                      dashboard
                        .sections
                        .length
                    }
                  </Text>

                  <Text className="mt-1 text-[10px] text-white/60">
                    Sections
                  </Text>

                </View>


                <View>

                  <Text className="text-2xl font-extrabold text-white">
                    {
                      dashboard
                        .subjects
                        .length
                    }
                  </Text>

                  <Text className="mt-1 text-[10px] text-white/60">
                    Subjects
                  </Text>

                </View>

              </View>

            </View>

          </ScrollView>

        </View>

      </SafeAreaView>
    );
  };


export default SchoolAdminDashboardScreen;