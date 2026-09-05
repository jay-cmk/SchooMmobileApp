// import React from "react";

// import {
//   createBottomTabNavigator,
// } from "@react-navigation/bottom-tabs";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import type {
//   SchoolAdminTabParamList,
// } from "types/navigation.types";

// import SchoolAdminDashboardScreen from "../../screens/schoolAdmin/dashboard/SchoolAdminDashboardScreen";
// import SchoolAdminPlaceholderScreen from "components/common/SchoolAdminPlaceholderScreen";



// const Tab =
//   createBottomTabNavigator<
//     SchoolAdminTabParamList
//   >();


// const SchoolAdminTabNavigator =
//   () => {
//     return (
//       <Tab.Navigator
//         screenOptions={({
//           route,
//         }) => ({
//           headerShown: false,

//           tabBarActiveTintColor:
//             "#4355D8",

//           tabBarInactiveTintColor:
//             "#8A94A6",

//           tabBarStyle: {
//             height: 68,
//             paddingTop: 7,
//             paddingBottom: 8,
//           },

//           tabBarLabelStyle: {
//             fontSize: 10,
//             fontWeight: "700",
//           },

//           tabBarIcon: ({
//             color,
//             size,
//           }) => {
//             let icon:
//               React.ComponentProps<
//                 typeof Ionicons
//               >["name"] =
//               "home-outline";

//             switch (
//               route.name
//             ) {
//               case "Home":
//                 icon =
//                   "home-outline";
//                 break;

//               case "Students":
//                 icon =
//                   "people-outline";
//                 break;

//               case "Teachers":
//                 icon =
//                   "school-outline";
//                 break;

//               case "Academics":
//                 icon =
//                   "library-outline";
//                 break;

//               case "Profile":
//                 icon =
//                   "person-outline";
//                 break;
//             }

//             return (
//               <Ionicons
//                 name={icon}
//                 size={size}
//                 color={color}
//               />
//             );
//           },
//         })}
//       >

//         <Tab.Screen
//           name="Home"
//           component={
//             SchoolAdminDashboardScreen
//           }
//         />

//         <Tab.Screen name="Students">
//           {() => (
//             <SchoolAdminPlaceholderScreen
//               title="Students"
//               icon="people-outline"
//             />
//           )}
//         </Tab.Screen>

//         <Tab.Screen name="Teachers">
//           {() => (
//             <SchoolAdminPlaceholderScreen
//               title="Teachers"
//               icon="school-outline"
//             />
//           )}
//         </Tab.Screen>

//         <Tab.Screen name="Academics">
//           {() => (
//             <SchoolAdminPlaceholderScreen
//               title="Academics"
//               icon="library-outline"
//             />
//           )}
//         </Tab.Screen>

//         <Tab.Screen name="Profile">
//           {() => (
//             <SchoolAdminPlaceholderScreen
//               title="Profile"
//               icon="person-outline"
//             />
//           )}
//         </Tab.Screen>

//       </Tab.Navigator>
//     );
//   };

// export default SchoolAdminTabNavigator;

import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  SchoolAdminTabParamList,
} from "types/navigation.types";

import SchoolAdminDashboardScreen from "../../screens/schoolAdmin/dashboard/SchoolAdminDashboardScreen";

import SchoolAdminStudentsScreen from "../../screens/schoolAdmin/students/SchoolAdminStudentsScreen";

import SchoolAdminTeachersScreen from "../../screens/schoolAdmin/teachers/SchoolAdminTeachersScreen";

import SchoolAdminAcademicsScreen from "../../screens/schoolAdmin/academics/SchoolAdminAcademicsScreen";

import SchoolAdminProfileScreen from "../../screens/schoolAdmin/profile/SchoolAdminProfileScreen";


/* =====================================================
   TAB NAVIGATOR
===================================================== */

const Tab =
  createBottomTabNavigator<
    SchoolAdminTabParamList
  >();


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminTabNavigator =
  () => {
    return (
      <Tab.Navigator
        screenOptions={({
          route,
        }) => ({
          headerShown: false,

          tabBarHideOnKeyboard:
            true,

          tabBarActiveTintColor:
            "#4355D8",

          tabBarInactiveTintColor:
            "#8A94A6",

          tabBarStyle: {
            height: 72,

            paddingTop: 8,

            paddingBottom: 8,

            borderTopWidth: 1,

            borderTopColor:
              "#EEF0F5",

            backgroundColor:
              "#FFFFFF",

            elevation: 8,

            shadowColor:
              "#000000",

            shadowOpacity:
              0.05,

            shadowRadius: 10,

            shadowOffset: {
              width: 0,
              height: -2,
            },
          },

          tabBarLabelStyle: {
            fontSize: 10,

            fontWeight: "700",

            marginTop: 2,
          },

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => {
            let iconName:
              React.ComponentProps<
                typeof Ionicons
              >["name"];


            switch (
              route.name
            ) {
              case "Home":
                iconName =
                  focused
                    ? "home"
                    : "home-outline";

                break;


              case "Students":
                iconName =
                  focused
                    ? "people"
                    : "people-outline";

                break;


              case "Teachers":
                iconName =
                  focused
                    ? "school"
                    : "school-outline";

                break;


              case "Academics":
                iconName =
                  focused
                    ? "library"
                    : "library-outline";

                break;


              case "Profile":
                iconName =
                  focused
                    ? "person-circle"
                    : "person-circle-outline";

                break;


              default:
                iconName =
                  "ellipse-outline";
            }


            return (
              <Ionicons
                name={iconName}
                size={
                  focused
                    ? size + 2
                    : size
                }
                color={color}
              />
            );
          },
        })}
      >

        {/* HOME */}

        <Tab.Screen
          name="Home"
          component={
            SchoolAdminDashboardScreen
          }
          options={{
            title: "Home",
          }}
        />


        {/* STUDENTS */}

        <Tab.Screen
          name="Students"
          component={
            SchoolAdminStudentsScreen
          }
          options={{
            title: "Students",
          }}
        />


        {/* TEACHERS */}

        <Tab.Screen
          name="Teachers"
          component={
            SchoolAdminTeachersScreen
          }
          options={{
            title: "Teachers",
          }}
        />


        {/* ACADEMICS */}

        <Tab.Screen
          name="Academics"
          component={
            SchoolAdminAcademicsScreen
          }
          options={{
            title: "Academics",
          }}
        />


        {/* PROFILE */}

        <Tab.Screen
          name="Profile"
          component={
            SchoolAdminProfileScreen
          }
          options={{
            title: "Profile",
          }}
        />

      </Tab.Navigator>
    );
  };


export default SchoolAdminTabNavigator;