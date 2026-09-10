import React from "react";
import {
  Pressable,
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
import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { TeacherAttendanceStackParamList } from "@/navigation/TeacherAttendanceNavigator";



type AttendanceNavigation =
  NativeStackNavigationProp<TeacherAttendanceStackParamList>;

const TeacherAttendanceHomeScreen = () => {
  const navigation = useNavigation<AttendanceNavigation>();

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10 pt-5"
      >
        <View className="mb-7">
          <Text className="text-3xl font-extrabold text-[#15213B]">
            Attendance
          </Text>
          <Text className="mt-1 text-sm leading-5 text-[#667085]">
            Mark student attendance or review your own attendance records.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("StudentAttendance")}
          className="mb-4 overflow-hidden rounded-3xl bg-[#4355D8] p-5 active:opacity-90"
        >
          <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

          <View className="flex-row items-center">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons
                name="people-outline"
                size={30}
                color="#FFFFFF"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-extrabold text-white">
                Student Attendance
              </Text>
              <Text className="mt-1 text-sm leading-5 text-[#DDE2FF]">
                Select an assigned class and mark students present, absent or on leave.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#FFFFFF"
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("MyAttendance")}
          className="mb-4 rounded-3xl border border-[#DDE2F0] bg-white p-5 active:bg-[#F2F4FF]"
        >
          <View className="flex-row items-center">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF3]">
              <Ionicons
                name="calendar-outline"
                size={30}
                color="#079455"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-extrabold text-[#15213B]">
                My Attendance
              </Text>
              <Text className="mt-1 text-sm leading-5 text-[#667085]">
                View your monthly attendance percentage and daily records.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#667085"
            />
          </View>
        </Pressable>

        <View className="mt-3 flex-row rounded-2xl bg-[#EEF2FF] p-4">
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#4355D8"
          />
          <Text className="ml-3 flex-1 text-sm leading-5 text-[#4453A6]">
            Student attendance and your personal attendance are stored separately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherAttendanceHomeScreen;
