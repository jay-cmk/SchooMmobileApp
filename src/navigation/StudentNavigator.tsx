import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import StudentDashboardScreen from "@/screens/student/dashboard/StudentDashboardScreen";


export type StudentStackParamList = {
  StudentDashboard: undefined;
};

const Stack =
  createNativeStackNavigator<StudentStackParamList>();

const StudentNavigator =
  () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="StudentDashboard"
          component={
            StudentDashboardScreen
          }
        />
      </Stack.Navigator>
    );
  };

export default StudentNavigator;