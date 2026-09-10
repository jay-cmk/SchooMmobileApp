import React, {
  useCallback,
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
  useNavigation,
} from "@react-navigation/native";


import {
  clearTeacherAttendanceError,
  getMyTeacherAttendance,
  setTeacherAttendanceRefreshing,
} from "@/features/teacher/teacherAttendance.slice";

import {
    TeacherAttendanceStatus,
  type MyTeacherAttendanceRecord,
  type TeacherAttendanceStatus as TeacherAttendanceStatusType,
} from "@/features/teacher/teacherAttendance.types";
import { useAppSelector,useAppDispatch } from "@/store/hook";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const now = new Date();

const statusLabel = (
  status: TeacherAttendanceStatusType,
): string =>
  status === TeacherAttendanceStatus.HALF_DAY
    ? "Half Day"
    : status.charAt(0) + status.slice(1).toLowerCase();

const statusColors = (
  status: TeacherAttendanceStatusType,
): {
  background: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
} => {
  switch (status) {
    case TeacherAttendanceStatus.PRESENT:
      return {
        background: "#ECFDF3",
        text: "#067647",
        icon: "checkmark-circle-outline",
      };
    case TeacherAttendanceStatus.ABSENT:
      return {
        background: "#FEF3F2",
        text: "#B42318",
        icon: "close-circle-outline",
      };
    case TeacherAttendanceStatus.LEAVE:
      return {
        background: "#FFFAEB",
        text: "#B54708",
        icon: "calendar-outline",
      };
    default:
      return {
        background: "#F4F3FF",
        text: "#5925DC",
        icon: "time-outline",
      };
  }
};

const formatRecordDate = (value: string): {
  day: string;
  month: string;
  weekday: string;
} => {
  const date = new Date(value);

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-IN", { month: "short" }),
    weekday: date.toLocaleDateString("en-IN", { weekday: "long" }),
  };
};

const MyTeacherAttendanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {
    myAttendance,
    loading,
    refreshing,
    error,
  } = useAppSelector((state) => state.teacherAttendance);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const loadAttendance = useCallback(async () => {
    await dispatch(
      getMyTeacherAttendance({
        month,
        year,
      }),
    );
  }, [dispatch, month, year]);

  useEffect(() => {
    dispatch(clearTeacherAttendanceError());
    loadAttendance();
  }, [dispatch, loadAttendance]);

  const handleRefresh = useCallback(async () => {
    dispatch(setTeacherAttendanceRefreshing(true));
    await loadAttendance();
  }, [dispatch, loadAttendance]);

  const summary = myAttendance?.summary;
  const records = myAttendance?.attendance ?? [];
  const percentage = summary?.attendancePercentage ?? 0;

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (first, second) =>
          new Date(second.date).getTime() -
          new Date(first.date).getTime(),
      ),
    [records],
  );

  if (loading && !myAttendance) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F8FC]">
        <ActivityIndicator size="large" color="#4355D8" />
        <Text className="mt-3 text-sm text-[#667085]">
          Loading your attendance...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4355D8"
            colors={["#4355D8"]}
          />
        }
        contentContainerClassName="pb-10"
      >
        <View className="bg-[#213E80] px-5 pb-7 pt-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View className="ml-3 flex-1">
              <Text className="text-xl font-extrabold text-white">
                My Attendance
              </Text>
              <Text className="mt-0.5 text-xs text-[#DCE5FF]">
                {myAttendance?.teacher.name ?? "Teacher"}
              </Text>
            </View>
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <Pressable
              onPress={() => setYear((previous) => previous - 1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>

            <Text className="text-lg font-extrabold text-white">
              {year}
            </Text>

            <Pressable
              onPress={() => setYear((previous) => previous + 1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            >
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {MONTHS.map((monthName, index) => {
              const value = index + 1;
              const selected = month === value;

              return (
                <Pressable
                  key={monthName}
                  onPress={() => setMonth(value)}
                  className={`mr-2 min-w-14 rounded-xl px-4 py-2.5 ${
                    selected ? "bg-white" : "bg-white/10"
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-bold ${
                      selected ? "text-[#213E80]" : "text-white"
                    }`}
                  >
                    {monthName}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="-mt-1 px-5 pt-5">
          {error && (
            <View className="mb-4 flex-row rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] p-4">
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color="#B42318"
              />
              <Text className="ml-3 flex-1 text-sm leading-5 text-[#B42318]">
                {error}
              </Text>
            </View>
          )}

          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-[#667085]">
                  Attendance Percentage
                </Text>
                <Text
                  className={`mt-1 text-4xl font-extrabold ${
                    percentage < 75
                      ? "text-[#D92D20]"
                      : "text-[#079455]"
                  }`}
                >
                  {percentage.toFixed(1)}%
                </Text>
              </View>

              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EEF0FF]">
                <Ionicons
                  name="stats-chart"
                  size={28}
                  color="#4355D8"
                />
              </View>
            </View>

            <View className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#EAECF0]">
              <View
                className={percentage < 75 ? "h-full bg-[#D92D20]" : "h-full bg-[#12B76A]"}
                style={{
                  width: `${Math.max(0, Math.min(100, percentage))}%`,
                }}
              />
            </View>

            {percentage < 75 && (summary?.totalDays ?? 0) > 0 && (
              <Text className="mt-3 text-xs font-semibold text-[#B42318]">
                Your attendance is below 75% this month.
              </Text>
            )}
          </View>

          <View className="mt-4 flex-row flex-wrap justify-between">
            <SummaryCard label="Present" value={summary?.presentDays ?? 0} color="#079455" background="#ECFDF3" icon="checkmark-circle-outline" />
            <SummaryCard label="Absent" value={summary?.absentDays ?? 0} color="#B42318" background="#FEF3F2" icon="close-circle-outline" />
            <SummaryCard label="Leave" value={summary?.leaveDays ?? 0} color="#B54708" background="#FFFAEB" icon="calendar-outline" />
            <SummaryCard label="Half Day" value={summary?.halfDays ?? 0} color="#5925DC" background="#F4F3FF" icon="time-outline" />
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-[#15213B]">
                Daily Records
              </Text>
              <Text className="mt-0.5 text-xs text-[#667085]">
                {summary?.totalDays ?? 0} marked days
              </Text>
            </View>

            {loading && <ActivityIndicator size="small" color="#4355D8" />}
          </View>

          {sortedRecords.length === 0 ? (
            <View className="mt-4 items-center rounded-3xl border border-[#E4E7EC] bg-white px-5 py-10">
              <Ionicons name="calendar-outline" size={42} color="#98A2B3" />
              <Text className="mt-3 text-base font-extrabold text-[#344054]">
                No attendance records
              </Text>
              <Text className="mt-1 text-center text-sm text-[#667085]">
                No attendance has been recorded for the selected month.
              </Text>
            </View>
          ) : (
            <View className="mt-4">
              {sortedRecords.map((record) => (
                <AttendanceRecordCard key={record._id} record={record} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SummaryCard = ({
  label,
  value,
  color,
  background,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  background: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View
    className="mb-3 w-[48%] rounded-2xl p-4"
    style={{ backgroundColor: background }}
  >
    <View className="flex-row items-center justify-between">
      <Ionicons name={icon} size={22} color={color} />
      <Text className="text-2xl font-extrabold" style={{ color }}>
        {value}
      </Text>
    </View>
    <Text className="mt-3 text-sm font-bold" style={{ color }}>
      {label}
    </Text>
  </View>
);

const AttendanceRecordCard = ({
  record,
}: {
  record: MyTeacherAttendanceRecord;
}) => {
  const date = formatRecordDate(record.date);
  const colors = statusColors(record.status);

  return (
    <View className="mb-3 flex-row rounded-2xl border border-[#E4E7EC] bg-white p-4">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F4F7]">
        <Text className="text-xl font-extrabold text-[#15213B]">
          {date.day}
        </Text>
        <Text className="text-[10px] font-bold uppercase text-[#667085]">
          {date.month}
        </Text>
      </View>

      <View className="ml-4 flex-1">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-base font-extrabold text-[#15213B]">
              {date.weekday}
            </Text>
            <Text className="mt-1 text-xs text-[#667085]">
              In: {record.checkInTime || "—"}  ·  Out: {record.checkOutTime || "—"}
            </Text>
          </View>

          <View
            className="ml-2 flex-row items-center rounded-full px-3 py-1.5"
            style={{ backgroundColor: colors.background }}
          >
            <Ionicons name={colors.icon} size={14} color={colors.text} />
            <Text className="ml-1 text-[11px] font-bold" style={{ color: colors.text }}>
              {statusLabel(record.status)}
            </Text>
          </View>
        </View>

        {record.remarks ? (
          <Text className="mt-2 text-xs leading-4 text-[#667085]">
            {record.remarks}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default MyTeacherAttendanceScreen;
