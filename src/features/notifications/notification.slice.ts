// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   deactivateDeviceTokenApi,
//   deleteNotificationApi,
//   getMyNotificationsApi,
//   getUnreadNotificationCountApi,
//   markAllNotificationsAsReadApi,
//   markNotificationAsReadApi,
//   registerDeviceTokenApi,
// } from "./notification.api";

// import type {
//   DeviceTokenData,
//   GetNotificationsParams,
//   NotificationData,
//   NotificationListData,
//   NotificationState,
//   RegisterDevicePayload,
// } from "./notification.types";


// /* =====================================================
//    THUNK CONFIGURATION
// ===================================================== */

// interface NotificationThunkConfig {
//   rejectValue: string;
// }


// /* =====================================================
//    GET NOTIFICATIONS ARGUMENT
// ===================================================== */

// interface GetNotificationsArgument {
//   params?:
//     GetNotificationsParams;

//   refresh?: boolean;
// }


// /* =====================================================
//    INITIAL STATE
// ===================================================== */

// const initialState:
//   NotificationState = {
//     notifications:
//       [],

//     unreadCount:
//       0,

//     pagination:
//       null,

//     loading:
//       false,

//     refreshing:
//       false,

//     registeringDevice:
//       false,

//     error:
//       null,

//     initialized:
//       false,
//   };


// /* =====================================================
//    GET ERROR MESSAGE
// ===================================================== */

// const getErrorMessage = (
//   error: any,
//   fallback: string
// ): string => {
//   return (
//     error?.response
//       ?.data
//       ?.message ??
//     error?.message ??
//     fallback
//   );
// };


// /* =====================================================
//    GET MY NOTIFICATIONS
// ===================================================== */

// export const getMyNotifications =
//   createAsyncThunk<
//     NotificationListData,
//     GetNotificationsArgument | undefined,
//     NotificationThunkConfig
//   >(
//     "notifications/getMyNotifications",

//     async (
//       argument,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await getMyNotificationsApi(
//           argument?.params
//         );
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to fetch notifications"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    GET UNREAD COUNT
// ===================================================== */

// export const getUnreadNotificationCount =
//   createAsyncThunk<
//     number,
//     void,
//     NotificationThunkConfig
//   >(
//     "notifications/getUnreadCount",

//     async (
//       _,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await getUnreadNotificationCountApi();
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to fetch unread notification count"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    MARK ONE AS READ
// ===================================================== */

// export const markNotificationAsRead =
//   createAsyncThunk<
//     NotificationData,
//     string,
//     NotificationThunkConfig
//   >(
//     "notifications/markAsRead",

//     async (
//       notificationId,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await markNotificationAsReadApi(
//           notificationId
//         );
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to mark notification as read"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    MARK ALL AS READ
// ===================================================== */

// export const markAllNotificationsAsRead =
//   createAsyncThunk<
//     number,
//     void,
//     NotificationThunkConfig
//   >(
//     "notifications/markAllAsRead",

//     async (
//       _,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await markAllNotificationsAsReadApi();
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to mark all notifications as read"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    DELETE NOTIFICATION
// ===================================================== */

// export const deleteNotification =
//   createAsyncThunk<
//     string,
//     string,
//     NotificationThunkConfig
//   >(
//     "notifications/deleteNotification",

//     async (
//       notificationId,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await deleteNotificationApi(
//           notificationId
//         );
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to delete notification"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    REGISTER DEVICE TOKEN
// ===================================================== */

// export const registerDeviceToken =
//   createAsyncThunk<
//     DeviceTokenData,
//     RegisterDevicePayload,
//     NotificationThunkConfig
//   >(
//     "notifications/registerDevice",

//     async (
//       data,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await registerDeviceTokenApi(
//           data
//         );
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to register device for notifications"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    DEACTIVATE DEVICE TOKEN
// ===================================================== */

// export const deactivateDeviceToken =
//   createAsyncThunk<
//     DeviceTokenData,
//     string,
//     NotificationThunkConfig
//   >(
//     "notifications/deactivateDevice",

//     async (
//       deviceId,
//       {
//         rejectWithValue,
//       }
//     ) => {
//       try {
//         return await deactivateDeviceTokenApi(
//           deviceId
//         );
//       } catch (
//         error: any
//       ) {
//         return rejectWithValue(
//           getErrorMessage(
//             error,
//             "Failed to deactivate notification device"
//           )
//         );
//       }
//     }
//   );


// /* =====================================================
//    SLICE
// ===================================================== */

// const notificationSlice =
//   createSlice({
//     name:
//       "notifications",

//     initialState,

//     reducers: {
//       /* =============================================
//          ADD RECEIVED NOTIFICATION

//          App foreground में push आने पर यह reducer
//          notification को immediately list में जोड़ेगा.
//       ============================================= */

//       addReceivedNotification: (
//         state,
//         action: {
//           payload:
//             NotificationData;
//         }
//       ) => {
//         const alreadyExists =
//           state.notifications.some(
//             (item) =>
//               item._id ===
//               action.payload._id
//           );

//         if (
//           alreadyExists
//         ) {
//           return;
//         }

//         state.notifications.unshift(
//           action.payload
//         );

//         if (
//           !action.payload
//             .isRead
//         ) {
//           state.unreadCount +=
//             1;
//         }

//         if (
//           state.pagination
//         ) {
//           state.pagination.total +=
//             1;

//           state.pagination.totalPages =
//             Math.ceil(
//               state.pagination.total /
//                 state.pagination.limit
//             );
//         }
//       },


//       /* =============================================
//          CLEAR NOTIFICATION ERROR
//       ============================================= */

//       clearNotificationError: (
//         state
//       ) => {
//         state.error =
//           null;
//       },


//       /* =============================================
//          CLEAR NOTIFICATION STATE

//          Logout के बाद call करें.
//       ============================================= */

//       clearNotifications: (
//         state
//       ) => {
//         state.notifications =
//           [];

//         state.unreadCount =
//           0;

//         state.pagination =
//           null;

//         state.loading =
//           false;

//         state.refreshing =
//           false;

//         state.registeringDevice =
//           false;

//         state.error =
//           null;

//         state.initialized =
//           false;
//       },
//     },


//     extraReducers: (
//       builder
//     ) => {
//       builder

//         /* =========================================
//            GET NOTIFICATIONS
//         ========================================= */

//         .addCase(
//           getMyNotifications.pending,

//           (
//             state,
//             action
//           ) => {
//             const isRefresh =
//               action.meta.arg
//                 ?.refresh ===
//               true;

//             if (
//               isRefresh
//             ) {
//               state.refreshing =
//                 true;
//             } else {
//               state.loading =
//                 true;
//             }

//             state.error =
//               null;
//           }
//         )

//         .addCase(
//           getMyNotifications.fulfilled,

//           (
//             state,
//             action
//           ) => {
//             state.loading =
//               false;

//             state.refreshing =
//               false;

//             state.error =
//               null;

//             const requestedPage =
//               action.meta.arg
//                 ?.params
//                 ?.page ??
//               1;

//             if (
//               requestedPage >
//               1
//             ) {
//               const existingIds =
//                 new Set(
//                   state.notifications.map(
//                     (item) =>
//                       item._id
//                   )
//                 );

//               const newItems =
//                 action.payload
//                   .notifications
//                   .filter(
//                     (item) =>
//                       !existingIds.has(
//                         item._id
//                       )
//                   );

//               state.notifications.push(
//                 ...newItems
//               );
//             } else {
//               state.notifications =
//                 action.payload
//                   .notifications;
//             }

//             state.pagination =
//               action.payload
//                 .pagination;

//             state.unreadCount =
//               action.payload
//                 .unreadCount;

//             state.initialized =
//               true;
//           }
//         )

//         .addCase(
//           getMyNotifications.rejected,

//           (
//             state,
//             action
//           ) => {
//             state.loading =
//               false;

//             state.refreshing =
//               false;

//             state.error =
//               action.payload ??
//               "Failed to fetch notifications";

//             state.initialized =
//               true;
//           }
//         )


//         /* =========================================
//            GET UNREAD COUNT
//         ========================================= */

//         .addCase(
//           getUnreadNotificationCount
//             .fulfilled,

//           (
//             state,
//             action
//           ) => {
//             state.unreadCount =
//               action.payload;
//           }
//         )

//         .addCase(
//           getUnreadNotificationCount
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.error =
//               action.payload ??
//               "Failed to fetch unread count";
//           }
//         )


//         /* =========================================
//            MARK ONE AS READ
//         ========================================= */

//         .addCase(
//           markNotificationAsRead
//             .fulfilled,

//           (
//             state,
//             action
//           ) => {
//             const index =
//               state.notifications
//                 .findIndex(
//                   (item) =>
//                     item._id ===
//                     action.payload
//                       ._id
//                 );

//             if (
//               index !== -1
//             ) {
//               const wasUnread =
//                 !state
//                   .notifications[
//                     index
//                   ]
//                   .isRead;

//               state.notifications[
//                 index
//               ] =
//                 action.payload;

//               if (
//                 wasUnread
//               ) {
//                 state.unreadCount =
//                   Math.max(
//                     0,
//                     state.unreadCount -
//                       1
//                   );
//               }
//             }
//           }
//         )

//         .addCase(
//           markNotificationAsRead
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.error =
//               action.payload ??
//               "Failed to mark notification as read";
//           }
//         )


//         /* =========================================
//            MARK ALL AS READ
//         ========================================= */

//         .addCase(
//           markAllNotificationsAsRead
//             .fulfilled,

//           (
//             state
//           ) => {
//             const readAt =
//               new Date()
//                 .toISOString();

//             state.notifications =
//               state.notifications.map(
//                 (
//                   notification
//                 ) => ({
//                   ...notification,

//                   isRead:
//                     true,

//                   readAt:
//                     notification
//                       .readAt ??
//                     readAt,
//                 })
//               );

//             state.unreadCount =
//               0;
//           }
//         )

//         .addCase(
//           markAllNotificationsAsRead
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.error =
//               action.payload ??
//               "Failed to mark all notifications as read";
//           }
//         )


//         /* =========================================
//            DELETE NOTIFICATION
//         ========================================= */

//         .addCase(
//           deleteNotification
//             .fulfilled,

//           (
//             state,
//             action
//           ) => {
//             const notification =
//               state.notifications.find(
//                 (item) =>
//                   item._id ===
//                   action.payload
//               );

//             state.notifications =
//               state.notifications.filter(
//                 (item) =>
//                   item._id !==
//                   action.payload
//               );

//             if (
//               notification &&
//               !notification.isRead
//             ) {
//               state.unreadCount =
//                 Math.max(
//                   0,
//                   state.unreadCount -
//                     1
//                 );
//             }

//             if (
//               state.pagination
//             ) {
//               state.pagination.total =
//                 Math.max(
//                   0,
//                   state.pagination
//                     .total - 1
//                 );

//               state.pagination.totalPages =
//                 Math.ceil(
//                   state.pagination
//                     .total /
//                     state.pagination
//                       .limit
//                 );
//             }
//           }
//         )

//         .addCase(
//           deleteNotification
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.error =
//               action.payload ??
//               "Failed to delete notification";
//           }
//         )


//         /* =========================================
//            REGISTER DEVICE
//         ========================================= */

//         .addCase(
//           registerDeviceToken
//             .pending,

//           (
//             state
//           ) => {
//             state.registeringDevice =
//               true;
//           }
//         )

//         .addCase(
//           registerDeviceToken
//             .fulfilled,

//           (
//             state
//           ) => {
//             state.registeringDevice =
//               false;
//           }
//         )

//         .addCase(
//           registerDeviceToken
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.registeringDevice =
//               false;

//             state.error =
//               action.payload ??
//               "Failed to register notification device";
//           }
//         )


//         /* =========================================
//            DEACTIVATE DEVICE
//         ========================================= */

//         .addCase(
//           deactivateDeviceToken
//             .rejected,

//           (
//             state,
//             action
//           ) => {
//             state.error =
//               action.payload ??
//               "Failed to deactivate notification device";
//           }
//         );
//     },
//   });


// /* =====================================================
//    ACTIONS
// ===================================================== */

// export const {
//   addReceivedNotification,
//   clearNotificationError,
//   clearNotifications,
// } =
//   notificationSlice.actions;


// /* =====================================================
//    REDUCER
// ===================================================== */

// export default
//   notificationSlice.reducer;

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  deactivateDeviceTokenApi,
  deleteNotificationApi,
  getMyNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
  registerDeviceTokenApi,
} from "./notification.api";

import type {
  DeviceTokenData,
  GetNotificationsParams,
  NotificationData,
  NotificationListData,
  NotificationState,
  RegisterDevicePayload,
} from "./notification.types";


/* =====================================================
   THUNK CONFIGURATION
===================================================== */

interface NotificationThunkConfig {
  rejectValue: string;
}


/* =====================================================
   GET NOTIFICATIONS ARGUMENT
===================================================== */

export interface GetNotificationsArgument {
  params?:
    GetNotificationsParams;

  refresh?: boolean;
}


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState:
  NotificationState = {
    notifications: [],

    unreadCount: 0,

    pagination: null,

    loading: false,

    refreshing: false,

    registeringDevice: false,

    error: null,

    initialized: false,
  };


/* =====================================================
   ERROR MESSAGE HELPER
===================================================== */

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (
    typeof error ===
      "object" &&
    error !==
      null &&
    "response" in
      error
  ) {
    const apiError =
      error as {
        response?: {
          data?: {
            message?:
              string;
          };
        };
      };


    const apiMessage =
      apiError.response
        ?.data
        ?.message;


    if (
      apiMessage
    ) {
      return apiMessage;
    }
  }


  if (
    error instanceof
    Error
  ) {
    return error.message;
  }


  return fallback;
};


/* =====================================================
   GET MY NOTIFICATIONS
===================================================== */

export const getMyNotifications =
  createAsyncThunk<
    NotificationListData,
    GetNotificationsArgument | undefined,
    NotificationThunkConfig
  >(
    "notifications/getMyNotifications",

    async (
      argument,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getMyNotificationsApi(
          argument?.params
        );
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch notifications"
          )
        );
      }
    }
  );


/* =====================================================
   GET UNREAD COUNT
===================================================== */

export const getUnreadNotificationCount =
  createAsyncThunk<
    number,
    void,
    NotificationThunkConfig
  >(
    "notifications/getUnreadCount",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getUnreadNotificationCountApi();
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch unread notification count"
          )
        );
      }
    }
  );


/* =====================================================
   MARK ONE AS READ
===================================================== */

export const markNotificationAsRead =
  createAsyncThunk<
    NotificationData,
    string,
    NotificationThunkConfig
  >(
    "notifications/markAsRead",

    async (
      notificationId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await markNotificationAsReadApi(
          notificationId
        );
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to mark notification as read"
          )
        );
      }
    }
  );


/* =====================================================
   MARK ALL AS READ
===================================================== */

export const markAllNotificationsAsRead =
  createAsyncThunk<
    number,
    void,
    NotificationThunkConfig
  >(
    "notifications/markAllAsRead",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await markAllNotificationsAsReadApi();
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to mark all notifications as read"
          )
        );
      }
    }
  );


/* =====================================================
   DELETE NOTIFICATION
===================================================== */

export const deleteNotification =
  createAsyncThunk<
    string,
    string,
    NotificationThunkConfig
  >(
    "notifications/deleteNotification",

    async (
      notificationId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await deleteNotificationApi(
          notificationId
        );
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to delete notification"
          )
        );
      }
    }
  );


/* =====================================================
   REGISTER DEVICE TOKEN
===================================================== */

export const registerDeviceToken =
  createAsyncThunk<
    DeviceTokenData,
    RegisterDevicePayload,
    NotificationThunkConfig
  >(
    "notifications/registerDevice",

    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await registerDeviceTokenApi(
          data
        );
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to register device for notifications"
          )
        );
      }
    }
  );


/* =====================================================
   DEACTIVATE DEVICE TOKEN

   API blank device ID पर null return कर सकती है।
===================================================== */

export const deactivateDeviceToken =
  createAsyncThunk<
    DeviceTokenData | null,
    string,
    NotificationThunkConfig
  >(
    "notifications/deactivateDevice",

    async (
      deviceId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await deactivateDeviceTokenApi(
          deviceId
        );
      } catch (
        error: unknown
      ) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to deactivate notification device"
          )
        );
      }
    }
  );


/* =====================================================
   SLICE
===================================================== */

const notificationSlice =
  createSlice({
    name:
      "notifications",

    initialState,

    reducers: {
      /* ===============================================
         ADD REALTIME / FOREGROUND NOTIFICATION
      =============================================== */

      addReceivedNotification: (
        state,
        action:
          PayloadAction<NotificationData>
      ) => {
        const incomingNotification =
          action.payload;


        const existingIndex =
          state.notifications.findIndex(
            (
              notification
            ) =>
              notification._id ===
              incomingNotification._id
          );


        /*
         * Same notification Socket.IO और Expo listener
         * दोनों से आए तो duplicate नहीं बनेगी।
         */
        if (
          existingIndex !==
          -1
        ) {
          state.notifications[
            existingIndex
          ] =
            incomingNotification;

          return;
        }


        state.notifications.unshift(
          incomingNotification
        );


        if (
          !incomingNotification.isRead
        ) {
          state.unreadCount +=
            1;
        }


        if (
          state.pagination
        ) {
          state.pagination.total +=
            1;

          state.pagination.totalPages =
            Math.ceil(
              state.pagination.total /
                state.pagination.limit
            );
        }
      },


      /* ===============================================
         SET UNREAD COUNT

         Socket event या badge sync में उपयोग होगा।
      =============================================== */

      setNotificationUnreadCount: (
        state,
        action:
          PayloadAction<number>
      ) => {
        state.unreadCount =
          Math.max(
            0,
            action.payload
          );
      },


      /* ===============================================
         MARK NOTIFICATION READ LOCALLY

         Immediate UI update के लिए optional reducer।
      =============================================== */

      markNotificationReadLocally: (
        state,
        action:
          PayloadAction<string>
      ) => {
        const notification =
          state.notifications.find(
            (
              item
            ) =>
              item._id ===
              action.payload
          );


        if (
          !notification ||
          notification.isRead
        ) {
          return;
        }


        notification.isRead =
          true;

        notification.readAt =
          new Date()
            .toISOString();

        state.unreadCount =
          Math.max(
            0,
            state.unreadCount -
              1
          );
      },


      /* ===============================================
         CLEAR ERROR
      =============================================== */

      clearNotificationError: (
        state
      ) => {
        state.error =
          null;
      },


      /* ===============================================
         CLEAR STATE ON LOGOUT
      =============================================== */

      clearNotifications: (
        state
      ) => {
        state.notifications =
          [];

        state.unreadCount =
          0;

        state.pagination =
          null;

        state.loading =
          false;

        state.refreshing =
          false;

        state.registeringDevice =
          false;

        state.error =
          null;

        state.initialized =
          false;
      },
    },


    /* =================================================
       EXTRA REDUCERS
    ================================================= */

    extraReducers: (
      builder
    ) => {
      builder

        /* =============================================
           GET NOTIFICATIONS
        ============================================= */

        .addCase(
          getMyNotifications.pending,

          (
            state,
            action
          ) => {
            const isRefresh =
              action.meta.arg
                ?.refresh ===
              true;


            if (
              isRefresh
            ) {
              state.refreshing =
                true;
            } else {
              state.loading =
                true;
            }


            state.error =
              null;
          }
        )

        .addCase(
          getMyNotifications.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.refreshing =
              false;

            state.error =
              null;


            const requestedPage =
              action.meta.arg
                ?.params
                ?.page ??
              1;


            /*
             * Page 1 हमेशा replace करेगी।
             * Page 2+ existing list में append करेगी।
             */
            if (
              requestedPage >
              1
            ) {
              const existingIds =
                new Set(
                  state.notifications.map(
                    (
                      notification
                    ) =>
                      notification._id
                  )
                );


              const newNotifications =
                action.payload.notifications.filter(
                  (
                    notification
                  ) =>
                    !existingIds.has(
                      notification._id
                    )
                );


              state.notifications.push(
                ...newNotifications
              );
            } else {
              state.notifications =
                action.payload.notifications;
            }


            state.pagination =
              action.payload.pagination;

            state.unreadCount =
              Math.max(
                0,
                action.payload.unreadCount
              );

            state.initialized =
              true;
          }
        )

        .addCase(
          getMyNotifications.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.refreshing =
              false;

            state.error =
              action.payload ??
              "Failed to fetch notifications";

            state.initialized =
              true;
          }
        )


        /* =============================================
           GET UNREAD COUNT
        ============================================= */

        .addCase(
          getUnreadNotificationCount
            .fulfilled,

          (
            state,
            action
          ) => {
            state.unreadCount =
              Math.max(
                0,
                action.payload
              );
          }
        )

        .addCase(
          getUnreadNotificationCount
            .rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload ??
              "Failed to fetch unread notification count";
          }
        )


        /* =============================================
           MARK ONE AS READ
        ============================================= */

        .addCase(
          markNotificationAsRead
            .pending,

          (
            state
          ) => {
            state.error =
              null;
          }
        )

        .addCase(
          markNotificationAsRead
            .fulfilled,

          (
            state,
            action
          ) => {
            const index =
              state.notifications.findIndex(
                (
                  notification
                ) =>
                  notification._id ===
                  action.payload._id
              );


            if (
              index ===
              -1
            ) {
              return;
            }


            /*
             * noUncheckedIndexedAccess enabled होने पर
             * array item undefined हो सकती है।
             */
            const existingNotification =
              state.notifications[
                index
              ];


            if (
              !existingNotification
            ) {
              return;
            }


            const wasUnread =
              !existingNotification.isRead;


            state.notifications[
              index
            ] =
              action.payload;


            if (
              wasUnread &&
              action.payload.isRead
            ) {
              state.unreadCount =
                Math.max(
                  0,
                  state.unreadCount -
                    1
                );
            }
          }
        )

        .addCase(
          markNotificationAsRead
            .rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload ??
              "Failed to mark notification as read";
          }
        )


        /* =============================================
           MARK ALL AS READ
        ============================================= */

        .addCase(
          markAllNotificationsAsRead
            .pending,

          (
            state
          ) => {
            state.error =
              null;
          }
        )

        .addCase(
          markAllNotificationsAsRead
            .fulfilled,

          (
            state
          ) => {
            const currentReadTime =
              new Date()
                .toISOString();


            state.notifications.forEach(
              (
                notification
              ) => {
                if (
                  notification.isRead
                ) {
                  return;
                }


                notification.isRead =
                  true;

                notification.readAt =
                  currentReadTime;
              }
            );


            state.unreadCount =
              0;
          }
        )

        .addCase(
          markAllNotificationsAsRead
            .rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload ??
              "Failed to mark all notifications as read";
          }
        )


        /* =============================================
           DELETE NOTIFICATION
        ============================================= */

        .addCase(
          deleteNotification.pending,

          (
            state
          ) => {
            state.error =
              null;
          }
        )

        .addCase(
          deleteNotification.fulfilled,

          (
            state,
            action
          ) => {
            const deletedNotification =
              state.notifications.find(
                (
                  notification
                ) =>
                  notification._id ===
                  action.payload
              );


            state.notifications =
              state.notifications.filter(
                (
                  notification
                ) =>
                  notification._id !==
                  action.payload
              );


            if (
              deletedNotification &&
              !deletedNotification.isRead
            ) {
              state.unreadCount =
                Math.max(
                  0,
                  state.unreadCount -
                    1
                );
            }


            if (
              state.pagination
            ) {
              state.pagination.total =
                Math.max(
                  0,
                  state.pagination.total -
                    1
                );


              state.pagination.totalPages =
                state.pagination.total ===
                0
                  ? 0
                  : Math.ceil(
                      state.pagination.total /
                        state.pagination.limit
                    );


              if (
                state.pagination.page >
                state.pagination.totalPages &&
                state.pagination.totalPages >
                0
              ) {
                state.pagination.page =
                  state.pagination.totalPages;
              }
            }
          }
        )

        .addCase(
          deleteNotification.rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload ??
              "Failed to delete notification";
          }
        )


        /* =============================================
           REGISTER DEVICE
        ============================================= */

        .addCase(
          registerDeviceToken.pending,

          (
            state
          ) => {
            state.registeringDevice =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          registerDeviceToken.fulfilled,

          (
            state
          ) => {
            state.registeringDevice =
              false;
          }
        )

        .addCase(
          registerDeviceToken.rejected,

          (
            state,
            action
          ) => {
            state.registeringDevice =
              false;

            state.error =
              action.payload ??
              "Failed to register notification device";
          }
        )


        /* =============================================
           DEACTIVATE DEVICE
        ============================================= */

        .addCase(
          deactivateDeviceToken.pending,

          (
            state
          ) => {
            state.error =
              null;
          }
        )

        .addCase(
          deactivateDeviceToken.fulfilled,

          () => {
            /*
             * Device deactivate हो गया है।
             * Auth logout reducer notification state
             * को बाद में clear करेगा।
             */
          }
        )

        .addCase(
          deactivateDeviceToken.rejected,

          (
            state,
            action
          ) => {
            state.error =
              action.payload ??
              "Failed to deactivate notification device";
          }
        );
    },
  });


/* =====================================================
   ACTIONS
===================================================== */

export const {
  addReceivedNotification,

  setNotificationUnreadCount,

  markNotificationReadLocally,

  clearNotificationError,

  clearNotifications,
} =
  notificationSlice.actions;


/* =====================================================
   REDUCER
===================================================== */

export default
  notificationSlice.reducer;