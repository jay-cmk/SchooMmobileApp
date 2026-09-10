import {
  Platform,
} from "react-native";

import * as Notifications
  from "expo-notifications";

import * as Device
  from "expo-device";

import * as SecureStore
  from "expo-secure-store";

import Constants
  from "expo-constants";

import type {
  RegisterDevicePayload,
} from "../features/notifications/notification.types";


/* =====================================================
   CONSTANTS
===================================================== */

const DEVICE_ID_KEY =
  "school_app_notification_device_id";


/* =====================================================
   FOREGROUND NOTIFICATION HANDLER

   App open होने पर notification banner और sound
   दिखाने के लिए.
===================================================== */

Notifications.setNotificationHandler({
  handleNotification:
    async () => ({
      shouldShowBanner:
        true,

      shouldShowList:
        true,

      shouldPlaySound:
        true,

      shouldSetBadge:
        true,
    }),
});


/* =====================================================
   CREATE DEVICE ID
===================================================== */

const createDeviceId =
  (): string => {
    const timestamp =
      Date.now()
        .toString(36);

    const randomPart =
      Math.random()
        .toString(36)
        .slice(2);

    return (
      `device-${timestamp}-${randomPart}`
    );
  };


/* =====================================================
   GET OR CREATE DEVICE ID

   Backend में same mobile device को पहचानने के लिए.
===================================================== */

export const getNotificationDeviceId =
  async (): Promise<string> => {
    const existingDeviceId =
      await SecureStore
        .getItemAsync(
          DEVICE_ID_KEY
        );

    if (
      existingDeviceId
    ) {
      return existingDeviceId;
    }

    const newDeviceId =
      createDeviceId();

    await SecureStore
      .setItemAsync(
        DEVICE_ID_KEY,
        newDeviceId
      );

    return newDeviceId;
  };


/* =====================================================
   CONFIGURE ANDROID CHANNELS

   Backend भी यही channel IDs भेजता है:
   - general
   - important
   - silent
===================================================== */

export const configureNotificationChannels =
  async (): Promise<void> => {
    if (
      Platform.OS !==
      "android"
    ) {
      return;
    }

    /* ===============================================
       GENERAL NOTIFICATIONS
    =============================================== */

    await Notifications
      .setNotificationChannelAsync(
        "general",
        {
          name:
            "General Notifications",

          description:
            "Subjects, electives, homework and general notifications",

          importance:
            Notifications
              .AndroidImportance
              .HIGH,

          sound:
            "default",

          vibrationPattern: [
            0,
            250,
            200,
            250,
          ],

          lightColor:
            "#4355D8",

          enableVibrate:
            true,

          showBadge:
            true,
        }
      );


    /* ===============================================
       IMPORTANT NOTIFICATIONS
    =============================================== */

    await Notifications
      .setNotificationChannelAsync(
        "important",
        {
          name:
            "Important Notifications",

          description:
            "Attendance and important school notifications",

          importance:
            Notifications
              .AndroidImportance
              .MAX,

          sound:
            "default",

          vibrationPattern: [
            0,
            400,
            200,
            400,
          ],

          lightColor:
            "#D92D20",

          enableVibrate:
            true,

          showBadge:
            true,
        }
      );


    /* ===============================================
       SILENT NOTIFICATIONS
    =============================================== */

    await Notifications
      .setNotificationChannelAsync(
        "silent",
        {
          name:
            "Silent Notifications",

          description:
            "Notifications without sound or vibration",

          importance:
            Notifications
              .AndroidImportance
              .LOW,

          sound:
            null,

          enableVibrate:
            false,

          showBadge:
            true,
        }
      );
  };


/* =====================================================
   GET EXPO EAS PROJECT ID
===================================================== */

const getExpoProjectId =
  (): string => {
    const projectId =
      Constants.expoConfig
        ?.extra
        ?.eas
        ?.projectId ??
      Constants.easConfig
        ?.projectId;

    if (
      !projectId ||
      typeof projectId !==
        "string"
    ) {
      throw new Error(
        "Expo EAS project ID is missing"
      );
    }

    return projectId;
  };


/* =====================================================
   REQUEST NOTIFICATION PERMISSION
===================================================== */

const requestNotificationPermission =
  async (): Promise<boolean> => {
    const existingPermission =
      await Notifications
        .getPermissionsAsync();

    if (
      existingPermission
        .status ===
      "granted"
    ) {
      return true;
    }

    const requestedPermission =
      await Notifications
        .requestPermissionsAsync();

    return (
      requestedPermission
        .status ===
      "granted"
    );
  };


/* =====================================================
   PREPARE NOTIFICATION DEVICE

   Permission लेता है, Expo token निकालता है और backend
   register API के लिए payload return करता है.
===================================================== */

export const prepareNotificationDevice =
  async (): Promise<
    RegisterDevicePayload | null
  > => {
    /*
     * Android 13 में permission लेने से पहले कम से कम
     * एक notification channel बनना चाहिए.
     */
    await configureNotificationChannels();

    /*
     * Real remote push के लिए physical device चाहिए.
     */
    if (
      !Device.isDevice
    ) {
      console.log(
        "Push notifications require a physical device"
      );

      return null;
    }

    if (
      Platform.OS !==
        "android" &&
      Platform.OS !==
        "ios"
    ) {
      return null;
    }

    const permissionGranted =
      await requestNotificationPermission();

    if (
      !permissionGranted
    ) {
      console.log(
        "Notification permission was not granted"
      );

      return null;
    }

    const projectId =
      getExpoProjectId();

    const tokenResponse =
      await Notifications
        .getExpoPushTokenAsync({
          projectId,
        });

    const token =
      tokenResponse.data;

    if (!token) {
      throw new Error(
        "Unable to generate Expo push token"
      );
    }

    const deviceId =
      await getNotificationDeviceId();

    const platform:
      "ANDROID" | "IOS" =
      Platform.OS ===
      "ios"
        ? "IOS"
        : "ANDROID";

    const deviceName =
      Device.deviceName ??
      [
        Device.brand,
        Device.modelName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return {
      platform,

      tokenType:
        "EXPO",

      token,

      deviceId,

      ...(
        deviceName
          ? {
              deviceName,
            }
          : {}
      ),
    };
  };


/* =====================================================
   GET INITIAL NOTIFICATION RESPONSE

   App बंद थी और notification पर click करके खुली.
===================================================== */

export const getInitialNotificationResponse =
  async (): Promise<
    Notifications.NotificationResponse | null
  > => {
    return Notifications
      .getLastNotificationResponseAsync();
  };


/* =====================================================
   FOREGROUND NOTIFICATION LISTENER
===================================================== */

export const addNotificationReceivedListener =
  (
    listener: (
      notification:
        Notifications.Notification
    ) => void
  ) => {
    return Notifications
      .addNotificationReceivedListener(
        listener
      );
  };


/* =====================================================
   NOTIFICATION CLICK LISTENER
===================================================== */

export const addNotificationResponseListener =
  (
    listener: (
      response:
        Notifications
          .NotificationResponse
    ) => void
  ):
    Notifications.EventSubscription => {
    return Notifications
      .addNotificationResponseReceivedListener(
        listener
      );
  };


/* =====================================================
   SET APP ICON BADGE COUNT
===================================================== */

export const setNotificationBadgeCount =
  async (
    count: number
  ): Promise<void> => {
    const normalizedCount =
      Math.max(
        0,
        count
      );

    try {
      await Notifications
        .setBadgeCountAsync(
          normalizedCount
        );
    } catch (
      error
    ) {
      console.log(
        "SET NOTIFICATION BADGE ERROR:",
        error
      );
    }
  };


/* =====================================================
   CLEAR APP ICON BADGE
===================================================== */

export const clearNotificationBadge =
  async (): Promise<void> => {
    await setNotificationBadgeCount(
      0
    );
  };


/* =====================================================
   DISMISS ALL DISPLAYED NOTIFICATIONS
===================================================== */

export const dismissAllNotifications =
  async (): Promise<void> => {
    try {
      await Notifications
        .dismissAllNotificationsAsync();
    } catch (
      error
    ) {
      console.log(
        "DISMISS NOTIFICATIONS ERROR:",
        error
      );
    }
  };