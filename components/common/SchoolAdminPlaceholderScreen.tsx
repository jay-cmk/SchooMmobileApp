import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

interface Props {
  title: string;

  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];
}

const SchoolAdminPlaceholderScreen =
  ({
    title,
    icon,
  }: Props) => {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">

        <View className="flex-1 items-center justify-center px-6">

          <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-[#EEF0FF]">

            <Ionicons
              name={icon}
              size={36}
              color="#4355D8"
            />

          </View>

          <Text className="mt-5 text-2xl font-extrabold text-[#15213B]">
            {title}
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-[#606F88]">
            School Admin mobile module
          </Text>

        </View>

      </SafeAreaView>
    );
  };

export default SchoolAdminPlaceholderScreen;