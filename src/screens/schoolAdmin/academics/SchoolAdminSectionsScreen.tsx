import React, {
  useCallback,
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

import {
  getAcademicSectionsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicSection,
} from "types/schoolAdmin.types";


const SchoolAdminSectionsScreen =
  () => {
    const navigation =
      useNavigation();

    const [
      sections,
      setSections,
    ] = useState<
      AcademicSection[]
    >([]);

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


    const loadSections =
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
              await getAcademicSectionsApi();

            setSections(data);

            console.log(
              "SCHOOL ADMIN SECTIONS:",
              data.length
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SECTIONS ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Sections load nahi ho sake."
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
        loadSections();
      }, [loadSections])
    );


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
              Sections
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {sections.length} sections
            </Text>
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
                loadSections(true)
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


          {sections.map(
            (section) => {
              const className =
                typeof section
                  .classId ===
                "object"
                  ? section.classId
                      ?.name
                  : undefined;

              const session =
                typeof section
                  .academicSessionId ===
                "object"
                  ? section
                      .academicSessionId
                      ?.name
                  : undefined;

              return (
                <View
                  key={section._id}
                  className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-5"
                >

                  <View className="flex-row items-center">

                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EBFF]">
                      <Ionicons
                        name="grid-outline"
                        size={22}
                        color="#7B55C7"
                      />
                    </View>


                    <View className="ml-4 flex-1">

                      <Text className="text-base font-extrabold text-[#15213B]">
                        {section.name}
                      </Text>

                      <Text className="mt-1 text-xs text-[#606F88]">
                        {className
                          ? `Class ${className}`
                          : "Section"}
                      </Text>

                    </View>


                    {section.status ? (
                      <Text className="text-[9px] font-extrabold text-[#24976D]">
                        {section.status}
                      </Text>
                    ) : null}

                  </View>


                  {session ? (
                    <View className="mt-4 border-t border-[#EEF0F5] pt-4">

                      <Text className="text-xs text-[#606F88]">
                        Session:{" "}
                        <Text className="font-bold text-[#33415C]">
                          {session}
                        </Text>
                      </Text>

                    </View>
                  ) : null}

                </View>
              );
            }
          )}


          {!error &&
          sections.length === 0 ? (
            <View className="mt-20 items-center">
              <Ionicons
                name="grid-outline"
                size={45}
                color="#8A94A6"
              />

              <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
                No sections
              </Text>
            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminSectionsScreen;