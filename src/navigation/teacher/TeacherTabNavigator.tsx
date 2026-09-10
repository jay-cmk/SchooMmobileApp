// import React from "react";

// import {
//   createBottomTabNavigator,
// } from "@react-navigation/bottom-tabs";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import TeacherDashboardScreen from "../../screens/teacher/dashboard/TeacherDashboardScreen";
// import TeacherClassesScreen from "../../screens/teacher/classes/TeacherClassesScreen";
// import TeacherAttendanceScreen from "../../screens/teacher/attendance/TeacherAttendanceScreen";
// import TeacherHomeworkScreen from "../../screens/teacher/homework/TeacherHomeworkScreen";
// import TeacherProfileScreen from "../../screens/teacher/profile/TeacherProfileScreen";

// import type {
//   TeacherTabParamList,
// } from "types/navigation.types";

// const Tab =
//   createBottomTabNavigator<TeacherTabParamList>();

// const TeacherTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,

//         tabBarActiveTintColor: "#4355D8",

//         tabBarInactiveTintColor: "#8C94A6",

//         tabBarStyle: {
//           height: 68,
//           paddingTop: 7,
//           paddingBottom: 8,
//           borderTopWidth: 1,
//           borderTopColor: "#E5E8F0",
//           backgroundColor: "#FFFFFF",
//         },

//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: "700",
//         },

//         tabBarIcon: ({
//           color,
//           size,
//           focused,
//         }) => {
//           let iconName:
//             | keyof typeof Ionicons.glyphMap =
//             "home-outline";

//           if (route.name === "Home") {
//             iconName = focused
//               ? "home"
//               : "home-outline";
//           }

//           if (route.name === "Classes") {
//             iconName = focused
//               ? "people"
//               : "people-outline";
//           }

//           if (route.name === "Attendance") {
//             iconName = focused
//               ? "checkmark-circle"
//               : "checkmark-circle-outline";
//           }

//           if (route.name === "Homework") {
//             iconName = focused
//               ? "document-text"
//               : "document-text-outline";
//           }

//           if (route.name === "Profile") {
//             iconName = focused
//               ? "person"
//               : "person-outline";
//           }

//           return (
//             <Ionicons
//               name={iconName}
//               size={size}
//               color={color}
//             />
//           );
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={TeacherDashboardScreen}
//       />

//       <Tab.Screen
//         name="Classes"
//         component={TeacherClassesScreen}
//       />

//       <Tab.Screen
//         name="Attendance"
//         component={TeacherAttendanceScreen}
//       />

//       <Tab.Screen
//         name="Homework"
//         component={TeacherHomeworkScreen}
//       />

//       <Tab.Screen
//         name="Profile"
//         component={TeacherProfileScreen}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TeacherTabNavigator;


import React from "react";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  Ionicons,
} from "@expo/vector-icons";

import TeacherDashboardScreen from "../../screens/teacher/dashboard/TeacherDashboardScreen";
import TeacherClassesScreen from "../../screens/teacher/classes/TeacherClassesScreen";
import TeacherHomeworkScreen from "../../screens/teacher/homework/TeacherHomeworkScreen";
import TeacherProfileScreen from "../../screens/teacher/profile/TeacherProfileScreen";

import type {
  TeacherTabParamList,
} from "types/navigation.types";
import TeacherAttendanceNavigator from "../TeacherAttendanceNavigator";

const Tab =
  createBottomTabNavigator<TeacherTabParamList>();

const TeacherTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4355D8",
        tabBarInactiveTintColor: "#8C94A6",
        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: "#E5E8F0",
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap =
            "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "Classes") {
            iconName = focused ? "people" : "people-outline";
          }

          if (route.name === "Attendance") {
            iconName = focused
              ? "checkmark-circle"
              : "checkmark-circle-outline";
          }

          if (route.name === "Homework") {
            iconName = focused
              ? "document-text"
              : "document-text-outline";
          }

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={TeacherDashboardScreen}
      />

      <Tab.Screen
        name="Classes"
        component={TeacherClassesScreen}
      />

      <Tab.Screen
        name="Attendance"
        component={TeacherAttendanceNavigator}
      />

      <Tab.Screen
        name="Homework"
        component={TeacherHomeworkScreen}
      />

      <Tab.Screen
        name="Profile"
        component={TeacherProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TeacherTabNavigator;
