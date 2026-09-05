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
  getAcademicClassesApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
} from "types/schoolAdmin.types";


const SchoolAdminClassesScreen =
  () => {
    const navigation =
      useNavigation();

    const [
      classes,
      setClasses,
    ] = useState<
      AcademicClass[]
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


    const loadClasses =
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
              await getAcademicClassesApi();

            setClasses(data);

            console.log(
              "SCHOOL ADMIN CLASSES:",
              data.length
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "CLASSES ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Classes load nahi ho sake."
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
        loadClasses();
      }, [loadClasses])
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
              Classes
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {classes.length} classes
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
                loadClasses(true)
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


          {classes.map(
            (item) => {
              const session =
                typeof item
                  .academicSessionId ===
                "object"
                  ? item
                      .academicSessionId
                      ?.name
                  : undefined;

              const teacher =
                typeof item
                  .classTeacherId ===
                "object"
                  ? item
                      .classTeacherId
                      ?.name
                  : undefined;

              return (
                <View
                  key={item._id}
                  className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-5"
                >

                  <View className="flex-row items-center">

                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                      <Ionicons
                        name="library-outline"
                        size={23}
                        color="#E59A2F"
                      />
                    </View>

                    <View className="ml-4 flex-1">

                      <Text className="text-base font-extrabold text-[#15213B]">
                        {item.name}
                      </Text>

                      <Text className="mt-1 text-xs text-[#606F88]">
                        {session ??
                          "Academic Class"}
                      </Text>

                    </View>


                    {item.status ? (
                      <Text className="text-[9px] font-extrabold text-[#24976D]">
                        {item.status}
                      </Text>
                    ) : null}

                  </View>


                  {teacher ? (
                    <View className="mt-4 flex-row items-center border-t border-[#EEF0F5] pt-4">

                      <Ionicons
                        name="person-outline"
                        size={16}
                        color="#606F88"
                      />

                      <Text className="ml-2 text-xs text-[#606F88]">
                        Class Teacher:{" "}
                        <Text className="font-bold text-[#33415C]">
                          {teacher}
                        </Text>
                      </Text>

                    </View>
                  ) : null}

                </View>
              );
            }
          )}


          {!error &&
          classes.length === 0 ? (
            <View className="mt-20 items-center">
              <Ionicons
                name="library-outline"
                size={45}
                color="#8A94A6"
              />

              <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
                No classes
              </Text>
            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminClassesScreen;