import {
  useEffect,
  useRef,
} from "react";

import {
  addReceivedNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  registerDeviceToken,
} from "../features/notifications/notification.slice";

import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getInitialNotificationResponse,
  prepareNotificationDevice,
  setNotificationBadgeCount,
} from "../services/expoNotification.service";

import {
  connectSocket,
  disconnectSocket,
  subscribeToNewNotification,
} from "../services/socket.service";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hook";

import type {
  NotificationMetadata,
} from "../features/notifications/notification.types";


/* =====================================================
   HOOK PROPS
===================================================== */

interface UseNotificationsProps {
  enabled:
    boolean;

  onNotificationPress?: (
    screen: string,

    metadata:
      NotificationMetadata
  ) => void;
}


/* =====================================================
   NORMALIZE NOTIFICATION METADATA
===================================================== */

const normalizeMetadata = (
  value: unknown
): NotificationMetadata => {
  const metadata:
    NotificationMetadata = {};

  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return metadata;
  }

  const rawData =
    value as Record<
      string,
      unknown
    >;

  Object.entries(
    rawData
  ).forEach(
    ([
      key,
      item,
    ]) => {
      if (
        typeof item ===
          "string" ||
        typeof item ===
          "number" ||
        typeof item ===
          "boolean"
      ) {
        metadata[key] =
          item;
      }
    }
  );

  return metadata;
};


/* =====================================================
   USE NOTIFICATIONS
===================================================== */

export const useNotifications =
  ({
    enabled,
    onNotificationPress,
  }: UseNotificationsProps): void => {
    const dispatch =
      useAppDispatch();

    const unreadCount =
      useAppSelector(
        (state) =>
          state.notifications
            .unreadCount
      );

    const registrationStartedRef =
      useRef(false);

    const initialNotificationHandledRef =
      useRef(false);


    /* =================================================
       RESET AFTER LOGOUT
    ================================================= */

    useEffect(() => {
      if (enabled) {
        return;
      }

      registrationStartedRef.current =
        false;

      initialNotificationHandledRef.current =
        false;
    }, [
      enabled,
    ]);


    /* =================================================
       CONNECT SOCKET.IO

       App open रहने पर notification:new event
       instantly receive होगा.
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        disconnectSocket();

        return;
      }

      let cancelled =
        false;

      let unsubscribeNotification:
        (() => void) | null =
        null;

      const startSocket =
        async (): Promise<void> => {
          try {
            const connectedSocket =
              await connectSocket();

            if (
              cancelled
            ) {
              return;
            }

            if (
              !connectedSocket
            ) {
              console.log(
                "Socket connection was not created"
              );

              return;
            }

            unsubscribeNotification =
              subscribeToNewNotification(
                (
                  notification
                ) => {
                  /*
                   * Reducer notification ID check करके
                   * duplicate record prevent करेगा.
                   */
                  dispatch(
                    addReceivedNotification(
                      notification
                    )
                  );
                }
              );
          } catch (
            error
          ) {
            console.log(
              "SOCKET START ERROR:",
              error
            );
          }
        };

      void startSocket();

      return () => {
        cancelled =
          true;

        unsubscribeNotification
          ?.();

        disconnectSocket();
      };
    }, [
      dispatch,
      enabled,
    ]);


    /* =================================================
       REGISTER EXPO DEVICE TOKEN

       Login के बाद केवल एक बार:
       - Notification permission
       - Expo token
       - Backend device registration
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        return;
      }

      if (
        registrationStartedRef
          .current
      ) {
        return;
      }

      registrationStartedRef.current =
        true;

      const registerDevice =
        async (): Promise<void> => {
          try {
            const device =
              await prepareNotificationDevice();

            if (!device) {
              return;
            }

            await dispatch(
              registerDeviceToken(
                device
              )
            ).unwrap();
          } catch (
            error
          ) {
            console.log(
              "NOTIFICATION DEVICE REGISTRATION ERROR:",
              error
            );

            /*
             * अगली बार retry allow करें.
             */
            registrationStartedRef.current =
              false;
          }
        };

      void registerDevice();
    }, [
      dispatch,
      enabled,
    ]);


    /* =================================================
       FETCH NOTIFICATIONS AFTER LOGIN
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        return;
      }

      dispatch(
        getMyNotifications({
          params: {
            page:
              1,

            limit:
              20,
          },
        })
      );

      dispatch(
        getUnreadNotificationCount()
      );
    }, [
      dispatch,
      enabled,
    ]);


    /* =================================================
       UPDATE APP ICON BADGE
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        void setNotificationBadgeCount(
          0
        );

        return;
      }

      void setNotificationBadgeCount(
        unreadCount
      );
    }, [
      enabled,
      unreadCount,
    ]);


    /* =================================================
       EXPO FOREGROUND PUSH LISTENER

       Push notification आने पर:
       - Banner और sound Expo handler दिखाएगा
       - Backend से latest list refresh होगी
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        return;
      }

      const receivedSubscription =
        addNotificationReceivedListener(
          () => {
            dispatch(
              getMyNotifications({
                params: {
                  page:
                    1,

                  limit:
                    20,
                },

                refresh:
                  true,
              })
            );

            dispatch(
              getUnreadNotificationCount()
            );
          }
        );

      return () => {
        receivedSubscription
          .remove();
      };
    }, [
      dispatch,
      enabled,
    ]);


    /* =================================================
       NOTIFICATION CLICK LISTENER

       App foreground/background में notification click.
    ================================================= */

    useEffect(() => {
      if (!enabled) {
        return;
      }

      const responseSubscription =
        addNotificationResponseListener(
          (
            response
          ) => {
            const rawData =
              response
                .notification
                .request
                .content
                .data;

            const metadata =
              normalizeMetadata(
                rawData
              );

            const screen =
              typeof metadata
                .screen ===
              "string"
                ? metadata
                    .screen
                : "";

            if (
              screen &&
              onNotificationPress
            ) {
              onNotificationPress(
                screen,
                metadata
              );
            }

            dispatch(
              getMyNotifications({
                params: {
                  page:
                    1,

                  limit:
                    20,
                },

                refresh:
                  true,
              })
            );

            dispatch(
              getUnreadNotificationCount()
            );
          }
        );

      return () => {
        responseSubscription
          .remove();
      };
    }, [
      dispatch,
      enabled,
      onNotificationPress,
    ]);


    /* =================================================
       HANDLE COLD-START NOTIFICATION

       App बंद थी और notification click से खुली.
    ================================================= */

    useEffect(() => {
      if (
        !enabled ||
        initialNotificationHandledRef
          .current
      ) {
        return;
      }

      const handleInitialNotification =
        async (): Promise<void> => {
          try {
            const response =
              await getInitialNotificationResponse();

            if (!response) {
              return;
            }

            initialNotificationHandledRef.current =
              true;

            const rawData =
              response
                .notification
                .request
                .content
                .data;

            const metadata =
              normalizeMetadata(
                rawData
              );

            const screen =
              typeof metadata
                .screen ===
              "string"
                ? metadata
                    .screen
                : "";

            if (
              screen &&
              onNotificationPress
            ) {
              onNotificationPress(
                screen,
                metadata
              );
            }

            dispatch(
              getMyNotifications({
                params: {
                  page:
                    1,

                  limit:
                    20,
                },

                refresh:
                  true,
              })
            );

            dispatch(
              getUnreadNotificationCount()
            );
          } catch (
            error
          ) {
            console.log(
              "INITIAL NOTIFICATION ERROR:",
              error
            );
          }
        };

      void handleInitialNotification();
    }, [
      dispatch,
      enabled,
      onNotificationPress,
    ]);
  };