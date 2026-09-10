// import React from "react";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

// import TeacherTabNavigator from "./teacher/TeacherTabNavigator";

// import TeacherTimetableScreen from "../screens/teacher/timetable/TeacherTimetableScreen";
// import TeacherSubjectsScreen from "../screens/teacher/subjects/TeacherSubjectsScreen";
// import TeacherSalaryScreen from "../screens/teacher/salary/TeacherSalaryScreen";
// import TeacherCreateHomeworkScreen from "../screens/teacher/homework/TeacherCreateHomeworkScreen";
// import TeacherHomeworkReviewScreen from "../screens/teacher/homework/TeacherHomeworkReviewScreen";

// import type {
//   TeacherStackParamList,
// } from "types/navigation.types";

// const Stack =
//   createNativeStackNavigator<TeacherStackParamList>();

// const TeacherNavigator = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="TeacherTabs"
//       screenOptions={{
//         headerShown: false,
//         animation: "slide_from_right",
//       }}
//     >
//       <Stack.Screen
//         name="TeacherTabs"
//         component={TeacherTabNavigator}
//       />

//       <Stack.Screen
//         name="Timetable"
//         component={TeacherTimetableScreen}
//       />

//       <Stack.Screen
//         name="Subjects"
//         component={TeacherSubjectsScreen}
//       />

//       <Stack.Screen
//         name="Salary"
//         component={TeacherSalaryScreen}
//       />

//       <Stack.Screen
//         name="CreateHomework"
//         component={TeacherCreateHomeworkScreen}
//       />

//       <Stack.Screen
//         name="HomeworkReview"
//         component={TeacherHomeworkReviewScreen}
//       />
//     </Stack.Navigator>
//   );
// };

// export default TeacherNavigator;


import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import TeacherTabNavigator
  from "./teacher/TeacherTabNavigator";

import NotificationScreen
  from "../screens/common/notifications/NotificationScreen";

import TeacherTimetableScreen
  from "../screens/teacher/timetable/TeacherTimetableScreen";

import TeacherSubjectsScreen
  from "../screens/teacher/subjects/TeacherSubjectsScreen";

import TeacherSalaryScreen
  from "../screens/teacher/salary/TeacherSalaryScreen";

import TeacherCreateHomeworkScreen
  from "../screens/teacher/homework/TeacherCreateHomeworkScreen";

import TeacherHomeworkReviewScreen
  from "../screens/teacher/homework/TeacherHomeworkReviewScreen";

import type {
  TeacherStackParamList,
} from "../../types/navigation.types";


/* =====================================================
   STACK
===================================================== */

const Stack =
  createNativeStackNavigator<
    TeacherStackParamList
  >();


/* =====================================================
   TEACHER NAVIGATOR
===================================================== */

const TeacherNavigator =
  () => {
    return (
      <Stack.Navigator
        initialRouteName="TeacherTabs"
        screenOptions={{
          headerShown:
            false,

          animation:
            "slide_from_right",
        }}
      >
        {/* ===========================================
            TEACHER BOTTOM TABS
        =========================================== */}

        <Stack.Screen
          name="TeacherTabs"
          component={
            TeacherTabNavigator
          }
        />


        {/* ===========================================
            NOTIFICATIONS
        =========================================== */}

        <Stack.Screen
          name="Notifications"
          component={
            NotificationScreen
          }
        />


        {/* ===========================================
            TEACHER SCREENS
        =========================================== */}

        <Stack.Screen
          name="Timetable"
          component={
            TeacherTimetableScreen
          }
        />

        <Stack.Screen
          name="Subjects"
          component={
            TeacherSubjectsScreen
          }
        />

        <Stack.Screen
          name="Salary"
          component={
            TeacherSalaryScreen
          }
        />

        <Stack.Screen
          name="CreateHomework"
          component={
            TeacherCreateHomeworkScreen
          }
        />

        <Stack.Screen
          name="HomeworkReview"
          component={
            TeacherHomeworkReviewScreen
          }
        />
      </Stack.Navigator>
    );
  };


export default
  TeacherNavigator;