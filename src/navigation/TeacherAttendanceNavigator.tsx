import React from "react";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import TeacherAttendanceHomeScreen from "@/screens/teacher/attendance/TeacherAttendanceHomeScreen";
import TeacherAttendanceScreen from "@/screens/teacher/attendance/TeacherAttendanceScreen";
import MyTeacherAttendanceScreen from "@/screens/teacher/attendance/MyTeacherAttendanceScreen";

export type TeacherAttendanceStackParamList = {
  AttendanceHome: undefined;
  StudentAttendance: undefined;
  MyAttendance: undefined;
};

const Stack =
  createNativeStackNavigator<TeacherAttendanceStackParamList>();

const TeacherAttendanceNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AttendanceHome"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="AttendanceHome"
        component={TeacherAttendanceHomeScreen}
      />

      <Stack.Screen
        name="StudentAttendance"
        component={TeacherAttendanceScreen}
      />

      <Stack.Screen
        name="MyAttendance"
        component={MyTeacherAttendanceScreen}
      />
    </Stack.Navigator>
  );
};

export default TeacherAttendanceNavigator;
