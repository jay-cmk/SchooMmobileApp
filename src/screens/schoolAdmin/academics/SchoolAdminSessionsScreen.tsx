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
  getAcademicSessionsApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicSession,
} from "types/schoolAdmin.types";


const SchoolAdminSessionsScreen =
  () => {
    const navigation =
      useNavigation();

    const [
      sessions,
      setSessions,
    ] = useState<
      AcademicSession[]
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


    const loadSessions =
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
              await getAcademicSessionsApi();

            setSessions(data);

            console.log(
              "SCHOOL ADMIN SESSIONS:",
              data.length
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "SESSIONS ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );

            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Sessions load nahi ho sake."
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
        loadSessions();
      }, [loadSessions])
    );


    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm text-[#606F88]">
            Loading sessions...
          </Text>
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
              Academic Sessions
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {sessions.length} sessions
            </Text>
          </View>

        </View>


        <ScrollView
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
                loadSessions(true)
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


          {sessions.map(
            (session) => (
              <View
                key={session._id}
                className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-5"
              >

                <View className="flex-row items-center">

                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color="#4355D8"
                    />
                  </View>

                  <View className="ml-4 flex-1">

                    <Text className="text-base font-extrabold text-[#15213B]">
                      {session.name}
                    </Text>

                    {session.status ? (
                      <Text className="mt-1 text-xs text-[#606F88]">
                        {session.status}
                      </Text>
                    ) : null}

                  </View>


                  {session.isCurrent ? (
                    <View className="rounded-full bg-[#E7F7F1] px-3 py-1.5">
                      <Text className="text-[9px] font-extrabold text-[#24976D]">
                        CURRENT
                      </Text>
                    </View>
                  ) : null}

                </View>


                {session.startDate ||
                session.endDate ? (
                  <View className="mt-4 flex-row border-t border-[#EEF0F5] pt-4">

                    <View className="flex-1">
                      <Text className="text-[9px] font-bold text-[#8A94A6]">
                        START DATE
                      </Text>

                      <Text className="mt-1 text-xs font-semibold text-[#33415C]">
                        {session.startDate
                          ? new Date(
                              session.startDate
                            ).toLocaleDateString()
                          : "—"}
                      </Text>
                    </View>


                    <View className="flex-1">
                      <Text className="text-[9px] font-bold text-[#8A94A6]">
                        END DATE
                      </Text>

                      <Text className="mt-1 text-xs font-semibold text-[#33415C]">
                        {session.endDate
                          ? new Date(
                              session.endDate
                            ).toLocaleDateString()
                          : "—"}
                      </Text>
                    </View>

                  </View>
                ) : null}

              </View>
            )
          )}


          {!error &&
          sessions.length === 0 ? (
            <View className="mt-20 items-center">
              <Ionicons
                name="calendar-outline"
                size={45}
                color="#8A94A6"
              />

              <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
                No sessions
              </Text>

              <Text className="mt-2 text-sm text-[#606F88]">
                No academic session found.
              </Text>
            </View>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminSessionsScreen;