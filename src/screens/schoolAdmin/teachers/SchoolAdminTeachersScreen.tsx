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
  getSchoolTeachersApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  SchoolAdminTeacher,
} from "types/schoolAdmin.types";


/* =====================================================
   TEACHER CARD
===================================================== */

interface TeacherCardProps {
  teacher: SchoolAdminTeacher;
}


const TeacherCard = ({
  teacher,
}: TeacherCardProps) => {
  const active =
    teacher.isActive !== false &&
    (
      !teacher.status ||
      teacher.status.toUpperCase() ===
        "ACTIVE"
    );


  return (
    <View className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-4">

      <View className="flex-row items-center">

        {/* AVATAR */}

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">

          <Text className="text-lg font-extrabold text-[#24976D]">
            {teacher.name
              ?.charAt(0)
              .toUpperCase() ??
              "T"}
          </Text>

        </View>


        {/* INFO */}

        <View className="ml-3 flex-1">

          <Text
            numberOfLines={1}
            className="text-base font-extrabold text-[#15213B]"
          >
            {teacher.name}
          </Text>

          <Text className="mt-1 text-xs text-[#606F88]">
            {teacher.employeeId
              ? `Employee ID: ${teacher.employeeId}`
              : "Teacher"}
          </Text>

        </View>


        {/* STATUS */}

        <View
          className={
            active
              ? "rounded-full bg-[#E7F7F1] px-3 py-1.5"
              : "rounded-full bg-[#FDECEE] px-3 py-1.5"
          }
        >
          <Text
            className={
              active
                ? "text-[9px] font-extrabold text-[#24976D]"
                : "text-[9px] font-extrabold text-[#DC4C5A]"
            }
          >
            {active
              ? "ACTIVE"
              : teacher.status ??
                "INACTIVE"}
          </Text>
        </View>

      </View>


      {/* DETAILS */}

      <View className="mt-4 border-t border-[#EEF0F5] pt-3">

        {teacher.email ? (
          <View className="flex-row items-center">

            <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#F7F7FB]">
              <Ionicons
                name="mail-outline"
                size={15}
                color="#606F88"
              />
            </View>

            <Text
              numberOfLines={1}
              className="ml-3 flex-1 text-xs text-[#606F88]"
            >
              {teacher.email}
            </Text>

          </View>
        ) : null}


        {teacher.mobile ? (
          <View className="mt-2 flex-row items-center">

            <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#F7F7FB]">
              <Ionicons
                name="call-outline"
                size={15}
                color="#606F88"
              />
            </View>

            <Text className="ml-3 text-xs text-[#606F88]">
              {teacher.mobile}
            </Text>

          </View>
        ) : null}


        {teacher.qualification ? (
          <View className="mt-2 flex-row items-center">

            <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#F7F7FB]">
              <Ionicons
                name="school-outline"
                size={15}
                color="#606F88"
              />
            </View>

            <Text className="ml-3 flex-1 text-xs text-[#606F88]">
              {teacher.qualification}
            </Text>

          </View>
        ) : null}

      </View>

    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminTeachersScreen =
  () => {
    const [
      teachers,
      setTeachers,
    ] = useState<
      SchoolAdminTeacher[]
    >([]);

    const [
      search,
      setSearch,
    ] = useState("");

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
       LOAD TEACHERS
    =================================================== */

    const loadTeachers =
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

            const data =
              await getSchoolTeachersApi();

            console.log(
              "SCHOOL ADMIN TEACHERS:",
              data.length
            );

            setTeachers(data);
          } catch (
            requestError: any
          ) {
            console.log(
              "SCHOOL ADMIN TEACHERS ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Teachers load nahi ho sake."
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
        loadTeachers();
      }, [loadTeachers])
    );


    /* ===================================================
       SEARCH
    =================================================== */

    const filteredTeachers =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return teachers;
        }

        return teachers.filter(
          (teacher) =>
            teacher.name
              ?.toLowerCase()
              .includes(query) ||
            teacher.employeeId
              ?.toLowerCase()
              .includes(query) ||
            teacher.email
              ?.toLowerCase()
              .includes(query) ||
            teacher.mobile
              ?.includes(query) ||
            teacher.qualification
              ?.toLowerCase()
              .includes(query)
        );
      }, [
        search,
        teachers,
      ]);


    /* ===================================================
       ACTIVE COUNT
    =================================================== */

    const activeTeachers =
      useMemo(() => {
        return teachers.filter(
          (teacher) =>
            teacher.isActive !==
              false &&
            (
              !teacher.status ||
              teacher.status
                .toUpperCase() ===
                "ACTIVE"
            )
        ).length;
      }, [teachers]);


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
            Loading teachers...
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

        {/* HEADER */}

        <View className="px-5 pb-4 pt-4">

          <Text className="text-3xl font-extrabold text-[#15213B]">
            Teachers
          </Text>

          <Text className="mt-1 text-sm text-[#606F88]">
            Manage and monitor school teachers
          </Text>

        </View>


        {/* SUMMARY */}

        <View className="mb-4 flex-row px-5">

          <View className="mr-2 flex-1 rounded-2xl bg-[#EEF0FF] p-4">

            <Text className="text-2xl font-extrabold text-[#4355D8]">
              {teachers.length}
            </Text>

            <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
              TOTAL TEACHERS
            </Text>

          </View>


          <View className="ml-2 flex-1 rounded-2xl bg-[#E7F7F1] p-4">

            <Text className="text-2xl font-extrabold text-[#24976D]">
              {activeTeachers}
            </Text>

            <Text className="mt-1 text-[10px] font-bold text-[#606F88]">
              ACTIVE
            </Text>

          </View>

        </View>


        {/* SEARCH */}

        <View className="px-5 pb-4">

          <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4">

            <Ionicons
              name="search-outline"
              size={20}
              color="#8A94A6"
            />

            <TextInput
              value={search}
              onChangeText={
                setSearch
              }
              placeholder="Search teacher..."
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


        {/* ERROR */}

        {error ? (
          <View className="mx-5 mb-4 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

            <Text className="text-xs font-semibold text-[#DC4C5A]">
              {error}
            </Text>

            <Pressable
              onPress={() =>
                loadTeachers()
              }
              className="mt-3 self-start"
            >
              <Text className="text-xs font-extrabold text-[#4355D8]">
                Try Again
              </Text>
            </Pressable>

          </View>
        ) : null}


        {/* LIST */}

        <ScrollView
          className="flex-1"
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
                loadTeachers(true)
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {filteredTeachers.length >
          0 ? (
            filteredTeachers.map(
              (teacher) => (
                <TeacherCard
                  key={
                    teacher._id
                  }
                  teacher={
                    teacher
                  }
                />
              )
            )
          ) : (
            <View className="mt-16 items-center">

              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#E7F7F1]">

                <Ionicons
                  name="school-outline"
                  size={34}
                  color="#24976D"
                />

              </View>

              <Text className="mt-5 text-lg font-extrabold text-[#15213B]">
                {search
                  ? "No teacher found"
                  : "No teachers"}
              </Text>

              <Text className="mt-2 text-center text-sm text-[#606F88]">
                {search
                  ? "Try another search."
                  : "No teacher data is available for this school."}
              </Text>

            </View>
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminTeachersScreen;