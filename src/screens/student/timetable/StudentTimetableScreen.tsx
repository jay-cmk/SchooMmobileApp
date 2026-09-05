import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import api from "../../../api/axios";


import { TimetableEntry } from "types/student.types";
import { extractApiData,extractArray,
   getName, } from "utils/studentHelpers";

const StudentTimetableScreen =
  () => {
    const navigation =
      useNavigation();

    const [
      timetable,
      setTimetable,
    ] = useState<
      TimetableEntry[]
    >([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    useEffect(() => {
      const load =
        async () => {
          try {
            const response =
              await api.get(
                "/timetable/me"
              );

            const data =
              extractApiData(
                response
              );

            setTimetable(
              extractArray(
                data,
                [
                  "timetable",
                  "entries",
                  "periods",
                  "schedules",
                ]
              )
            );
          } finally {
            setLoading(false);
          }
        };

      load();
    }, []);

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
          <ActivityIndicator
            color="#4355D8"
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">
        <View className="flex-row items-center px-5 py-4">
          <Pressable
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color="#15213B"
            />
          </Pressable>

          <Text className="ml-4 text-xl font-extrabold text-[#15213B]">
            My Timetable
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="px-5 pb-10"
        >
          {timetable.map(
            (
              item,
              index
            ) => (
              <View
                key={
                  item._id ??
                  String(index)
                }
                className="mb-3 flex-row rounded-2xl border border-[#E5E8F0] bg-white p-4"
              >
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Text className="text-lg font-extrabold text-[#4355D8]">
                    {item.periodNumber ??
                      item.period ??
                      index +
                        1}
                  </Text>

                  <Text className="text-[8px] text-[#606F88]">
                    PERIOD
                  </Text>
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-base font-extrabold text-[#15213B]">
                    {getName(
                      item.subjectId
                    ) ||
                      getName(
                        item.subject
                      )}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    {item.day}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    {item.startTime}{" "}
                    -{" "}
                    {item.endTime}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    {getName(
                      item.teacherId
                    ) ||
                      getName(
                        item.teacher
                      )}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };

export default StudentTimetableScreen;