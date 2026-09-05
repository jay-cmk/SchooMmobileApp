import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import api from "../../../api/axios";


import { extractApiData,extractArray,
   getName, } from "utils/studentHelpers";
import { StudentSubject } from "types/student.types";

const StudentSubjectsScreen =
  () => {
    const [
      subjects,
      setSubjects,
    ] = useState<
      StudentSubject[]
    >([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    useEffect(() => {
      const loadSubjects =
        async () => {
          try {
            const response =
              await api.get(
                "/academic/subjects/me"
              );

            const data =
              extractApiData(
                response
              );

            setSubjects(
              extractArray(
                data,
                [
                  "subjects",
                  "assignments",
                ]
              )
            );
          } catch (error: any) {
            console.log(
              "SUBJECT ERROR:",
              error?.response?.data ??
                error?.message
            );
          } finally {
            setLoading(false);
          }
        };

      loadSubjects();
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
        <ScrollView
          contentContainerClassName="px-5 pb-10 pt-5"
        >
          <Text className="text-2xl font-extrabold text-[#15213B]">
            My Subjects
          </Text>

          <Text className="mb-6 mt-1 text-sm text-[#606F88]">
            Subjects assigned
            to your class
          </Text>

          {subjects.map(
            (
              subject,
              index
            ) => (
              <View
                key={
                  subject._id ??
                  String(index)
                }
                className="mb-3 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4"
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color="#4355D8"
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-base font-extrabold text-[#15213B]">
                    {getName(
                      subject.subjectId
                    ) ||
                      getName(
                        subject.subject
                      )}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Teacher:{" "}
                    {getName(
                      subject.teacherId
                    ) ||
                      getName(
                        subject.teacher
                      ) ||
                      "-"}
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    Weekly periods:{" "}
                    {subject.weeklyPeriods ??
                      "-"}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };

export default StudentSubjectsScreen;