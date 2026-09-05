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
  getSchoolHomeworkApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  SchoolAdminHomework,
} from "types/schoolAdmin.types";


/* =====================================================
   HELPERS
===================================================== */

const getRelationName = (
  value:
    | string
    | {
        _id: string;
        name?: string;
      }
    | undefined,
  fallback: string
): string => {
  if (
    value &&
    typeof value === "object"
  ) {
    return (
      value.name ??
      fallback
    );
  }

  return fallback;
};


const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


/* =====================================================
   STATUS BADGE
===================================================== */

interface StatusBadgeProps {
  status?: string;
}


const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const value =
    status
      ?.toUpperCase() ??
    "UNKNOWN";


  if (value === "ACTIVE") {
    return (
      <View className="rounded-full bg-[#E7F7F1] px-3 py-1.5">

        <Text className="text-[9px] font-extrabold text-[#24976D]">
          ACTIVE
        </Text>

      </View>
    );
  }


  if (value === "CLOSED") {
    return (
      <View className="rounded-full bg-[#EEF0F5] px-3 py-1.5">

        <Text className="text-[9px] font-extrabold text-[#606F88]">
          CLOSED
        </Text>

      </View>
    );
  }


  if (value === "INACTIVE") {
    return (
      <View className="rounded-full bg-[#FDECEE] px-3 py-1.5">

        <Text className="text-[9px] font-extrabold text-[#DC4C5A]">
          INACTIVE
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
   HOMEWORK CARD
===================================================== */

interface HomeworkCardProps {
  homework: SchoolAdminHomework;
}


const HomeworkCard = ({
  homework,
}: HomeworkCardProps) => {
  const subjectName =
    getRelationName(
      homework.subjectId,
      "Subject"
    );

  const className =
    getRelationName(
      homework.classId,
      "Class"
    );

  const sectionName =
    getRelationName(
      homework.sectionId,
      "Section"
    );

  const teacherName =
    getRelationName(
      homework.teacherId,
      "Not available"
    );


  return (
    <View className="mb-4 rounded-3xl border border-[#E5E8F0] bg-white p-5">

      {/* TOP */}

      <View className="flex-row items-start">

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">

          <Ionicons
            name="document-text-outline"
            size={23}
            color="#4355D8"
          />

        </View>


        <View className="ml-3 flex-1">

          <Text
            numberOfLines={2}
            className="text-base font-extrabold leading-5 text-[#15213B]"
          >
            {homework.title}
          </Text>


          <View className="mt-2 flex-row items-center">

            <Ionicons
              name="book-outline"
              size={13}
              color="#606F88"
            />

            <Text className="ml-1.5 text-xs font-semibold text-[#606F88]">
              {subjectName}
            </Text>

          </View>

        </View>


        <StatusBadge
          status={
            homework.status
          }
        />

      </View>


      {/* DESCRIPTION */}

      {homework.description ? (
        <Text
          numberOfLines={3}
          className="mt-4 text-xs leading-5 text-[#606F88]"
        >
          {homework.description}
        </Text>
      ) : null}


      {/* CLASS / SECTION */}

      <View className="mt-4 flex-row border-t border-[#EEF0F5] pt-4">

        <View className="flex-1">

          <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
            CLASS
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-xs font-bold text-[#33415C]"
          >
            {className}
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
            {sectionName}
          </Text>

        </View>


        <View className="flex-1">

          <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
            DUE DATE
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-xs font-bold text-[#33415C]"
          >
            {formatDate(
              homework.dueDate
            )}
          </Text>

        </View>

      </View>


      {/* TEACHER */}

      {homework.teacherId ? (
        <View className="mt-4 flex-row items-center rounded-2xl bg-[#F7F7FB] p-3">

          <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">

            <Ionicons
              name="person-outline"
              size={17}
              color="#4355D8"
            />

          </View>


          <View className="ml-3 flex-1">

            <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
              ASSIGNED BY
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 text-xs font-bold text-[#33415C]"
            >
              {teacherName}
            </Text>

          </View>

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolHomeworkScreen =
  () => {
    const navigation =
      useNavigation();


    /* ===================================================
       STATE
    =================================================== */

    const [
      homework,
      setHomework,
    ] = useState<
      SchoolAdminHomework[]
    >([]);

    const [
      search,
      setSearch,
    ] = useState("");

    const [
      selectedStatus,
      setSelectedStatus,
    ] = useState<
      "ALL" | "ACTIVE" | "CLOSED"
    >("ALL");

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
       LOAD HOMEWORK
    =================================================== */

    const loadHomework =
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
              await getSchoolHomeworkApi();


            console.log(
              "SCHOOL ADMIN HOMEWORK:",
              data.length
            );


            setHomework(
              data
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SCHOOL ADMIN HOMEWORK ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );


            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Homework load nahi ho saka."
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
        loadHomework();
      }, [loadHomework])
    );


    /* ===================================================
       COUNTS
    =================================================== */

    const activeCount =
      useMemo(() => {
        return homework.filter(
          (item) =>
            item.status
              ?.toUpperCase() ===
            "ACTIVE"
        ).length;
      }, [homework]);


    const closedCount =
      useMemo(() => {
        return homework.filter(
          (item) =>
            item.status
              ?.toUpperCase() ===
            "CLOSED"
        ).length;
      }, [homework]);


    /* ===================================================
       FILTER HOMEWORK
    =================================================== */

    const filteredHomework =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();


        return homework.filter(
          (item) => {
            const status =
              item.status
                ?.toUpperCase() ??
              "";


            const matchesStatus =
              selectedStatus ===
                "ALL" ||
              status ===
                selectedStatus;


            if (!matchesStatus) {
              return false;
            }


            if (!query) {
              return true;
            }


            const subject =
              getRelationName(
                item.subjectId,
                ""
              ).toLowerCase();


            const className =
              getRelationName(
                item.classId,
                ""
              ).toLowerCase();


            const section =
              getRelationName(
                item.sectionId,
                ""
              ).toLowerCase();


            const teacher =
              getRelationName(
                item.teacherId,
                ""
              ).toLowerCase();


            return (
              item.title
                ?.toLowerCase()
                .includes(query) ||
              item.description
                ?.toLowerCase()
                .includes(query) ||
              subject.includes(
                query
              ) ||
              className.includes(
                query
              ) ||
              section.includes(
                query
              ) ||
              teacher.includes(
                query
              )
            );
          }
        );
      }, [
        homework,
        search,
        selectedStatus,
      ]);


    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

            <Ionicons
              name="document-text-outline"
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
            Loading homework...
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
              Homework
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              Monitor school homework
            </Text>

          </View>


          <View className="rounded-2xl bg-[#EEF0FF] px-3 py-2">

            <Text className="text-sm font-extrabold text-[#4355D8]">
              {homework.length}
            </Text>

          </View>

        </View>


        {/* ===============================================
            SEARCH
        =============================================== */}

        <View className="px-5">

          <View className="flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4">

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
              placeholder="Search homework..."
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


        {/* ===============================================
            FILTERS
        =============================================== */}

        <View className="px-5 py-4">

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
          >

            <Pressable
              onPress={() =>
                setSelectedStatus(
                  "ALL"
                )
              }
              className={
                selectedStatus ===
                "ALL"
                  ? "mr-2 rounded-full bg-[#15213B] px-4 py-2.5"
                  : "mr-2 rounded-full border border-[#E5E8F0] bg-white px-4 py-2.5"
              }
            >

              <Text
                className={
                  selectedStatus ===
                  "ALL"
                    ? "text-xs font-extrabold text-white"
                    : "text-xs font-bold text-[#606F88]"
                }
              >
                All ({homework.length})
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setSelectedStatus(
                  "ACTIVE"
                )
              }
              className={
                selectedStatus ===
                "ACTIVE"
                  ? "mr-2 rounded-full bg-[#24976D] px-4 py-2.5"
                  : "mr-2 rounded-full border border-[#E5E8F0] bg-white px-4 py-2.5"
              }
            >

              <Text
                className={
                  selectedStatus ===
                  "ACTIVE"
                    ? "text-xs font-extrabold text-white"
                    : "text-xs font-bold text-[#606F88]"
                }
              >
                Active ({activeCount})
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setSelectedStatus(
                  "CLOSED"
                )
              }
              className={
                selectedStatus ===
                "CLOSED"
                  ? "rounded-full bg-[#606F88] px-4 py-2.5"
                  : "rounded-full border border-[#E5E8F0] bg-white px-4 py-2.5"
              }
            >

              <Text
                className={
                  selectedStatus ===
                  "CLOSED"
                    ? "text-xs font-extrabold text-white"
                    : "text-xs font-bold text-[#606F88]"
                }
              >
                Closed ({closedCount})
              </Text>

            </Pressable>

          </ScrollView>

        </View>


        {/* ===============================================
            ERROR
        =============================================== */}

        {error ? (
          <View className="mx-5 mb-4 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

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
                loadHomework()
              }
              className="mt-3 self-start"
            >

              <Text className="text-xs font-extrabold text-[#4355D8]">
                Try Again
              </Text>

            </Pressable>

          </View>
        ) : null}


        {/* ===============================================
            LIST
        =============================================== */}

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
                loadHomework(true)
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {filteredHomework.length >
          0 ? (
            filteredHomework.map(
              (item) => (
                <HomeworkCard
                  key={item._id}
                  homework={item}
                />
              )
            )
          ) : (
            <View className="mt-14 items-center">

              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

                <Ionicons
                  name="document-text-outline"
                  size={35}
                  color="#4355D8"
                />

              </View>


              <Text className="mt-5 text-lg font-extrabold text-[#15213B]">
                {search
                  ? "No homework found"
                  : selectedStatus ===
                    "ACTIVE"
                  ? "No active homework"
                  : selectedStatus ===
                    "CLOSED"
                  ? "No closed homework"
                  : "No homework"}
              </Text>


              <Text className="mt-2 px-8 text-center text-xs leading-5 text-[#606F88]">
                {search
                  ? "Search ke according koi homework nahi mila."
                  : "School ke liye homework data available nahi hai."}
              </Text>

            </View>
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolHomeworkScreen;