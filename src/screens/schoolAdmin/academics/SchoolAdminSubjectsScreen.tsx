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
  getAcademicSubjectsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicSubject,
} from "types/schoolAdmin.types";


const SchoolAdminSubjectsScreen =
  () => {
    const navigation =
      useNavigation();

    const [
      subjects,
      setSubjects,
    ] = useState<
      AcademicSubject[]
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


    const loadSubjects =
      useCallback(
        async (
          refresh = false
        ) => {
          try {
            refresh
              ? setRefreshing(true)
              : setLoading(true);

            setError(null);

            const data =
              await getAcademicSubjectsApi();

            setSubjects(data);

            console.log(
              "SCHOOL ADMIN SUBJECTS:",
              data.length
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SUBJECTS ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Subjects load nahi ho sake."
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
        loadSubjects();
      }, [loadSubjects])
    );


    const filteredSubjects =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return subjects;
        }

        return subjects.filter(
          (subject) =>
            subject.name
              ?.toLowerCase()
              .includes(query) ||
            subject.code
              ?.toLowerCase()
              .includes(query)
        );
      }, [
        search,
        subjects,
      ]);


    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
          <ActivityIndicator
            size="large"
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
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#15213B"
            />
          </Pressable>

          <View className="ml-4">
            <Text className="text-xl font-extrabold text-[#15213B]">
              Subjects
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {subjects.length} subjects
            </Text>
          </View>

        </View>


        <View className="px-5 pb-4">

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
              placeholder="Search subject..."
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


        <ScrollView
          contentContainerClassName="px-5 pb-10"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadSubjects(true)
              }
              colors={[
                "#4355D8",
              ]}
            />
          }
        >

          {error ? (
            <View className="mb-4 rounded-2xl bg-[#FDECEE] p-4">
              <Text className="text-sm text-[#DC4C5A]">
                {error}
              </Text>
            </View>
          ) : null}


          {filteredSubjects.map(
            (subject) => (
              <View
                key={subject._id}
                className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-5"
              >

                <View className="flex-row items-center">

                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F4FF]">
                    <Ionicons
                      name="book-outline"
                      size={23}
                      color="#3D8BC9"
                    />
                  </View>


                  <View className="ml-4 flex-1">

                    <Text className="text-base font-extrabold text-[#15213B]">
                      {subject.name}
                    </Text>

                    {subject.code ? (
                      <Text className="mt-1 text-xs font-semibold text-[#606F88]">
                        Code:{" "}
                        {subject.code}
                      </Text>
                    ) : null}

                  </View>


                  {subject.status ? (
                    <Text className="text-[9px] font-extrabold text-[#24976D]">
                      {subject.status}
                    </Text>
                  ) : null}

                </View>


                {subject.description ? (
                  <Text className="mt-4 border-t border-[#EEF0F5] pt-4 text-xs leading-5 text-[#606F88]">
                    {subject.description}
                  </Text>
                ) : null}

              </View>
            )
          )}


          {!error &&
          filteredSubjects.length ===
            0 ? (
            <View className="mt-20 items-center">

              <Ionicons
                name="book-outline"
                size={45}
                color="#8A94A6"
              />

              <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
                {search
                  ? "No subject found"
                  : "No subjects"}
              </Text>

            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminSubjectsScreen;