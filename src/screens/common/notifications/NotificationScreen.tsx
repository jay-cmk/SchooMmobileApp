import React, {
  useCallback,
  useEffect,
  useMemo,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
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

import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../../features/notifications/notification.slice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/hook";

import {
  navigateFromNotification,
} from "../../../navigation/navigationRef";

import {
  UserRole,
} from "types/auth.types";

import type {
  NotificationData,
  NotificationMetadata,
  NotificationType,
} from "../../../features/notifications/notification.types";

import type {
  NotificationUserRole,
} from "../../../navigation/navigationRef";


/* =====================================================
   FORMAT NOTIFICATION TIME
===================================================== */

const formatNotificationTime = (
  value: string
): string => {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const now =
    new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const minutes =
    Math.floor(
      difference /
        60_000
    );

  if (
    minutes < 1
  ) {
    return "Just now";
  }

  if (
    minutes < 60
  ) {
    return `${minutes} min ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (
    hours < 24
  ) {
    return `${hours} hr ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (
    days < 7
  ) {
    return `${days} day${
      days > 1
        ? "s"
        : ""
    } ago`;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  );
};


/* =====================================================
   NOTIFICATION ICON
===================================================== */

const getNotificationIcon = (
  type:
    NotificationType
): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case "SUBJECT_ASSIGNED":
      return "book-outline";

    case "ELECTIVE_ASSIGNED":
      return "sparkles-outline";

    case "HOMEWORK_ASSIGNED":
      return "document-text-outline";

    case "STUDENT_ABSENT":
      return "alert-circle-outline";

    case "TIMETABLE_CHANGED":
      return "calendar-outline";

    case "GENERAL_NOTICE":
      return "megaphone-outline";

    default:
      return "notifications-outline";
  }
};


/* =====================================================
   NOTIFICATION COLOR
===================================================== */

const getNotificationColor = (
  type:
    NotificationType
): {
  color: string;
  background: string;
} => {
  switch (type) {
    case "SUBJECT_ASSIGNED":
      return {
        color:
          "#4355D8",

        background:
          "#EEF0FF",
      };

    case "ELECTIVE_ASSIGNED":
      return {
        color:
          "#C2410C",

        background:
          "#FFF7ED",
      };

    case "HOMEWORK_ASSIGNED":
      return {
        color:
          "#7C3AED",

        background:
          "#F5F3FF",
      };

    case "STUDENT_ABSENT":
      return {
        color:
          "#DC2626",

        background:
          "#FEF2F2",
      };

    case "TIMETABLE_CHANGED":
      return {
        color:
          "#0369A1",

        background:
          "#F0F9FF",
      };

    case "GENERAL_NOTICE":
      return {
        color:
          "#047857",

        background:
          "#ECFDF5",
      };

    default:
      return {
        color:
          "#475467",

        background:
          "#F2F4F7",
      };
  }
};


/* =====================================================
   SCREEN
===================================================== */

const NotificationScreen =
  () => {
    const navigation =
      useNavigation();

    const dispatch =
      useAppDispatch();

    const {
      user,
    } =
      useAppSelector(
        (state) =>
          state.auth
      );

    const {
      notifications,
      unreadCount,
      pagination,
      loading,
      refreshing,
      initialized,
      error,
    } =
      useAppSelector(
        (state) =>
          state.notifications
      );


    /* =================================================
       USER ROLE FOR NOTIFICATION NAVIGATION
    ================================================= */

    const notificationRole =
      useMemo<
        NotificationUserRole | null
      >(() => {
        if (
          user?.role ===
          UserRole.STUDENT
        ) {
          return "STUDENT";
        }

        if (
          user?.role ===
          UserRole.TEACHER
        ) {
          return "TEACHER";
        }

        if (
          user?.role ===
          UserRole.SCHOOL_ADMIN
        ) {
          return "SCHOOL_ADMIN";
        }

        return null;
      }, [
        user?.role,
      ]);


    /* =================================================
       INITIAL FETCH
    ================================================= */

    useEffect(() => {
      if (
        initialized
      ) {
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
    }, [
      dispatch,
      initialized,
    ]);


    /* =================================================
       REFRESH
    ================================================= */

    const handleRefresh =
      useCallback(() => {
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
      }, [
        dispatch,
      ]);


    /* =================================================
       LOAD NEXT PAGE
    ================================================= */

    const handleLoadMore =
      useCallback(() => {
        if (
          loading ||
          refreshing ||
          !pagination
        ) {
          return;
        }

        if (
          pagination.page >=
          pagination.totalPages
        ) {
          return;
        }

        dispatch(
          getMyNotifications({
            params: {
              page:
                pagination.page +
                1,

              limit:
                pagination.limit,
            },
          })
        );
      }, [
        dispatch,
        loading,
        pagination,
        refreshing,
      ]);


    /* =================================================
       MARK ALL AS READ
    ================================================= */

    const handleMarkAllAsRead =
      useCallback(
        async () => {
          if (
            unreadCount ===
            0
          ) {
            return;
          }

          try {
            await dispatch(
              markAllNotificationsAsRead()
            ).unwrap();
          } catch (
            markError
          ) {
            Alert.alert(
              "Unable to update",
              typeof markError ===
                "string"
                ? markError
                : "Could not mark notifications as read."
            );
          }
        },
        [
          dispatch,
          unreadCount,
        ]
      );


    /* =================================================
       OPEN NOTIFICATION
    ================================================= */

    const handleOpenNotification =
      useCallback(
        async (
          notification:
            NotificationData
        ) => {
          try {
            if (
              !notification
                .isRead
            ) {
              await dispatch(
                markNotificationAsRead(
                  notification._id
                )
              ).unwrap();
            }
          } catch (
            markError
          ) {
            console.log(
              "MARK NOTIFICATION READ ERROR:",
              markError
            );
          }

          const metadata:
            NotificationMetadata =
            notification
              .metadata ??
            {};

          const screen =
            metadata.screen;

          if (
            notificationRole &&
            typeof screen ===
              "string"
          ) {
            navigateFromNotification(
              notificationRole,
              screen,
              metadata
            );
          }
        },
        [
          dispatch,
          notificationRole,
        ]
      );


    /* =================================================
       DELETE NOTIFICATION
    ================================================= */

    const handleDeleteNotification =
      useCallback(
        (
          notification:
            NotificationData
        ) => {
          Alert.alert(
            "Delete notification",
            "Do you want to remove this notification?",
            [
              {
                text:
                  "Cancel",

                style:
                  "cancel",
              },

              {
                text:
                  "Delete",

                style:
                  "destructive",

                onPress:
                  () => {
                    void dispatch(
                      deleteNotification(
                        notification._id
                      )
                    );
                  },
              },
            ]
          );
        },
        [
          dispatch,
        ]
      );


    /* =================================================
       RENDER NOTIFICATION
    ================================================= */

    const renderNotification =
      useCallback(
        ({
          item,
        }: {
          item:
            NotificationData;
        }) => {
          return (
            <NotificationItem
              notification={
                item
              }
              onPress={() =>
                void handleOpenNotification(
                  item
                )
              }
              onDelete={() =>
                handleDeleteNotification(
                  item
                )
              }
            />
          );
        },
        [
          handleDeleteNotification,
          handleOpenNotification,
        ]
      );


    /* =================================================
       INITIAL LOADING
    ================================================= */

    if (
      loading &&
      !initialized
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F7FB]">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">
            <Ionicons
              name="notifications-outline"
              size={30}
              color="#4355D8"
            />
          </View>

          <ActivityIndicator
            className="mt-5"
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#667085]">
            Loading
            notifications...
          </Text>
        </SafeAreaView>
      );
    }


    /* =================================================
       UI
    ================================================= */

    return (
      <SafeAreaView
        className="flex-1 bg-[#F6F7FB]"
        edges={[
          "top",
        ]}
      >
        {/* HEADER */}

        <View className="flex-row items-center border-b border-[#E5E8F0] bg-white px-5 py-4">
          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#F2F4F7] active:opacity-70"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#15213B"
            />
          </Pressable>

          <View className="ml-4 flex-1">
            <Text className="text-xl font-extrabold text-[#15213B]">
              Notifications
            </Text>

            <Text className="mt-0.5 text-xs font-semibold text-[#667085]">
              {unreadCount >
              0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </Text>
          </View>

          {unreadCount >
          0 ? (
            <Pressable
              onPress={() =>
                void handleMarkAllAsRead()
              }
              className="rounded-xl bg-[#EEF0FF] px-3 py-2 active:opacity-70"
            >
              <Text className="text-xs font-bold text-[#4355D8]">
                Read all
              </Text>
            </Pressable>
          ) : null}
        </View>


        {/* ERROR */}

        {error &&
        notifications.length >
          0 ? (
          <View className="mx-5 mt-3 flex-row items-start rounded-xl border border-amber-200 bg-amber-50 p-3">
            <Ionicons
              name="warning-outline"
              size={18}
              color="#B54708"
            />

            <Text className="ml-2 flex-1 text-xs leading-5 text-amber-800">
              {error}
            </Text>
          </View>
        ) : null}


        {/* LIST */}

        <FlatList
          data={
            notifications
          }
          keyExtractor={(
            item
          ) =>
            item._id
          }
          renderItem={
            renderNotification
          }
          contentContainerStyle={{
            padding:
              20,

            paddingBottom:
              40,

            flexGrow:
              notifications.length ===
              0
                ? 1
                : undefined,
          }}
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
          onEndReached={
            handleLoadMore
          }
          onEndReachedThreshold={
            0.4
          }
          ListEmptyComponent={
            <EmptyNotificationState
              error={
                error
              }
              onRetry={
                handleRefresh
              }
            />
          }
          ListFooterComponent={
            loading &&
            initialized ? (
              <ActivityIndicator
                className="my-5"
                size="small"
                color="#4355D8"
              />
            ) : null
          }
        />
      </SafeAreaView>
    );
  };


/* =====================================================
   NOTIFICATION ITEM
===================================================== */

const NotificationItem = ({
  notification,
  onPress,
  onDelete,
}: {
  notification:
    NotificationData;

  onPress:
    () => void;

  onDelete:
    () => void;
}) => {
  const style =
    getNotificationColor(
      notification.type
    );

  return (
    <Pressable
      onPress={
        onPress
      }
      className={`mb-3 overflow-hidden rounded-2xl border bg-white p-4 active:opacity-80 ${
        notification.isRead
          ? "border-[#E5E8F0]"
          : "border-[#C7D2FE]"
      }`}
    >
      {!notification
        .isRead ? (
        <View className="absolute left-0 top-0 h-full w-1 bg-[#4355D8]" />
      ) : null}

      <View className="flex-row items-start">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor:
              style.background,
          }}
        >
          <Ionicons
            name={getNotificationIcon(
              notification.type
            )}
            size={23}
            color={
              style.color
            }
          />
        </View>

        <View className="ml-3 flex-1">
          <View className="flex-row items-start">
            <Text
              className={`flex-1 pr-2 text-sm text-[#15213B] ${
                notification
                  .isRead
                  ? "font-bold"
                  : "font-extrabold"
              }`}
              numberOfLines={
                2
              }
            >
              {
                notification.title
              }
            </Text>

            {!notification
              .isRead ? (
              <View className="mt-1.5 h-2 w-2 rounded-full bg-[#4355D8]" />
            ) : null}
          </View>

          <Text
            className="mt-1 text-xs leading-5 text-[#667085]"
            numberOfLines={
              3
            }
          >
            {
              notification.message
            }
          </Text>

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-[11px] font-semibold text-[#98A2B3]">
              {formatNotificationTime(
                notification
                  .createdAt
              )}
            </Text>

            <Pressable
              onPress={(
                event
              ) => {
                event.stopPropagation();

                onDelete();
              }}
              hitSlop={10}
              className="h-8 w-8 items-center justify-center rounded-lg bg-[#F9FAFB] active:bg-red-50"
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#98A2B3"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};


/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyNotificationState = ({
  error,
  onRetry,
}: {
  error:
    string | null;

  onRetry:
    () => void;
}) => {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#EEF0FF]">
        <Ionicons
          name={
            error
              ? "alert-circle-outline"
              : "notifications-off-outline"
          }
          size={36}
          color={
            error
              ? "#DC2626"
              : "#4355D8"
          }
        />
      </View>

      <Text className="mt-5 text-center text-xl font-extrabold text-[#15213B]">
        {error
          ? "Unable to load notifications"
          : "No notifications yet"}
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-[#667085]">
        {error ??
          "New school updates will appear here."}
      </Text>

      {error ? (
        <Pressable
          onPress={
            onRetry
          }
          className="mt-5 flex-row items-center rounded-xl bg-[#4355D8] px-5 py-3 active:opacity-80"
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color="#FFFFFF"
          />

          <Text className="ml-2 text-sm font-bold text-white">
            Try Again
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};


export default
  NotificationScreen;