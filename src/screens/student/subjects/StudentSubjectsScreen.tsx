


import React, {
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
  getMySubjects,
} from "../../../features/student/studentSubjectSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/hook";
import { StudentSubjectItem } from "@/features/student/studentSubject.api";




type SubjectFilter =
  | "ALL"
  | "CLASS"
  | "ELECTIVE";


const relationName = (
  value:
    | string
    | {
        _id: string;
        name: string;
      }
    | undefined
): string => {
  if (
    !value ||
    typeof value === "string"
  ) {
    return "-";
  }

  return value.name || "-";
};


const prettyText = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};


const StudentSubjectsScreen =
  () => {
    const dispatch =
      useAppDispatch();

    const {
      student,
      enrollment,
      subjects,
      loading,
      error,
      initialized,
    } = useAppSelector(
      (state) =>
        state.studentSubjects
    );

    const [
      selectedFilter,
      setSelectedFilter,
    ] = useState<SubjectFilter>(
      "ALL"
    );


    useEffect(() => {
      dispatch(
        getMySubjects()
      );
    }, [dispatch]);


    const classSubjectCount =
      useMemo(
        () =>
          subjects.filter(
            (item) =>
              item.enrollmentType ===
              "CLASS"
          ).length,
        [subjects]
      );

    const electiveSubjectCount =
      useMemo(
        () =>
          subjects.filter(
            (item) =>
              item.enrollmentType ===
              "ELECTIVE"
          ).length,
        [subjects]
      );

    const filteredSubjects =
      useMemo(() => {
        if (
          selectedFilter ===
          "ALL"
        ) {
          return subjects;
        }

        return subjects.filter(
          (item) =>
            item.enrollmentType ===
            selectedFilter
        );
      }, [
        subjects,
        selectedFilter,
      ]);

    const handleRefresh =
      () => {
        dispatch(
          getMySubjects()
        );
      };


    if (
      loading &&
      !initialized
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F7FB]">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#4355D8]">
            <Ionicons
              name="book-outline"
              size={36}
              color="#FFFFFF"
            />
          </View>

          <ActivityIndicator
            className="mt-6"
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#667085]">
            Loading your subjects...
          </Text>
        </SafeAreaView>
      );
    }


    if (
      error &&
      subjects.length === 0
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F7FB] px-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color="#DC2626"
            />
          </View>

          <Text className="mt-5 text-center text-xl font-extrabold text-[#15213B]">
            Unable to load subjects
          </Text>

          <Text className="mt-2 text-center text-sm leading-6 text-[#667085]">
            {error}
          </Text>

          <Pressable
            onPress={handleRefresh}
            className="mt-6 flex-row items-center rounded-xl bg-[#4355D8] px-6 py-3.5 active:opacity-80"
          >
            <Ionicons
              name="refresh-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text className="ml-2 text-sm font-bold text-white">
              Try Again
            </Text>
          </Pressable>
        </SafeAreaView>
      );
    }


    return (
      <SafeAreaView className="flex-1 bg-[#F6F7FB]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={
                loading &&
                initialized
              }
              onRefresh={handleRefresh}
              colors={["#4355D8"]}
              tintColor="#4355D8"
            />
          }
          contentContainerClassName="px-5 pb-10 pt-5"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-extrabold text-[#15213B]">
                My Subjects
              </Text>

              <Text className="mt-1 text-sm leading-5 text-[#667085]">
                Class subjects and your selected electives
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
              <Ionicons
                name="library-outline"
                size={24}
                color="#4355D8"
              />
            </View>
          </View>


          <View className="mt-6 overflow-hidden rounded-3xl bg-[#4355D8] p-5">
            <View className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

            <Text className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              Current Academic Placement
            </Text>

            <Text className="mt-2 text-xl font-extrabold text-white">
              {relationName(
                enrollment?.classId
              )}
              {"  •  Section "}
              {relationName(
                enrollment?.sectionId
              )}
            </Text>

            <View className="mt-4 flex-row flex-wrap">
              <InfoPill
                icon="person-outline"
                text={
                  student?.name ??
                  "Student"
                }
              />

              <InfoPill
                icon="list-outline"
                text={`Roll ${
                  enrollment?.rollNumber ??
                  student?.rollNumber ??
                  "-"
                }`}
              />

              {enrollment?.stream ? (
                <InfoPill
                  icon="git-branch-outline"
                  text={prettyText(
                    enrollment.stream
                  )}
                />
              ) : null}
            </View>
          </View>


          <View className="mt-5 flex-row">
            <SummaryCard
              label="All Subjects"
              value={subjects.length}
              icon="library-outline"
              color="#4355D8"
              background="#EEF0FF"
            />

            <View className="w-3" />

            <SummaryCard
              label="Electives"
              value={electiveSubjectCount}
              icon="sparkles-outline"
              color="#C2410C"
              background="#FFF7ED"
            />
          </View>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-6"
          >
            <FilterButton
              label={`All (${subjects.length})`}
              active={
                selectedFilter ===
                "ALL"
              }
              onPress={() =>
                setSelectedFilter(
                  "ALL"
                )
              }
            />

            <FilterButton
              label={`Class (${classSubjectCount})`}
              active={
                selectedFilter ===
                "CLASS"
              }
              onPress={() =>
                setSelectedFilter(
                  "CLASS"
                )
              }
            />

            <FilterButton
              label={`Elective (${electiveSubjectCount})`}
              active={
                selectedFilter ===
                "ELECTIVE"
              }
              onPress={() =>
                setSelectedFilter(
                  "ELECTIVE"
                )
              }
            />
          </ScrollView>


          <View className="mt-5">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(
                (item, index) => (
                  <SubjectCard
                    key={
                      item.assignmentId ??
                      item.studentSubjectEnrollmentId ??
                      String(index)
                    }
                    item={item}
                  />
                )
              )
            ) : (
              <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-6 py-12">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F7]">
                  <Ionicons
                    name="book-outline"
                    size={30}
                    color="#98A2B3"
                  />
                </View>

                <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
                  No subjects found
                </Text>

                <Text className="mt-2 text-center text-sm leading-5 text-[#667085]">
                  No subjects are available for the selected category.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };


const InfoPill = ({
  icon,
  text,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
  text: string;
}) => (
  <View className="mb-2 mr-2 flex-row items-center rounded-full bg-white/15 px-3 py-2">
    <Ionicons
      name={icon}
      size={14}
      color="#FFFFFF"
    />

    <Text className="ml-1.5 text-xs font-bold text-white">
      {text}
    </Text>
  </View>
);


const SummaryCard = ({
  label,
  value,
  icon,
  color,
  background,
}: {
  label: string;
  value: number;
  icon:
    keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
}) => (
  <View className="flex-1 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4">
    <View
      className="h-11 w-11 items-center justify-center rounded-xl"
      style={{
        backgroundColor:
          background,
      }}
    >
      <Ionicons
        name={icon}
        size={21}
        color={color}
      />
    </View>

    <View className="ml-3">
      <Text className="text-xl font-extrabold text-[#15213B]">
        {value}
      </Text>

      <Text className="mt-0.5 text-xs font-semibold text-[#667085]">
        {label}
      </Text>
    </View>
  </View>
);


const FilterButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 rounded-full border px-4 py-2.5 active:opacity-80 ${
      active
        ? "border-[#4355D8] bg-[#4355D8]"
        : "border-[#E1E5EC] bg-white"
    }`}
  >
    <Text
      className={`text-xs font-bold ${
        active
          ? "text-white"
          : "text-[#667085]"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);


const SubjectCard = ({
  item,
}: {
  item: StudentSubjectItem;
}) => {
  const isElective =
    item.enrollmentType ===
    "ELECTIVE";

  const subjectName =
    item.subject?.name ||
    "Unnamed Subject";

  const subjectCode =
    item.subject?.code ||
    "No code";

  const teacherName =
    item.teacher?.name ||
    "Teacher not assigned";

  return (
    <View className="mb-3 overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white p-4">
      <View className="flex-row items-start">
        <View
          className={`h-12 w-12 items-center justify-center rounded-2xl ${
            isElective
              ? "bg-orange-50"
              : "bg-[#EEF0FF]"
          }`}
        >
          <Ionicons
            name={
              isElective
                ? "sparkles-outline"
                : "book-outline"
            }
            size={23}
            color={
              isElective
                ? "#C2410C"
                : "#4355D8"
            }
          />
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-base font-extrabold text-[#15213B]">
                {subjectName}
              </Text>

              <Text className="mt-1 text-xs font-semibold text-[#667085]">
                {subjectCode}
                {item.subject?.subjectType
                  ? ` • ${prettyText(item.subject.subjectType)}`
                  : ""}
              </Text>
            </View>

            <View
              className={`rounded-full px-2.5 py-1 ${
                isElective
                  ? "bg-orange-50"
                  : "bg-indigo-50"
              }`}
            >
              <Text
                className={`text-[10px] font-extrabold ${
                  isElective
                    ? "text-orange-700"
                    : "text-indigo-700"
                }`}
              >
                {isElective
                  ? "ELECTIVE"
                  : "CLASS"}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={18}
              color="#667085"
            />

            <Text className="ml-2 flex-1 text-xs font-semibold text-[#667085]">
              {teacherName}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="time-outline"
              size={17}
              color="#667085"
            />

            <Text className="ml-2 text-xs font-semibold text-[#667085]">
              {item.weeklyPeriods ?? 0}
              {" periods per week"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};


export default
  StudentSubjectsScreen;
