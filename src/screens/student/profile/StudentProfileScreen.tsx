// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   Text,
//   View,
// } from "react-native";

// import {
//   SafeAreaView,
// } from "react-native-safe-area-context";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import api from "../../../api/axios";



// import {
//   logout,
// } from "../../../features/auth/auth.slice";



// import {
//   extractApiData,
//   formatDate,
//   getName,
// } from "utils/studentHelpers";
// import { useAppDispatch } from "@/store/hook";
// import { StudentProfile } from "types/student.types";

// const StudentProfileScreen =
//   () => {
//     const dispatch =
//       useAppDispatch();

//     const [
//       profile,
//       setProfile,
//     ] =
//       useState<StudentProfile | null>(
//         null
//       );

//     const [
//       loading,
//       setLoading,
//     ] = useState(true);

//     useEffect(() => {
//       const load =
//         async () => {
//           try {
//             const response =
//               await api.get(
//                 "/students/me"
//               );

//             const data =
//               extractApiData(
//                 response
//               );

//             setProfile(
//               data?.student ??
//                 data
//             );
//           } finally {
//             setLoading(false);
//           }
//         };

//       load();
//     }, []);

//     const handleLogout =
//       () => {
//         Alert.alert(
//           "Logout",
//           "Do you want to logout?",
//           [
//             {
//               text: "Cancel",
//             },

//             {
//               text: "Logout",
//               style:
//                 "destructive",

//               onPress:
//                 async () => {
//                   await dispatch(
//                     logout()
//                   );
//                 },
//             },
//           ]
//         );
//       };

//     if (loading) {
//       return (
//         <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
//           <ActivityIndicator
//             color="#4355D8"
//           />
//         </SafeAreaView>
//       );
//     }

//     return (
//       <SafeAreaView className="flex-1 bg-[#F7F7FB] px-5 pt-6">

//         <View className="items-center">
//           <View className="h-24 w-24 items-center justify-center rounded-full bg-[#EEF0FF]">
//             <Text className="text-4xl font-extrabold text-[#4355D8]">
//               {profile?.name
//                 ?.charAt(0)
//                 .toUpperCase() ??
//                 "S"}
//             </Text>
//           </View>

//           <Text className="mt-3 text-xl font-extrabold text-[#15213B]">
//             {profile?.name ??
//               "Student"}
//           </Text>

//           <Text className="mt-1 text-sm text-[#606F88]">
//             {getName(
//               profile?.classId
//             )}{" "}
//             • Section{" "}
//             {getName(
//               profile?.sectionId
//             )}
//           </Text>
//         </View>

//         <View className="mt-7 rounded-2xl border border-[#E5E8F0] bg-white p-5">
//           <ProfileRow
//             label="Admission No."
//             value={String(
//               profile?.admissionNumber ??
//                 profile?.admissionNo ??
//                 "-"
//             )}
//           />

//           <ProfileRow
//             label="Roll Number"
//             value={String(
//               profile?.rollNumber ??
//                 profile?.rollNo ??
//                 "-"
//             )}
//           />

//           <ProfileRow
//             label="Email"
//             value={
//               profile?.email ??
//               "-"
//             }
//           />

//           <ProfileRow
//             label="Date of Birth"
//             value={
//               profile?.dateOfBirth
//                 ? formatDate(
//                     profile.dateOfBirth
//                   )
//                 : "-"
//             }
//           />

//           <ProfileRow
//             label="Blood Group"
//             value={
//               profile?.bloodGroup ??
//               "-"
//             }
//             last
//           />
//         </View>

//         <Pressable
//           onPress={
//             handleLogout
//           }
//           className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-[#FDECEE] p-4"
//         >
//           <Ionicons
//             name="log-out-outline"
//             size={22}
//             color="#DC4C5A"
//           />

//           <Text className="font-extrabold text-[#DC4C5A]">
//             Logout
//           </Text>
//         </Pressable>
//       </SafeAreaView>
//     );
//   };

// const ProfileRow = ({
//   label,
//   value,
//   last = false,
// }: {
//   label: string;
//   value: string;
//   last?: boolean;
// }) => (
//   <View
//     className={`flex-row justify-between py-4 ${
//       !last
//         ? "border-b border-[#EFF1F6]"
//         : ""
//     }`}
//   >
//     <Text className="text-sm text-[#606F88]">
//       {label}
//     </Text>

//     <Text className="font-bold text-[#15213B]">
//       {value}
//     </Text>
//   </View>
// );

// export default StudentProfileScreen;











// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   Text,
//   View,
// } from "react-native";

// import {
//   SafeAreaView,
// } from "react-native-safe-area-context";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import api from "../../../api/axios";

// import {
//   logout,
// } from "../../../features/auth/auth.slice";



// import {
//   useAppDispatch,
// } from "../../../store/hook";

// import type {
//   StudentProfile,
// } from "types/student.types";
// import { extractApiData ,formatDate,
//   getName,} from "utils/studentHelpers";

// const StudentProfileScreen = () => {
//   const dispatch =
//     useAppDispatch();

//   const [
//     profile,
//     setProfile,
//   ] =
//     useState<StudentProfile | null>(
//       null
//     );

//   const [
//     loading,
//     setLoading,
//   ] =
//     useState(true);

//   /* =====================================================
//      LOAD STUDENT PROFILE
//   ===================================================== */

//   useEffect(() => {
//     const load =
//       async () => {
//         try {
//           const response =
//             await api.get(
//               "/students/me"
//             );

//           const data =
//             extractApiData(
//               response
//             );

//           setProfile(
//             data?.student ??
//               data
//           );
//         } catch (error: any) {
//           console.log(
//             "STUDENT PROFILE ERROR:",
//             error?.response?.data ??
//               error?.message
//           );

//           /*
//            * 401 ka matlab token invalid/expired hai.
//            * Auth clear kar denge.
//            *
//            * RootNavigator auth-state based hone ke
//            * baad automatically Login dikhega.
//            */
//           if (
//             error?.response
//               ?.status === 401
//           ) {
//             try {
//               await dispatch(
//                 logout()
//               ).unwrap();
//             } catch (
//               logoutError
//             ) {
//               console.log(
//                 "AUTO LOGOUT ERROR:",
//                 logoutError
//               );
//             }
//           }
//         } finally {
//           setLoading(
//             false
//           );
//         }
//       };

//     load();
//   }, [dispatch]);

//   /* =====================================================
//      LOGOUT
//   ===================================================== */

//   const handleLogout =
//     () => {
//       Alert.alert(
//         "Logout",

//         "Do you want to logout?",

//         [
//           {
//             text: "Cancel",

//             style: "cancel",
//           },

//           {
//             text: "Logout",

//             style:
//               "destructive",

//             onPress:
//               async () => {
//                 try {
//                   await dispatch(
//                     logout()
//                   ).unwrap();
//                 } catch (
//                   error
//                 ) {
//                   console.log(
//                     "LOGOUT ERROR:",
//                     error
//                   );

//                   Alert.alert(
//                     "Error",
//                     "Unable to logout. Please try again."
//                   );
//                 }
//               },
//           },
//         ]
//       );
//     };

//   /* =====================================================
//      LOADING
//   ===================================================== */

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
//         <ActivityIndicator
//           size="large"
//           color="#4355D8"
//         />

//         <Text className="mt-3 text-sm text-[#606F88]">
//           Loading profile...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* =====================================================
//      SCREEN
//   ===================================================== */

//   return (
//     <SafeAreaView className="flex-1 bg-[#F7F7FB] px-5 pt-6">

//       {/* PROFILE */}

//       <View className="items-center">

//         <View className="h-24 w-24 items-center justify-center rounded-full bg-[#EEF0FF]">

//           <Text className="text-4xl font-extrabold text-[#4355D8]">
//             {profile?.name
//               ?.charAt(0)
//               .toUpperCase() ??
//               "S"}
//           </Text>

//         </View>

//         <Text className="mt-3 text-xl font-extrabold text-[#15213B]">
//           {profile?.name ??
//             "Student"}
//         </Text>

//         <Text className="mt-1 text-sm text-[#606F88]">
//           {getName(
//             profile?.classId
//           )}{" "}
//           • Section{" "}
//           {getName(
//             profile?.sectionId
//           )}
//         </Text>

//       </View>

//       {/* DETAILS */}

//       <View className="mt-7 rounded-2xl border border-[#E5E8F0] bg-white p-5">

//         <ProfileRow
//           label="Admission No."
//           value={String(
//             profile?.admissionNumber ??
//               profile?.admissionNo ??
//               "-"
//           )}
//         />

//         <ProfileRow
//           label="Roll Number"
//           value={String(
//             profile?.rollNumber ??
//               profile?.rollNo ??
//               "-"
//           )}
//         />

//         <ProfileRow
//           label="Email"
//           value={
//             profile?.email ??
//             "-"
//           }
//         />

//         <ProfileRow
//           label="Date of Birth"
//           value={
//             profile?.dateOfBirth
//               ? formatDate(
//                   profile.dateOfBirth
//                 )
//               : "-"
//           }
//         />

//         <ProfileRow
//           label="Blood Group"
//           value={
//             profile?.bloodGroup ??
//             "-"
//           }
//           last
//         />

//       </View>

//       {/* LOGOUT */}

//       <Pressable
//         onPress={
//           handleLogout
//         }
//         className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-[#FDECEE] p-4"
//       >

//         <Ionicons
//           name="log-out-outline"
//           size={22}
//           color="#DC4C5A"
//         />

//         <Text className="font-extrabold text-[#DC4C5A]">
//           Logout
//         </Text>

//       </Pressable>

//     </SafeAreaView>
//   );
// };

// /* =====================================================
//    PROFILE ROW
// ===================================================== */

// const ProfileRow = ({
//   label,
//   value,
//   last = false,
// }: {
//   label: string;
//   value: string;
//   last?: boolean;
// }) => (
//   <View
//     className={`flex-row justify-between py-4 ${
//       !last
//         ? "border-b border-[#EFF1F6]"
//         : ""
//     }`}
//   >

//     <Text className="text-sm text-[#606F88]">
//       {label}
//     </Text>

//     <Text className="font-bold text-[#15213B]">
//       {value}
//     </Text>

//   </View>
// );

// export default StudentProfileScreen;








import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import api from "../../../api/axios";

import {
  logout,
} from "../../../features/auth/auth.slice";

import {
  extractApiData,
  formatDate,
  getName,
} from "utils/studentHelpers";

import {
  useAppDispatch,
} from "../../../store/hook";

import type {
  StudentProfile,
} from "types/student.types";

/* =====================================================
   STUDENT PROFILE
===================================================== */

const StudentProfileScreen =
  () => {
    const dispatch =
      useAppDispatch();

    const [
      profile,
      setProfile,
    ] =
      useState<StudentProfile | null>(
        null
      );

    const [
      loading,
      setLoading,
    ] =
      useState(true);

    const [
      loggingOut,
      setLoggingOut,
    ] =
      useState(false);

    const [
      profileError,
      setProfileError,
    ] =
      useState<
        string | null
      >(null);

    /* =================================================
       LOAD PROFILE
    ================================================= */

    useEffect(() => {
      let mounted =
        true;

      const load =
        async () => {
          try {
            setProfileError(
              null
            );

            const response =
              await api.get(
                "/students/me"
              );

            if (!mounted) {
              return;
            }

            const data =
              extractApiData(
                response
              );

            setProfile(
              data?.student ??
                data
            );
          } catch (
            error: any
          ) {
            console.log(
              "STUDENT PROFILE ERROR:",
              error?.response
                ?.data ??
                error?.message
            );

            const status =
              error?.response
                ?.status;

            /* =========================================
               TOKEN INVALID / EXPIRED
            ========================================= */

            if (
              status === 401
            ) {
              try {
                await dispatch(
                  logout()
                ).unwrap();
              } catch (
                logoutError
              ) {
                console.log(
                  "AUTO LOGOUT ERROR:",
                  logoutError
                );
              }

              return;
            }

            if (mounted) {
              setProfileError(
                error?.response
                  ?.data
                  ?.message ??
                  "Unable to load profile."
              );
            }
          } finally {
            if (mounted) {
              setLoading(
                false
              );
            }
          }
        };

      load();

      return () => {
        mounted = false;
      };
    }, [dispatch]);

    /* =================================================
       LOGOUT
    ================================================= */

    const performLogout =
      async () => {
        if (loggingOut) {
          return;
        }

        try {
          setLoggingOut(
            true
          );

          /*
           * SecureStore clear hoga.
           *
           * logout.fulfilled ke baad:
           *
           * user = null
           * accessToken = null
           *
           * RootNavigator automatically
           * LoginScreen show karega.
           */

          await dispatch(
            logout()
          ).unwrap();
        } catch (
          error
        ) {
          console.log(
            "LOGOUT ERROR:",
            error
          );

          setLoggingOut(
            false
          );

          Alert.alert(
            "Logout Failed",
            "Unable to logout. Please try again."
          );
        }
      };

    const handleLogout =
      () => {
        Alert.alert(
          "Logout",

          "Do you want to logout?",

          [
            {
              text:
                "Cancel",

              style:
                "cancel",
            },

            {
              text:
                "Logout",

              style:
                "destructive",

              onPress:
                performLogout,
            },
          ]
        );
      };

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-medium text-[#606F88]">
            Loading profile...
          </Text>

        </SafeAreaView>
      );
    }

    /* =================================================
       ERROR
    ================================================= */

    if (
      profileError &&
      !profile
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB] px-6">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#FDECEE]">

            <Ionicons
              name="alert-circle-outline"
              size={30}
              color="#DC4C5A"
            />

          </View>

          <Text className="mt-4 text-lg font-extrabold text-[#15213B]">
            Unable to load profile
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-[#606F88]">
            {profileError}
          </Text>

          <Pressable
            onPress={
              handleLogout
            }
            className="mt-6 rounded-2xl bg-[#4355D8] px-6 py-3"
          >

            <Text className="font-bold text-white">
              Logout
            </Text>

          </Pressable>

        </SafeAreaView>
      );
    }

    /* =================================================
       PROFILE SCREEN
    ================================================= */

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB] px-5 pt-6">

        {/* ============================================
            PROFILE HEADER
        ============================================ */}

        <View className="items-center">

          <View className="h-24 w-24 items-center justify-center rounded-full bg-[#EEF0FF]">

            <Text className="text-4xl font-extrabold text-[#4355D8]">

              {profile?.name
                ?.charAt(0)
                .toUpperCase() ??
                "S"}

            </Text>

          </View>

          <Text className="mt-3 text-xl font-extrabold text-[#15213B]">

            {profile?.name ??
              "Student"}

          </Text>

          <Text className="mt-1 text-sm text-[#606F88]">

            {getName(
              profile?.classId
            )}{" "}
            • Section{" "}
            {getName(
              profile?.sectionId
            )}

          </Text>

        </View>

        {/* ============================================
            PROFILE DETAILS
        ============================================ */}

        <View className="mt-7 rounded-2xl border border-[#E5E8F0] bg-white p-5">

          <ProfileRow
            label="Admission No."
            value={String(
              profile?.admissionNumber ??
                profile?.admissionNo ??
                "-"
            )}
          />

          <ProfileRow
            label="Roll Number"
            value={String(
              profile?.rollNumber ??
                profile?.rollNo ??
                "-"
            )}
          />

          <ProfileRow
            label="Email"
            value={
              profile?.email ??
              "-"
            }
          />

          <ProfileRow
            label="Date of Birth"
            value={
              profile?.dateOfBirth
                ? formatDate(
                    profile.dateOfBirth
                  )
                : "-"
            }
          />

          <ProfileRow
            label="Blood Group"
            value={
              profile?.bloodGroup ??
              "-"
            }
            last
          />

        </View>

        {/* ============================================
            LOGOUT
        ============================================ */}

        <Pressable
          onPress={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className={`mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-[#FDECEE] p-4 ${
            loggingOut
              ? "opacity-60"
              : ""
          }`}
        >

          {loggingOut ? (
            <ActivityIndicator
              size="small"
              color="#DC4C5A"
            />
          ) : (
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#DC4C5A"
            />
          )}

          <Text className="font-extrabold text-[#DC4C5A]">

            {loggingOut
              ? "Logging out..."
              : "Logout"}

          </Text>

        </Pressable>

      </SafeAreaView>
    );
  };

/* =====================================================
   PROFILE ROW
===================================================== */

const ProfileRow = ({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) => (
  <View
    className={`flex-row items-center justify-between py-4 ${
      !last
        ? "border-b border-[#EFF1F6]"
        : ""
    }`}
  >

    <Text className="text-sm text-[#606F88]">
      {label}
    </Text>

    <Text className="ml-5 flex-1 text-right font-bold text-[#15213B]">
      {value}
    </Text>

  </View>
);

export default StudentProfileScreen;