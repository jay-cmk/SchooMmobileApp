import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  Ionicons,
} from "@expo/vector-icons";

import StudentDashboardScreen from "../../screens/student/dashboard/StudentDashboardScreen";
import StudentSubjectsScreen from "../../screens/student/subjects/StudentSubjectsScreen";
import StudentAttendanceScreen from "../../screens/student/attendance/StudentAttendanceScreen";
import StudentHomeworkScreen from "../../screens/student/homework/StudentHomeworkScreen";
import StudentProfileScreen from "../../screens/student/profile/StudentProfileScreen";
import { StudentTabParamList } from "types/navigation.types";



const Tab =
  createBottomTabNavigator<StudentTabParamList>();

const StudentTabNavigator =
  () => {
    return (
      <Tab.Navigator
        screenOptions={({
          route,
        }) => ({
          headerShown: false,

          tabBarActiveTintColor:
            "#4355D8",

          tabBarInactiveTintColor:
            "#7C8497",

          tabBarStyle: {
            height: 72,
            paddingTop: 7,
            paddingBottom: 8,

            backgroundColor:
              "#FFFFFF",

            borderTopWidth: 1,

            borderTopColor:
              "#E5E8F0",
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
          },

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => {
            let icon:
              keyof typeof Ionicons.glyphMap =
              "home-outline";

            if (
              route.name ===
              "Home"
            ) {
              icon = focused
                ? "home"
                : "home-outline";
            }

            if (
              route.name ===
              "Subjects"
            ) {
              icon = focused
                ? "book"
                : "book-outline";
            }

            if (
              route.name ===
              "Attendance"
            ) {
              icon = focused
                ? "stats-chart"
                : "stats-chart-outline";
            }

            if (
              route.name ===
              "Homework"
            ) {
              icon = focused
                ? "document-text"
                : "document-text-outline";
            }

            if (
              route.name ===
              "Profile"
            ) {
              icon = focused
                ? "person"
                : "person-outline";
            }

            return (
              <Ionicons
                name={icon}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={
            StudentDashboardScreen
          }
        />

        <Tab.Screen
          name="Subjects"
          component={
            StudentSubjectsScreen
          }
        />

        <Tab.Screen
          name="Attendance"
          component={
            StudentAttendanceScreen
          }
        />

        <Tab.Screen
          name="Homework"
          component={
            StudentHomeworkScreen
          }
        />

        <Tab.Screen
          name="Profile"
          component={
            StudentProfileScreen
          }
        />
      </Tab.Navigator>
    );
  };

export default StudentTabNavigator;