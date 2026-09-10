import {
  createNavigationContainerRef,
} from "@react-navigation/native";

import type {
  NotificationMetadata,
} from "../features/notifications/notification.types";

import type {
  RootStackParamList,
} from "../../types/navigation.types";


/* =====================================================
   NAVIGATION REF

   NavigationContainer में इसी ref का उपयोग होगा.
===================================================== */

export const navigationRef =
  createNavigationContainerRef<
    RootStackParamList
  >();


/* =====================================================
   USER ROLE
===================================================== */

export type NotificationUserRole =
  | "STUDENT"
  | "TEACHER"
  | "SCHOOL_ADMIN";


/* =====================================================
   NAVIGATE STUDENT
===================================================== */

const navigateStudentNotification =
  (
    screen: string,
    _metadata:
      NotificationMetadata
  ): void => {
    switch (screen) {
      case "Subjects":
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "StudentTabs",

            params: {
              screen:
                "Subjects",
            },
          }
        );

        return;


      case "Attendance":
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "StudentTabs",

            params: {
              screen:
                "Attendance",
            },
          }
        );

        return;


      case "Homework":
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "StudentTabs",

            params: {
              screen:
                "Homework",
            },
          }
        );

        return;


      case "Timetable":
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "Timetable",
          }
        );

        return;


      case "Profile":
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "StudentTabs",

            params: {
              screen:
                "Profile",
            },
          }
        );

        return;


      default:
        navigationRef.navigate(
          "StudentApp",
          {
            screen:
              "StudentTabs",

            params: {
              screen:
                "Home",
            },
          }
        );
    }
  };


/* =====================================================
   NAVIGATE TEACHER
===================================================== */

const navigateTeacherNotification =
  (
    screen: string,
    _metadata:
      NotificationMetadata
  ): void => {
    switch (screen) {
      case "Subjects":
        navigationRef.navigate(
          "TeacherApp",
          {
            screen:
              "Subjects",
          }
        );

        return;

case "Attendance":
  navigationRef.navigate(
    "TeacherApp",
    {
      screen:
        "TeacherTabs",

      params: {
        screen:
          "Attendance",
      },
    }
  );

  return;
        return;


      case "Homework":
        navigationRef.navigate(
          "TeacherApp",
          {
            screen:
              "TeacherTabs",

            params: {
              screen:
                "Homework",
            },
          }
        );

        return;


      case "Timetable":
        navigationRef.navigate(
          "TeacherApp",
          {
            screen:
              "Timetable",
          }
        );

        return;


      case "Profile":
        navigationRef.navigate(
          "TeacherApp",
          {
            screen:
              "TeacherTabs",

            params: {
              screen:
                "Profile",
            },
          }
        );

        return;


      default:
        navigationRef.navigate(
          "TeacherApp",
          {
            screen:
              "TeacherTabs",

            params: {
              screen:
                "Home",
            },
          }
        );
    }
  };


/* =====================================================
   NAVIGATE SCHOOL ADMIN
===================================================== */

const navigateSchoolAdminNotification =
  (
    screen: string,
    _metadata:
      NotificationMetadata
  ): void => {
    switch (screen) {
      case "Attendance":
        navigationRef.navigate(
          "SchoolAdminApp",
          {
            screen:
              "Attendance",
          }
        );

        return;


      case "Timetable":
        navigationRef.navigate(
          "SchoolAdminApp",
          {
            screen:
              "Timetable",
          }
        );

        return;


      case "Homework":
        navigationRef.navigate(
          "SchoolAdminApp",
          {
            screen:
              "Homework",
          }
        );

        return;


      case "Subjects":
        navigationRef.navigate(
          "SchoolAdminApp",
          {
            screen:
              "Subjects",
          }
        );

        return;


      default:
        navigationRef.navigate(
          "SchoolAdminApp",
          {
            screen:
              "SchoolAdminTabs",

            params: {
              screen:
                "Home",
            },
          }
        );
    }
  };


/* =====================================================
   HANDLE NOTIFICATION NAVIGATION
===================================================== */

export const navigateFromNotification =
  (
    role:
      NotificationUserRole,

    screen: string,

    metadata:
      NotificationMetadata
  ): void => {
    if (
      !navigationRef.isReady()
    ) {
      return;
    }

    if (
      role ===
      "STUDENT"
    ) {
      navigateStudentNotification(
        screen,
        metadata
      );

      return;
    }

    if (
      role ===
      "TEACHER"
    ) {
      navigateTeacherNotification(
        screen,
        metadata
      );

      return;
    }

    if (
      role ===
      "SCHOOL_ADMIN"
    ) {
      navigateSchoolAdminNotification(
        screen,
        metadata
      );
    }
  };