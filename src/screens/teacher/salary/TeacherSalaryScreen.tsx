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

import type {
  TeacherStackParamList,
} from "types/navigation.types";

/* =====================================================
   NAVIGATION
===================================================== */

type NavigationProp =
  NativeStackNavigationProp<
    TeacherStackParamList,
    "Salary"
  >;

/* =====================================================
   SCREEN
===================================================== */

const TeacherSalaryScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    return (
      <SafeAreaView
        edges={[
          "top",
          "left",
          "right",
        ]}
        className="flex-1 bg-[#F7F7FB]"
      >

        {/* ============================================
            HEADER
        ============================================ */}

        <View className="bg-[#4355D8] px-5 pb-7 pt-4">

          <View className="flex-row items-center">

            <Pressable
              onPress={() =>
                navigation.goBack()
              }
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
            >

              <Ionicons
                name="arrow-back"
                size={22}
                color="#FFFFFF"
              />

            </Pressable>

            <View className="ml-4 flex-1">

              <Text className="text-xl font-extrabold text-white">
                My Salary
              </Text>

              <Text className="mt-1 text-xs text-white/70">
                Payroll and payment details
              </Text>

            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">

              <Ionicons
                name="wallet-outline"
                size={22}
                color="#FFFFFF"
              />

            </View>

          </View>

        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="pb-24"
        >

          {/* ==========================================
              HERO
          ========================================== */}

          <View className="px-5 pt-6">

            <View className="overflow-hidden rounded-[30px] bg-[#15213B] p-6">

              <View className="flex-row items-center justify-between">

                <View>

                  <Text className="text-xs font-bold text-white/60">
                    SALARY & PAYROLL
                  </Text>

                  <Text className="mt-2 text-2xl font-extrabold text-white">
                    Coming Soon
                  </Text>

                </View>

                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                  <Ionicons
                    name="cash-outline"
                    size={27}
                    color="#FFFFFF"
                  />

                </View>

              </View>

              <Text className="mt-5 max-w-[290px] text-xs leading-5 text-white/70">
                Payroll module connect hone ke baad
                yahan monthly salary, deductions,
                allowances aur payment history
                available hogi.
              </Text>

            </View>

          </View>

          {/* ==========================================
              STATUS CARD
          ========================================== */}

          <View className="px-5 pt-5">

            <View className="flex-row items-center rounded-3xl border border-[#F2DDBD] bg-[#FFF8EC] p-5">

              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0D7]">

                <Ionicons
                  name="time-outline"
                  size={24}
                  color="#E59A2F"
                />

              </View>

              <View className="ml-4 flex-1">

                <Text className="text-sm font-extrabold text-[#15213B]">
                  Payroll Not Configured
                </Text>

                <Text className="mt-1 text-xs leading-5 text-[#606F88]">
                  School administrator ke Payroll
                  module enable karne ke baad salary
                  details automatically yahan aayengi.
                </Text>

              </View>

            </View>

          </View>

          {/* ==========================================
              FUTURE DETAILS
          ========================================== */}

          <View className="px-5 pt-7">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Salary Details
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              Payroll module ke saath ye details available hongi.
            </Text>

            <View className="mt-4 rounded-3xl border border-[#E5E8F0] bg-white px-4">

              {/* MONTHLY SALARY */}

              <View className="flex-row items-center border-b border-[#EEF0F3] py-4">

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF]">

                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color="#4355D8"
                  />

                </View>

                <View className="ml-3 flex-1">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Monthly Salary
                  </Text>

                  <Text className="mt-1 text-[10px] text-[#606F88]">
                    Basic salary and gross salary
                  </Text>

                </View>

                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#9AA4B5"
                />

              </View>

              {/* ALLOWANCES */}

              <View className="flex-row items-center border-b border-[#EEF0F3] py-4">

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#E7F7F1]">

                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#2BAA7B"
                  />

                </View>

                <View className="ml-3 flex-1">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Allowances
                  </Text>

                  <Text className="mt-1 text-[10px] text-[#606F88]">
                    HRA and other allowances
                  </Text>

                </View>

                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#9AA4B5"
                />

              </View>

              {/* DEDUCTIONS */}

              <View className="flex-row items-center border-b border-[#EEF0F3] py-4">

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#FDECEE]">

                  <Ionicons
                    name="remove-circle-outline"
                    size={20}
                    color="#DC4C5A"
                  />

                </View>

                <View className="ml-3 flex-1">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Deductions
                  </Text>

                  <Text className="mt-1 text-[10px] text-[#606F88]">
                    PF, tax and other deductions
                  </Text>

                </View>

                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#9AA4B5"
                />

              </View>

              {/* NET SALARY */}

              <View className="flex-row items-center py-4">

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F5ECFF]">

                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color="#8B5CF6"
                  />

                </View>

                <View className="ml-3 flex-1">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Net Salary
                  </Text>

                  <Text className="mt-1 text-[10px] text-[#606F88]">
                    Final payable salary
                  </Text>

                </View>

                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#9AA4B5"
                />

              </View>

            </View>

          </View>

          {/* ==========================================
              PAYMENT HISTORY
          ========================================== */}

          <View className="px-5 pt-7">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Payment History
            </Text>

            <View className="mt-4 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white px-6 py-10">

              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                <Ionicons
                  name="receipt-outline"
                  size={29}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No salary records yet
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                Payroll module start hone ke
                baad salary payment history
                aur payslips yahan dikhengi.
              </Text>

            </View>

          </View>

          {/* ==========================================
              FUTURE FEATURES
          ========================================== */}

          <View className="px-5 pt-7">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Payroll Features
            </Text>

            <View className="mt-4 rounded-3xl bg-[#EEF0FF] p-5">

              {[
                {
                  icon:
                    "calendar-outline" as const,
                  title:
                    "Monthly Salary",
                  text:
                    "Month-wise salary details",
                },

                {
                  icon:
                    "card-outline" as const,
                  title:
                    "Payment Status",
                  text:
                    "Paid or pending salary status",
                },

                {
                  icon:
                    "receipt-outline" as const,
                  title:
                    "Payslip",
                  text:
                    "View and download salary slip",
                },

                {
                  icon:
                    "time-outline" as const,
                  title:
                    "Salary History",
                  text:
                    "Previous salary payments",
                },
              ].map(
                (
                  item,
                  index
                ) => (
                  <View
                    key={
                      item.title
                    }
                    className={`flex-row items-center py-3 ${
                      index < 3
                        ? "border-b border-[#DDE1FF]"
                        : ""
                    }`}
                  >

                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">

                      <Ionicons
                        name={
                          item.icon
                        }
                        size={18}
                        color="#4355D8"
                      />

                    </View>

                    <View className="ml-3 flex-1">

                      <Text className="text-xs font-extrabold text-[#15213B]">
                        {
                          item.title
                        }
                      </Text>

                      <Text className="mt-1 text-[10px] text-[#606F88]">
                        {
                          item.text
                        }
                      </Text>

                    </View>

                  </View>
                )
              )}

            </View>

          </View>

        </ScrollView>

      </SafeAreaView>
    );
  };

export default TeacherSalaryScreen;