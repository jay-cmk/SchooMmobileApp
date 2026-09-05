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


interface ServiceComingSoonProps {
  title: string;

  description?: string;

  icon?: keyof typeof Ionicons.glyphMap;
}


const ServiceComingSoon = ({
  title,
  description,
  icon = "construct-outline",
}: ServiceComingSoonProps) => {
  const navigation =
    useNavigation();

  return (
    <SafeAreaView
      edges={[
        "top",
        "left",
        "right",
      ]}
      className="flex-1 bg-[#F7F7FB]"
    >

      {/* HEADER */}

      <View className="flex-row items-center bg-[#4355D8] px-5 pb-6 pt-4">

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
            {title}
          </Text>

          <Text className="mt-1 text-xs text-white/70">
            Student Service
          </Text>

        </View>

      </View>


      {/* CONTENT */}

      <View className="flex-1 items-center justify-center px-7">

        <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-[#EEF0FF]">

          <Ionicons
            name={icon}
            size={44}
            color="#4355D8"
          />

        </View>


        <View className="mt-7 rounded-full bg-[#FFF2DE] px-4 py-2">

          <Text className="text-[10px] font-extrabold tracking-wider text-[#E59A2F]">
            COMING SOON
          </Text>

        </View>


        <Text className="mt-5 text-center text-2xl font-extrabold text-[#15213B]">
          {title}
        </Text>


        <Text className="mt-3 max-w-[300px] text-center text-sm leading-6 text-[#606F88]">
          {description ??
            "This service is currently under development and will be available soon."}
        </Text>


        <View className="mt-8 w-full rounded-3xl border border-[#E5E8F0] bg-white p-5">

          <View className="flex-row items-center">

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F7F1]">

              <Ionicons
                name="school-outline"
                size={21}
                color="#2BAA7B"
              />

            </View>


            <View className="ml-3 flex-1">

              <Text className="text-sm font-extrabold text-[#15213B]">
                Feature in Development
              </Text>

              <Text className="mt-1 text-xs leading-5 text-[#606F88]">
                Your school will be able to use this feature once it is available.
              </Text>

            </View>

          </View>

        </View>

      </View>

    </SafeAreaView>
  );
};


export default ServiceComingSoon;