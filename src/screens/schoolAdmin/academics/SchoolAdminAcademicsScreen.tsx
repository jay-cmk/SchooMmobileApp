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
  getAcademicClassesApi,
  getAcademicSectionsApi,
  getAcademicSessionsApi,
  getAcademicSubjectsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
  AcademicSubject,
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
   TYPES
===================================================== */

interface AcademicData {
  sessions: AcademicSession[];
  classes: AcademicClass[];
  sections: AcademicSection[];
  subjects: AcademicSubject[];
}


interface AcademicCardProps {
  title: string;
  subtitle: string;
  count: number;

  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  iconBackground: string;
  iconColor: string;

  onPress: () => void;
}


/* =====================================================
   INITIAL DATA
===================================================== */

const initialData: AcademicData = {
  sessions: [],
  classes: [],
  sections: [],
  subjects: [],
};


/* =====================================================
   ACADEMIC CARD
===================================================== */

const AcademicCard = ({
  title,
  subtitle,
  count,
  icon,
  iconBackground,
  iconColor,
  onPress,
}: AcademicCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-3xl border border-[#E5E8F0] bg-white p-5"
    >
      <View className="flex-row items-center">

        <View
          className={`h-14 w-14 items-center justify-center rounded-2xl ${iconBackground}`}
        >
          <Ionicons
            name={icon}
            size={25}
            color={iconColor}
          />
        </View>


        <View className="ml-4 flex-1">

          <Text className="text-base font-extrabold text-[#15213B]">
            {title}
          </Text>

          <Text className="mt-1 text-xs leading-5 text-[#606F88]">
            {subtitle}
          </Text>

        </View>


        <View className="items-end">

          <Text className="text-2xl font-extrabold text-[#15213B]">
            {count}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#8A94A6"
          />

        </View>

      </View>
    </Pressable>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminAcademicsScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();


    /* ===================================================
       STATE
    =================================================== */

    const [
      data,
      setData,
    ] =
      useState<AcademicData>(
        initialData
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
       LOAD ACADEMIC DATA
    =================================================== */

    const loadAcademics =
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
              ]);


            const [
              sessionsResult,
              classesResult,
              sectionsResult,
              subjectsResult,
            ] = results;


            const nextData: AcademicData =
              {
                sessions:
                  sessionsResult.status ===
                  "fulfilled"
                    ? sessionsResult.value
                    : [],

                classes:
                  classesResult.status ===
                  "fulfilled"
                    ? classesResult.value
                    : [],

                sections:
                  sectionsResult.status ===
                  "fulfilled"
                    ? sectionsResult.value
                    : [],

                subjects:
                  subjectsResult.status ===
                  "fulfilled"
                    ? subjectsResult.value
                    : [],
              };


            console.log(
              "SCHOOL ADMIN ACADEMICS:",
              {
                sessions:
                  nextData.sessions
                    .length,

                classes:
                  nextData.classes
                    .length,

                sections:
                  nextData.sections
                    .length,

                subjects:
                  nextData.subjects
                    .length,
              }
            );


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
                  ];

                  console.log(
                    `SCHOOL ADMIN ACADEMICS ${names[index]} ERROR:`,
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


            setData(nextData);


            const failed =
              results.filter(
                (result) =>
                  result.status ===
                  "rejected"
              ).length;


            if (
              failed ===
              results.length
            ) {
              setError(
                "Academic data load nahi ho saka."
              );
            } else if (
              failed > 0
            ) {
              setError(
                "Kuch academic data load nahi hua. Pull down karke refresh karein."
              );
            }
          } catch (
            requestError: any
          ) {
            console.log(
              "SCHOOL ADMIN ACADEMICS ERROR:",
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
        []
      );


    /* ===================================================
       REFRESH ON FOCUS
    =================================================== */

    useFocusEffect(
      useCallback(() => {
        loadAcademics();
      }, [loadAcademics])
    );


    /* ===================================================
       CURRENT SESSION
    =================================================== */

    const currentSession =
      useMemo(() => {
        return (
          data.sessions.find(
            (session) =>
              session.isCurrent ===
              true
          ) ??
          data.sessions[0] ??
          null
        );
      }, [
        data.sessions,
      ]);


    /* ===================================================
       TOTAL STRUCTURE
    =================================================== */

    const totalStructure =
      useMemo(() => {
        return (
          data.classes.length +
          data.sections.length +
          data.subjects.length
        );
      }, [
        data.classes,
        data.sections,
        data.subjects,
      ]);


    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

            <Ionicons
              name="library-outline"
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
            Loading academics...
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

        <View className="px-5 pb-5 pt-4">

          <Text className="text-3xl font-extrabold text-[#15213B]">
            Academics
          </Text>

          <Text className="mt-1 text-sm text-[#606F88]">
            Manage your school academic structure
          </Text>

        </View>


        <ScrollView
          className="flex-1"
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
                loadAcademics(true)
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {/* =============================================
              CURRENT SESSION
          ============================================= */}

          <Pressable
            onPress={() =>
              navigation.navigate(
                "Sessions"
              )
            }
            className="rounded-3xl bg-[#4355D8] p-5"
          >

            <View className="flex-row items-center">

              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

                <Ionicons
                  name="calendar-outline"
                  size={23}
                  color="#FFFFFF"
                />

              </View>


              <View className="ml-4 flex-1">

                <Text className="text-[10px] font-extrabold tracking-widest text-white/60">
                  CURRENT SESSION
                </Text>

                <Text className="mt-1 text-xl font-extrabold text-white">
                  {currentSession
                    ?.name ??
                    "No current session"}
                </Text>

                <Text className="mt-1 text-xs text-white/70">
                  {data.sessions.length}{" "}
                  academic session
                  {data.sessions.length ===
                  1
                    ? ""
                    : "s"}
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={21}
                color="#FFFFFF"
              />

            </View>

          </Pressable>


          {/* =============================================
              ERROR
          ============================================= */}

          {error ? (
            <View className="mt-4 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

              <View className="flex-row items-start">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC4C5A"
                />

                <Text className="ml-2 flex-1 text-xs font-semibold leading-5 text-[#DC4C5A]">
                  {error}
                </Text>

              </View>


              <Pressable
                onPress={() =>
                  loadAcademics()
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

          <View className="mt-6 flex-row">

            <View className="mr-2 flex-1 rounded-2xl border border-[#E5E8F0] bg-white p-4">

              <Text className="text-2xl font-extrabold text-[#4355D8]">
                {data.sessions.length}
              </Text>

              <Text className="mt-1 text-[10px] font-bold tracking-wider text-[#606F88]">
                SESSIONS
              </Text>

            </View>


            <View className="ml-2 flex-1 rounded-2xl border border-[#E5E8F0] bg-white p-4">

              <Text className="text-2xl font-extrabold text-[#24976D]">
                {totalStructure}
              </Text>

              <Text className="mt-1 text-[10px] font-bold tracking-wider text-[#606F88]">
                STRUCTURE
              </Text>

            </View>

          </View>


          {/* =============================================
              ACADEMIC STRUCTURE
          ============================================= */}

          <View className="mb-4 mt-7">

            <Text className="text-xl font-extrabold text-[#15213B]">
              Academic Structure
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              View school academic configuration
            </Text>

          </View>


          {/* SESSIONS */}

          <AcademicCard
            icon="calendar-outline"
            title="Academic Sessions"
            subtitle="View school academic years and current session"
            count={
              data.sessions.length
            }
            iconBackground="bg-[#EEF0FF]"
            iconColor="#4355D8"
            onPress={() =>
              navigation.navigate(
                "Sessions"
              )
            }
          />


          {/* CLASSES */}

          <AcademicCard
            icon="library-outline"
            title="Classes"
            subtitle="View classes available in your school"
            count={
              data.classes.length
            }
            iconBackground="bg-[#FFF2DE]"
            iconColor="#E59A2F"
            onPress={() =>
              navigation.navigate(
                "Classes"
              )
            }
          />


          {/* SECTIONS */}

          <AcademicCard
            icon="grid-outline"
            title="Sections"
            subtitle="View sections assigned to school classes"
            count={
              data.sections.length
            }
            iconBackground="bg-[#F3EBFF]"
            iconColor="#7B55C7"
            onPress={() =>
              navigation.navigate(
                "Sections"
              )
            }
          />


          {/* SUBJECTS */}

          <AcademicCard
            icon="book-outline"
            title="Subjects"
            subtitle="View subjects available for students"
            count={
              data.subjects.length
            }
            iconBackground="bg-[#E8F4FF]"
            iconColor="#3D8BC9"
            onPress={() =>
              navigation.navigate(
                "Subjects"
              )
            }
          />


          {/* =============================================
              SUBJECT ASSIGNMENT
          ============================================= */}

          <View className="mb-4 mt-4">

            <Text className="text-xl font-extrabold text-[#15213B]">
              Teacher Assignment
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              Manage teaching responsibilities
            </Text>

          </View>


          <Pressable
            onPress={() =>
              navigation.navigate(
                "SubjectAssignment"
              )
            }
            className="overflow-hidden rounded-3xl bg-[#15213B] p-5"
          >

            <View className="flex-row items-center">

              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                <Ionicons
                  name="git-network-outline"
                  size={27}
                  color="#FFFFFF"
                />

              </View>


              <View className="ml-4 flex-1">

                <Text className="text-base font-extrabold text-white">
                  Subject Assignment
                </Text>

                <Text className="mt-1 text-xs leading-5 text-white/60">
                  Assign subject and class responsibilities to teachers
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={21}
                color="#FFFFFF"
              />

            </View>

          </Pressable>

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminAcademicsScreen;