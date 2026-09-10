import React, {
  useEffect,
} from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";




import { getUnreadNotificationCount } from "@/features/notifications/notification.slice";
import { useAppDispatch,useAppSelector } from "@/store/hook";


/* =====================================================
   PROPS
===================================================== */

interface NotificationBellProps {
  size?: number;

  iconColor?: string;

  backgroundColor?: string;

  borderColor?: string;

  showBorder?: boolean;
}


/* =====================================================
   COMPONENT
===================================================== */

const NotificationBell = ({
  size = 22,

  iconColor =
    "#15213B",

  backgroundColor =
    "#FFFFFF",

  borderColor =
    "#E5E8F0",

  showBorder =
    true,
}: NotificationBellProps) => {
  const dispatch =
    useAppDispatch();

  const navigation =
    useNavigation<
      NavigationProp<
        ParamListBase
      >
    >();

  const unreadCount =
    useAppSelector(
      (state) =>
        state.notifications
          .unreadCount
    );


  /* =================================================
     GET LATEST UNREAD COUNT

     Root hook भी count fetch करता है, लेकिन यह bell
     independently भी सही count ला सकती है.
  ================================================= */

  useEffect(() => {
    dispatch(
      getUnreadNotificationCount()
    );
  }, [
    dispatch,
  ]);


  /* =================================================
     DISPLAY COUNT
  ================================================= */

  const displayCount =
    unreadCount > 99
      ? "99+"
      : String(
          unreadCount
        );


  /* =================================================
     OPEN NOTIFICATIONS
  ================================================= */

  const handlePress =
    (): void => {
      /*
       * React Navigation action parent stack तक bubble
       * करेगी जहां Notifications route registered है.
       */
      navigation.navigate(
        "Notifications"
      );
    };


  return (
    <Pressable
      onPress={
        handlePress
      }
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      className="relative h-11 w-11 items-center justify-center rounded-xl active:opacity-70"
      style={{
        backgroundColor,

        borderWidth:
          showBorder
            ? 1
            : 0,

        borderColor:
          showBorder
            ? borderColor
            : "transparent",
      }}
    >
      <Ionicons
        name={
          unreadCount > 0
            ? "notifications"
            : "notifications-outline"
        }
        size={
          size
        }
        color={
          iconColor
        }
      />

      {unreadCount >
      0 ? (
        <View
          className={`absolute items-center justify-center rounded-full border-2 border-white bg-[#EF4444] ${
            unreadCount > 9
              ? "min-w-6 px-1"
              : "h-5 min-w-5"
          }`}
          style={{
            right:
              -5,

            top:
              -5,
          }}
        >
          <Text className="text-[9px] font-extrabold text-white">
            {displayCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};


export default
  NotificationBell;