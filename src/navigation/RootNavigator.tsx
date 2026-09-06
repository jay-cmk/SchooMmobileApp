







// // import React, {
// //   useEffect,
// // } from "react";

// // import {
// //   ActivityIndicator,
// //   Text,
// //   View,
// // } from "react-native";

// // import {
// //   NavigationContainer,
// // } from "@react-navigation/native";

// // import {
// //   createNativeStackNavigator,
// // } from "@react-navigation/native-stack";

// // import LoginScreen from "../screens/auth/LoginScreen";

// // import StudentNavigator from "./StudentNavigator";

// // import TeacherNavigator from "./TeacherNavigator";

// // import {
// //   restoreAuth,
// // } from "../features/auth/auth.slice";

// // import {
// //   useAppDispatch,
// //   useAppSelector,
// // } from "../store/hook";

// // import {
// //   UserRole,
// // } from "types/auth.types";

// // import type {
// //   RootStackParamList,
// // } from "types/navigation.types";

// // const Stack =
// //   createNativeStackNavigator<RootStackParamList>();

// // const RootNavigator = () => {
// //   const dispatch =
// //     useAppDispatch();

// //   const {
// //     user,
// //     accessToken,
// //     authInitialized,
// //   } =
// //     useAppSelector(
// //       (state) =>
// //         state.auth
// //     );

// //   /* =====================================================
// //      RESTORE LOGIN ON APP START
// //   ===================================================== */

// //   useEffect(() => {
// //     dispatch(
// //       restoreAuth()
// //     );
// //   }, [dispatch]);

// //   /* =====================================================
// //      INITIAL AUTH LOADING
// //   ===================================================== */

// //   if (!authInitialized) {
// //     return (
// //       <View className="flex-1 items-center justify-center bg-[#F7F7FB]">

// //         <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#4355D8]">
// //           <Text className="text-4xl">
// //             🎓
// //           </Text>
// //         </View>

// //         <ActivityIndicator
// //           className="mt-7"
// //           size="large"
// //           color="#4355D8"
// //         />

// //         <Text className="mt-3 text-sm font-medium text-[#606F88]">
// //           Preparing your account...
// //         </Text>

// //       </View>
// //     );
// //   }

// //   /* =====================================================
// //      NAVIGATION
// //   ===================================================== */

// //   return (
// //     <NavigationContainer>

// //       <Stack.Navigator
// //         screenOptions={{
// //           headerShown: false,
// //           animation: "fade",
// //         }}
// //       >

// //         {/* ==============================================
// //             NOT LOGGED IN
// //         ============================================== */}

// //         {!accessToken ||
// //         !user ? (
// //           <Stack.Screen
// //             name="Login"
// //             component={
// //               LoginScreen
// //             }
// //           />
// //         ) : user.role ===
// //           UserRole.STUDENT ? (
// //           /* ============================================
// //              STUDENT
// //           ============================================ */

// //           <Stack.Screen
// //             name="StudentApp"
// //             component={
// //               StudentNavigator
// //             }
// //           />
// //         ) : user.role ===
// //           UserRole.TEACHER ? (
// //           /* ============================================
// //              TEACHER
// //           ============================================ */

// //           <Stack.Screen
// //             name="TeacherApp"
// //             component={
// //               TeacherNavigator
// //             }
// //           />
// //         ) : (
// //           /* ============================================
// //              OTHER ROLES

// //              Mobile app currently Student + Teacher only.
// //           ============================================ */

// //           <Stack.Screen
// //             name="Login"
// //             component={
// //               LoginScreen
// //             }
// //           />
// //         )}

// //       </Stack.Navigator>

// //     </NavigationContainer>
// //   );
// // };

// // export default RootNavigator;







// import React, {
//   useEffect,
// } from "react";

// import {
//   ActivityIndicator,
//   Text,
//   View,
// } from "react-native";

// import {
//   NavigationContainer,
// } from "@react-navigation/native";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

// import LoginScreen from "../screens/auth/LoginScreen";

// import StudentNavigator from "./StudentNavigator";

// import TeacherNavigator from "./TeacherNavigator";

// import SchoolAdminNavigator from "./SchoolAdminNavigator";

// import {
//   restoreAuth,
// } from "../features/auth/auth.slice";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../store/hook";

// import {
//   UserRole,
// } from "types/auth.types";

// import type {
//   RootStackParamList,
// } from "types/navigation.types";


// const Stack =
//   createNativeStackNavigator<
//     RootStackParamList
//   >();


// const RootNavigator = () => {
//   const dispatch =
//     useAppDispatch();

//   const {
//     user,
//     accessToken,
//     authInitialized,
//   } =
//     useAppSelector(
//       (state) =>
//         state.auth
//     );


//   /* =====================================================
//      RESTORE LOGIN ON APP START
//   ===================================================== */

//   useEffect(() => {
//     dispatch(
//       restoreAuth()
//     );
//   }, [dispatch]);


//   /* =====================================================
//      INITIAL AUTH LOADING
//   ===================================================== */

//   if (!authInitialized) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#F7F7FB]">

//         <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#4355D8]">

//           <Text className="text-4xl">
//             🎓
//           </Text>

//         </View>

//         <ActivityIndicator
//           className="mt-7"
//           size="large"
//           color="#4355D8"
//         />

//         <Text className="mt-3 text-sm font-medium text-[#606F88]">
//           Preparing your account...
//         </Text>

//       </View>
//     );
//   }


//   /* =====================================================
//      NAVIGATION
//   ===================================================== */

//   return (
//     <NavigationContainer>

//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           animation: "fade",
//         }}
//       >

//         {/* ==============================================
//             NOT LOGGED IN
//         ============================================== */}

//         {!accessToken ||
//         !user ? (

//           <Stack.Screen
//             name="Login"
//             component={
//               LoginScreen
//             }
//           />

//         ) : user.role ===
//           UserRole.STUDENT ? (

//           /* ============================================
//              STUDENT
//           ============================================ */

//           <Stack.Screen
//             name="StudentApp"
//             component={
//               StudentNavigator
//             }
//           />

//         ) : user.role ===
//           UserRole.TEACHER ? (

//           /* ============================================
//              TEACHER
//           ============================================ */

//           <Stack.Screen
//             name="TeacherApp"
//             component={
//               TeacherNavigator
//             }
//           />

//         ) : user.role ===
//           UserRole.SCHOOL_ADMIN ? (

//           /* ============================================
//              SCHOOL ADMIN
//           ============================================ */

//           <Stack.Screen
//             name="SchoolAdminApp"
//             component={
//               SchoolAdminNavigator
//             }
//           />

//         ) : (

//           /* ============================================
//              UNSUPPORTED MOBILE ROLE
//           ============================================ */

//           <Stack.Screen
//             name="Login"
//             component={
//               LoginScreen
//             }
//           />

//         )}

//       </Stack.Navigator>

//     </NavigationContainer>
//   );
// };


// export default RootNavigator;





import React, { useEffect } from "react";

import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import StudentNavigator from "./StudentNavigator";
import TeacherNavigator from "./TeacherNavigator";
import SchoolAdminNavigator from "./SchoolAdminNavigator";

import {
  restoreAuth,
  sessionExpired,
} from "../features/auth/auth.slice";

import { setUnauthorizedHandler } from "../api/axios";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hook";

import { UserRole } from "types/auth.types";
import type { RootStackParamList } from "types/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();

  const {
    user,
    accessToken,
    authInitialized,
  } = useAppSelector((state) => state.auth);

  /* =====================================================
     RESTORE LOGIN ON APP START
  ===================================================== */

  useEffect(() => {
    void dispatch(restoreAuth());
  }, [dispatch]);

  /* =====================================================
     GLOBAL TOKEN EXPIRY HANDLER

     Kisi bhi API se 401 milte hi axios storage clear
     karega aur ye Redux auth state clear karega.
     State clear hote hi navigator Login show karega.
  ===================================================== */

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(sessionExpired());
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [dispatch]);

  if (!authInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#4355D8]">
          <Text className="text-4xl">🎓</Text>
        </View>

        <ActivityIndicator
          className="mt-7"
          size="large"
          color="#4355D8"
        />

        <Text className="mt-3 text-sm font-medium text-[#606F88]">
          Preparing your account...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {!accessToken || !user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        ) : user.role === UserRole.STUDENT ? (
          <Stack.Screen
            name="StudentApp"
            component={StudentNavigator}
          />
        ) : user.role === UserRole.TEACHER ? (
          <Stack.Screen
            name="TeacherApp"
            component={TeacherNavigator}
          />
        ) : user.role === UserRole.SCHOOL_ADMIN ? (
          <Stack.Screen
            name="SchoolAdminApp"
            component={SchoolAdminNavigator}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
