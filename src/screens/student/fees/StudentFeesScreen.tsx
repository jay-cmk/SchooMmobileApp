import React from "react";

import {
  Pressable,
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

const StudentFeesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F7F7FB]">

      {/* Header */}
      <View className="flex-row items-center px-5 py-4">

        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-white"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#15213B"
          />
        </Pressable>

        <View className="ml-3">
          <Text className="text-xl font-extrabold text-[#15213B]">
            Fees
          </Text>

          <Text className="text-xs text-[#606F88]">
            Fee details & payments
          </Text>
        </View>

      </View>

      {/* Content */}
      <View className="flex-1 px-5 pt-5">

        <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-6 py-10">

          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF2DE]">
            <Ionicons
              name="card-outline"
              size={38}
              color="#E59A2F"
            />
          </View>

          <Text className="mt-5 text-xl font-extrabold text-[#15213B]">
            Fees
          </Text>

          <Text className="mt-2 text-center text-sm leading-6 text-[#606F88]">
            Your fee details, pending dues and payment history will appear here.
          </Text>

          <View className="mt-6 rounded-full bg-[#EEF0FF] px-4 py-2">
            <Text className="text-xs font-bold text-[#4355D8]">
              Coming Soon
            </Text>
          </View>

        </View>

      </View>

    </SafeAreaView>
  );
};

export default StudentFeesScreen;