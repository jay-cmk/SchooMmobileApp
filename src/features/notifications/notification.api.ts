// import api from "../../api/axios";

// import type {
//   DeviceTokenData,
//   DeviceTokenResponse,
//   GetNotificationsParams,
//   MarkAllReadResponse,
//   NotificationData,
//   NotificationListData,
//   NotificationListResponse,
//   NotificationResponse,
//   RegisterDevicePayload,
//   UnreadCountResponse,
// } from "./notification.types";


// /* =====================================================
//    GET MY NOTIFICATIONS

//    GET /notifications
// ===================================================== */

// export const getMyNotificationsApi =
//   async (
//     params?:
//       GetNotificationsParams
//   ): Promise<
//     NotificationListData
//   > => {
//     const queryParams:
//       Record<
//         string,
//         string | number | boolean
//       > = {};

//     if (
//       params?.type
//     ) {
//       queryParams.type =
//         params.type;
//     }

//     if (
//       params?.isRead !==
//       undefined
//     ) {
//       queryParams.isRead =
//         params.isRead;
//     }

//     if (
//       params?.page !==
//       undefined
//     ) {
//       queryParams.page =
//         params.page;
//     }

//     if (
//       params?.limit !==
//       undefined
//     ) {
//       queryParams.limit =
//         params.limit;
//     }

//     const response =
//       await api.get<
//         NotificationListResponse
//       >(
//         "/notifications",
//         {
//           params:
//             queryParams,
//         }
//       );

//     return response
//       .data
//       .data;
//   };


// /* =====================================================
//    GET UNREAD COUNT

//    GET /notifications/unread-count
// ===================================================== */

// export const getUnreadNotificationCountApi =
//   async (): Promise<number> => {
//     const response =
//       await api.get<
//         UnreadCountResponse
//       >(
//         "/notifications/unread-count"
//       );

//     return response
//       .data
//       .data
//       .unreadCount;
//   };


// /* =====================================================
//    MARK ONE NOTIFICATION AS READ

//    PATCH /notifications/:notificationId/read
// ===================================================== */

// export const markNotificationAsReadApi =
//   async (
//     notificationId: string
//   ): Promise<
//     NotificationData
//   > => {
//     const response =
//       await api.patch<
//         NotificationResponse
//       >(
//         `/notifications/${notificationId}/read`
//       );

//     return response
//       .data
//       .data
//       .notification;
//   };


// /* =====================================================
//    MARK ALL NOTIFICATIONS AS READ

//    PATCH /notifications/read-all
// ===================================================== */

// export const markAllNotificationsAsReadApi =
//   async (): Promise<number> => {
//     const response =
//       await api.patch<
//         MarkAllReadResponse
//       >(
//         "/notifications/read-all"
//       );

//     return response
//       .data
//       .data
//       .modifiedCount;
//   };


// /* =====================================================
//    DELETE NOTIFICATION

//    DELETE /notifications/:notificationId
// ===================================================== */

// export const deleteNotificationApi =
//   async (
//     notificationId: string
//   ): Promise<string> => {
//     await api.delete(
//       `/notifications/${notificationId}`
//     );

//     return notificationId;
//   };


// /* =====================================================
//    REGISTER MOBILE DEVICE TOKEN

//    POST /notifications/devices
// ===================================================== */

// export const registerDeviceTokenApi =
//   async (
//     data:
//       RegisterDevicePayload
//   ): Promise<
//     DeviceTokenData
//   > => {
//     const response =
//       await api.post<
//         DeviceTokenResponse
//       >(
//         "/notifications/devices",
//         data
//       );

//     return response
//       .data
//       .data
//       .device;
//   };


// /* =====================================================
//    DEACTIVATE MOBILE DEVICE TOKEN

//    DELETE /notifications/devices/:deviceId

//    Logout से पहले call करना है.
// ===================================================== */

// export const deactivateDeviceTokenApi =
//   async (
//     deviceId: string
//   ): Promise<
//     DeviceTokenData
//   > => {
//     const encodedDeviceId =
//       encodeURIComponent(
//         deviceId
//       );

//     const response =
//       await api.delete<
//         DeviceTokenResponse
//       >(
//         `/notifications/devices/${encodedDeviceId}`
//       );

//     return response
//       .data
//       .data
//       .device;
//   };


import api from "../../api/axios";

import type {
  DeleteNotificationResponse,
  DeviceTokenData,
  DeviceTokenResponse,
  GetNotificationsParams,
  MarkAllReadResponse,
  NotificationData,
  NotificationListData,
  NotificationListResponse,
  NotificationResponse,
  RegisterDevicePayload,
  UnreadCountResponse,
} from "./notification.types";


/* =====================================================
   GET MY NOTIFICATIONS

   GET /api/v1/notifications
===================================================== */

export const getMyNotificationsApi =
  async (
    params?:
      GetNotificationsParams
  ): Promise<NotificationListData> => {
    const queryParams: Record<
      string,
      string | number | boolean
    > = {};


    if (
      params?.page !==
      undefined
    ) {
      queryParams.page =
        params.page;
    }


    if (
      params?.limit !==
      undefined
    ) {
      queryParams.limit =
        params.limit;
    }


    if (
      params?.isRead !==
      undefined
    ) {
      queryParams.isRead =
        params.isRead;
    }


    if (
      params?.type
    ) {
      queryParams.type =
        params.type;
    }


    const response =
      await api.get<NotificationListResponse>(
        "/notifications",

        {
          params:
            queryParams,
        }
      );


    return response.data.data;
  };


/* =====================================================
   GET UNREAD NOTIFICATION COUNT

   GET /api/v1/notifications/unread-count
===================================================== */

export const getUnreadNotificationCountApi =
  async (): Promise<number> => {
    const response =
      await api.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );


    return response.data.data.unreadCount;
  };


/* =====================================================
   MARK ONE NOTIFICATION AS READ

   PATCH /api/v1/notifications/:notificationId/read
===================================================== */

export const markNotificationReadApi =
  async (
    notificationId: string
  ): Promise<NotificationData> => {
    const normalizedNotificationId =
      notificationId.trim();


    if (
      !normalizedNotificationId
    ) {
      throw new Error(
        "Notification ID is required"
      );
    }


    const response =
      await api.patch<NotificationResponse>(
        `/notifications/${encodeURIComponent(
          normalizedNotificationId
        )}/read`
      );


    return response.data.data.notification;
  };


/* =====================================================
   BACKWARD-COMPATIBLE NAME

   पुराने slice में यह नाम import हो तो error नहीं आएगा।
===================================================== */

export const markNotificationAsReadApi =
  markNotificationReadApi;


/* =====================================================
   MARK ALL NOTIFICATIONS AS READ

   PATCH /api/v1/notifications/read-all
===================================================== */

export const markAllNotificationsReadApi =
  async (): Promise<number> => {
    const response =
      await api.patch<MarkAllReadResponse>(
        "/notifications/read-all"
      );


    return response.data.data.modifiedCount;
  };


/* =====================================================
   BACKWARD-COMPATIBLE NAME
===================================================== */

export const markAllNotificationsAsReadApi =
  markAllNotificationsReadApi;


/* =====================================================
   DELETE ONE NOTIFICATION

   DELETE /api/v1/notifications/:notificationId
===================================================== */

export const deleteNotificationApi =
  async (
    notificationId: string
  ): Promise<string> => {
    const normalizedNotificationId =
      notificationId.trim();


    if (
      !normalizedNotificationId
    ) {
      throw new Error(
        "Notification ID is required"
      );
    }


    await api.delete<DeleteNotificationResponse>(
      `/notifications/${encodeURIComponent(
        normalizedNotificationId
      )}`
    );


    return normalizedNotificationId;
  };


/* =====================================================
   REGISTER MOBILE EXPO TOKEN

   POST /api/v1/notifications/devices
===================================================== */

export const registerDeviceTokenApi =
  async (
    data:
      RegisterDevicePayload
  ): Promise<DeviceTokenData> => {
    const token =
      data.token.trim();

    const deviceId =
      data.deviceId.trim();


    if (
      !token
    ) {
      throw new Error(
        "Push token is required"
      );
    }


    if (
      !deviceId
    ) {
      throw new Error(
        "Device ID is required"
      );
    }


    const payload:
      RegisterDevicePayload = {
        platform:
          data.platform,

        tokenType:
          "EXPO",

        token,

        deviceId,

        ...(data.deviceName?.trim()
          ? {
              deviceName:
                data.deviceName
                  .trim()
                  .slice(
                    0,
                    150
                  ),
            }
          : {}),
      };


    const response =
      await api.post<DeviceTokenResponse>(
        "/notifications/devices",

        payload
      );


    return response.data.data.device;
  };


/* =====================================================
   DEACTIVATE DEVICE TOKEN

   DELETE /api/v1/notifications/devices/:deviceId

   Logout से पहले call करना है।
===================================================== */

export const deactivateDeviceTokenApi =
  async (
    deviceId: string
  ): Promise<DeviceTokenData | null> => {
    const normalizedDeviceId =
      deviceId.trim();


    if (
      !normalizedDeviceId
    ) {
      return null;
    }


    const response =
      await api.delete<DeviceTokenResponse>(
        `/notifications/devices/${encodeURIComponent(
          normalizedDeviceId
        )}`
      );


    return response.data.data.device;
  };