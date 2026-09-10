


// import React from "react";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

// import type {
//   SchoolAdminStackParamList,
// } from "types/navigation.types";


// /* =====================================================
//    TAB NAVIGATOR
// ===================================================== */

// import SchoolAdminTabNavigator from "./schoolAdmin/SchoolAdminTabNavigator";


// /* =====================================================
//    SCHOOL ADMIN STACK SCREENS
// ===================================================== */

// import SchoolAttendanceScreen from "../screens/schoolAdmin/attendance/SchoolAttendanceScreen";

// import SubjectAssignmentScreen from "../screens/schoolAdmin/subjectAssignment/SubjectAssignmentScreen";

// import SchoolTimetableScreen from "../screens/schoolAdmin/timetable/SchoolTimetableScreen";

// import SchoolHomeworkScreen from "../screens/schoolAdmin/homework/SchoolHomeworkScreen";


// /* =====================================================
//    ACADEMIC SCREENS
// ===================================================== */

// import SchoolAdminSessionsScreen from "../screens/schoolAdmin/academics/SchoolAdminSessionsScreen";

// import SchoolAdminClassesScreen from "../screens/schoolAdmin/academics/SchoolAdminClassesScreen";

// import SchoolAdminSectionsScreen from "../screens/schoolAdmin/academics/SchoolAdminSectionsScreen";

// import SchoolAdminSubjectsScreen from "../screens/schoolAdmin/academics/SchoolAdminSubjectsScreen";


// /* =====================================================
//    NAVIGATOR
// ===================================================== */

// const Stack =
//   createNativeStackNavigator<
//     SchoolAdminStackParamList
//   >();


// const SchoolAdminNavigator =
//   () => {
//     return (
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,

//           animation:
//             "slide_from_right",

//           contentStyle: {
//             backgroundColor:
//               "#F7F7FB",
//           },
//         }}
//       >

//         {/* =============================================
//             MAIN TABS
//         ============================================= */}

//         <Stack.Screen
//           name="SchoolAdminTabs"
//           component={
//             SchoolAdminTabNavigator
//           }
//         />


//         {/* =============================================
//             ATTENDANCE
//         ============================================= */}

//         <Stack.Screen
//           name="Attendance"
//           component={
//             SchoolAttendanceScreen
//           }
//         />


//         {/* =============================================
//             SUBJECT ASSIGNMENT
//         ============================================= */}

//         <Stack.Screen
//           name="SubjectAssignment"
//           component={
//             SubjectAssignmentScreen
//           }
//         />


//         {/* =============================================
//             TIMETABLE
//         ============================================= */}

//         <Stack.Screen
//           name="Timetable"
//           component={
//             SchoolTimetableScreen
//           }
//         />


//         {/* =============================================
//             HOMEWORK
//         ============================================= */}

//         <Stack.Screen
//           name="Homework"
//           component={
//             SchoolHomeworkScreen
//           }
//         />


//         {/* =============================================
//             ACADEMIC SESSION
//         ============================================= */}

//         <Stack.Screen
//           name="Sessions"
//           component={
//             SchoolAdminSessionsScreen
//           }
//         />


//         {/* =============================================
//             CLASSES
//         ============================================= */}

//         <Stack.Screen
//           name="Classes"
//           component={
//             SchoolAdminClassesScreen
//           }
//         />


//         {/* =============================================
//             SECTIONS
//         ============================================= */}

//         <Stack.Screen
//           name="Sections"
//           component={
//             SchoolAdminSectionsScreen
//           }
//         />


//         {/* =============================================
//             SUBJECTS
//         ============================================= */}

//         <Stack.Screen
//           name="Subjects"
//           component={
//             SchoolAdminSubjectsScreen
//           }
//         />

//       </Stack.Navigator>
//     );
//   };


// export default SchoolAdminNavigator;


import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import type {
  SchoolAdminStackParamList,
} from "../../types/navigation.types";


/* =====================================================
   TAB NAVIGATOR
===================================================== */

import SchoolAdminTabNavigator
  from "./schoolAdmin/SchoolAdminTabNavigator";


/* =====================================================
   COMMON SCREENS
===================================================== */

import NotificationScreen
  from "../screens/common/notifications/NotificationScreen";


/* =====================================================
   SCHOOL ADMIN STACK SCREENS
===================================================== */

import SchoolAttendanceScreen
  from "../screens/schoolAdmin/attendance/SchoolAttendanceScreen";

import SubjectAssignmentScreen
  from "../screens/schoolAdmin/subjectAssignment/SubjectAssignmentScreen";

import SchoolTimetableScreen
  from "../screens/schoolAdmin/timetable/SchoolTimetableScreen";

import SchoolHomeworkScreen
  from "../screens/schoolAdmin/homework/SchoolHomeworkScreen";


/* =====================================================
   ACADEMIC SCREENS
===================================================== */

import SchoolAdminSessionsScreen
  from "../screens/schoolAdmin/academics/SchoolAdminSessionsScreen";

import SchoolAdminClassesScreen
  from "../screens/schoolAdmin/academics/SchoolAdminClassesScreen";

import SchoolAdminSectionsScreen
  from "../screens/schoolAdmin/academics/SchoolAdminSectionsScreen";

import SchoolAdminSubjectsScreen
  from "../screens/schoolAdmin/academics/SchoolAdminSubjectsScreen";


/* =====================================================
   NAVIGATOR
===================================================== */

const Stack =
  createNativeStackNavigator<
    SchoolAdminStackParamList
  >();


const SchoolAdminNavigator =
  () => {
    return (
      <Stack.Navigator
        initialRouteName="SchoolAdminTabs"
        screenOptions={{
          headerShown:
            false,

          animation:
            "slide_from_right",

          contentStyle: {
            backgroundColor:
              "#F7F7FB",
          },
        }}
      >
        {/* =============================================
            MAIN TABS
        ============================================= */}

        <Stack.Screen
          name="SchoolAdminTabs"
          component={
            SchoolAdminTabNavigator
          }
        />


        {/* =============================================
            NOTIFICATIONS
        ============================================= */}

        <Stack.Screen
          name="Notifications"
          component={
            NotificationScreen
          }
        />


        {/* =============================================
            ATTENDANCE
        ============================================= */}

        <Stack.Screen
          name="Attendance"
          component={
            SchoolAttendanceScreen
          }
        />


        {/* =============================================
            SUBJECT ASSIGNMENT
        ============================================= */}

        <Stack.Screen
          name="SubjectAssignment"
          component={
            SubjectAssignmentScreen
          }
        />


        {/* =============================================
            TIMETABLE
        ============================================= */}

        <Stack.Screen
          name="Timetable"
          component={
            SchoolTimetableScreen
          }
        />


        {/* =============================================
            HOMEWORK
        ============================================= */}

        <Stack.Screen
          name="Homework"
          component={
            SchoolHomeworkScreen
          }
        />


        {/* =============================================
            ACADEMIC SESSION
        ============================================= */}

        <Stack.Screen
          name="Sessions"
          component={
            SchoolAdminSessionsScreen
          }
        />


        {/* =============================================
            CLASSES
        ============================================= */}

        <Stack.Screen
          name="Classes"
          component={
            SchoolAdminClassesScreen
          }
        />


        {/* =============================================
            SECTIONS
        ============================================= */}

        <Stack.Screen
          name="Sections"
          component={
            SchoolAdminSectionsScreen
          }
        />


        {/* =============================================
            SUBJECTS
        ============================================= */}

        <Stack.Screen
          name="Subjects"
          component={
            SchoolAdminSubjectsScreen
          }
        />
      </Stack.Navigator>
    );
  };


export default
  SchoolAdminNavigator;