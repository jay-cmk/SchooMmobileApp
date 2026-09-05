// import React, { useState } from 'react';
// import { Icon } from '@iconify/react';

// // --- TypeScript Interfaces ---
// interface HeaderProps {
//   academyName: string;
//   welcomeMessage: string;
// }

// interface InputFieldProps {
//   label: string;
//   icon: string;
//   type?: string;
//   placeholder: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   rightIcon?: string;
//   onRightIconClick?: () => void;
// }

// // --- Helper Sub-components ---
// const Header: React.FC<HeaderProps> = ({ academyName, welcomeMessage }) => {
//   return (
//     <div className="h-64 rounded-b-[3rem] bg-gradient-to-br from-[#4355D8] to-[#4355D8]/80 px-6 pt-12 text-white">
//       <div className="flex items-center justify-between">
//         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4355D8] shadow-md">
//           <Icon icon="lucide:graduation-cap" className="text-2xl" />
//         </div>
//         <span className="text-sm font-semibold">{academyName}</span>
//       </div>
//       <div className="mt-9">
//         <p className="text-sm font-medium text-white/80">STUDENT PORTAL</p>
//         <h1 className="mt-2 text-3xl font-bold tracking-tight">{welcomeMessage}</h1>
//       </div>
//     </div>
//   );
// };

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   icon,
//   type = 'text',
//   placeholder,
//   value,
//   onChange,
//   rightIcon,
//   onRightIconClick,
// }) => {
//   return (
//     <label className="block rounded-xl border border-[#D8DDEA] bg-white p-4 shadow-sm focus-within:border-[#4355D8] focus-within:ring-1 focus-within:ring-[#4355D8] transition-all">
//       <span className="text-xs font-semibold text-[#4355D8] tracking-wider uppercase">{label}</span>
//       <div className="mt-1 flex items-center gap-3">
//         <Icon icon={icon} className="text-xl text-[#606F88]" />
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           className="w-full bg-transparent text-base text-[#15213B] outline-none placeholder-[#606F88]/50"
//           placeholder={placeholder}
//         />
//         {rightIcon && (
//           <button
//             type="button"
//             onClick={onRightIconClick}
//             className="text-xl text-[#606F88] hover:text-[#4355D8] focus:outline-none transition-colors"
//           >
//             <Icon icon={rightIcon} />
//           </button>
//         )}
//       </div>
//     </label>
//   );
// };

// // --- Main Page Component ---
// const Login: React.FC = () => {
//   const [studentId, setStudentId] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setStudentId(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!studentId) {
//       setNotification({
//         type: 'error',
//         message: 'Please enter your Student ID or Email first to reset your password.',
//       });
//       return;
//     }
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       setNotification({
//         type: 'success',
//         message: `Password reset instructions have been sent to the email associated with ${studentId}.`,
//       });
//     }, 1200);
//   };

//   const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!studentId || !password) {
//       setNotification({
//         type: 'error',
//         message: 'Please fill in all fields.',
//       });
//       return;
//     }

//     setIsLoading(true);
//     setNotification(null);

//     // Simulate API authentication
//     setTimeout(() => {
//       setIsLoading(false);
//       setNotification({
//         type: 'success',
//         message: 'Successfully authenticated! Redirecting to Home Dashboard...',
//       });
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#F7F7FB] flex flex-col relative overflow-hidden font-sans">
//       {/* Injecting custom styles for exact theme matching */}
//       <style>{`
//         :root {
//           --background: #F7F7FB;
//           --foreground: #15213B;
//           --primary: #4355D8;
//           --primary-foreground: #FFFFFF;
//           --secondary: #EEF0FF;
//           --secondary-foreground: #27327C;
//           --muted: #EFF1F6;
//           --muted-foreground: #606F88;
//           --card: #FFFFFF;
//           --border: #E5E8F0;
//           --input: #D8DDEA;
//         }
//       `}</style>

//       {/* Header Section */}
//       <Header academyName="Northstar Academy" welcomeMessage="Welcome back, Jay" />

//       {/* Main Content Area */}
//       <main className="-mt-5 flex-1 rounded-t-[2rem] bg-[#F7F7FB] px-6 pt-8 pb-12 z-10">
//         <p className="text-base text-[#606F88]">Continue your learning journey.</p>

//         {/* Notification Banner */}
//         {notification && (
//           <div
//             className={`mt-6 p-4 rounded-xl flex items-start gap-3 border transition-all ${
//               notification.type === 'success'
//                 ? 'bg-[#E6F7ED] border-[#2BAA7B]/30 text-[#008256]'
//                 : 'bg-[#FDF2F2] border-[#DC4C5A]/30 text-[#CC3D4E]'
//             }`}
//           >
//             <Icon
//               icon={notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'}
//               className="text-xl shrink-0 mt-0.5"
//             />
//             <span className="text-sm font-medium">{notification.message}</span>
//           </div>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleSignIn} className="mt-8 space-y-4">
//           <InputField
//             label="STUDENT ID / EMAIL"
//             icon="lucide:mail"
//             placeholder="ADM-1024"
//             value={studentId}
//             onChange={handleStudentIdChange}
//           />

//           <InputField
//             label="PASSWORD"
//             icon="lucide:lock"
//             type={showPassword ? 'text' : 'password'}
//             placeholder="••••••••"
//             value={password}
//             onChange={handlePasswordChange}
//             rightIcon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
//             onRightIconClick={togglePasswordVisibility}
//           />

//           <div className="flex justify-start">
//             <button
//               type="button"
//               onClick={handleForgotPassword}
//               className="text-sm font-semibold text-[#4355D8] hover:underline focus:outline-none"
//             >
//               Forgot password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             data-uxm-link="Home Dashboard"
//             className="mt-8 min-h-11 w-full rounded-xl bg-[#4355D8] hover:bg-[#4355D8]/90 active:scale-[0.98] transition-all px-5 py-4 text-base font-semibold text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <>
//                 <Icon icon="lucide:loader-2" className="animate-spin text-xl" />
//                 <span>Signing in securely...</span>
//               </>
//             ) : (
//               <span>Sign in securely</span>
//             )}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-xs text-[#606F88]">
//           Your account only shows your own school records.
//         </p>
//       </main>
//     </div>
//   );
// };

// export default Login;




// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import type {
//   NativeStackScreenProps,
// } from "@react-navigation/native-stack";

// import {
//   Ionicons,
// } from "@expo/vector-icons";



// import {
//   clearAuthError,
//   login,
// } from "../../features/auth/auth.slice";




// import { useAppSelector,useAppDispatch } from "@/store/hook";
// import { UserRole } from "types/auth.types";
// import { RootStackParamList } from "types/navigation.types";

// type Props = NativeStackScreenProps<
//   RootStackParamList,
//   "Login"
// >;

// const LoginScreen: React.FC<Props> = ({
//   navigation,
// }) => {
//   const dispatch = useAppDispatch();

//   const {
//     loading,
//     error,
//     user,
//     accessToken,
//   } = useAppSelector(
//     (state) => state.auth
//   );

//   const [email, setEmail] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [
//     showPassword,
//     setShowPassword,
//   ] = useState(false);

//   const [
//     localError,
//     setLocalError,
//   ] = useState<string | null>(null);

//   useEffect(() => {
//     if (
//       accessToken &&
//       user?.role === UserRole.STUDENT
//     ) {
//       navigation.reset({
//         index: 0,

//         routes: [
//           {
//             name: "StudentApp",
//           },
//         ],
//       });
//     }
//   }, [
//     accessToken,
//     user,
//     navigation,
//   ]);

//   useEffect(() => {
//     return () => {
//       dispatch(clearAuthError());
//     };
//   }, [dispatch]);

//   const handleLogin = async () => {
//     setLocalError(null);

//     dispatch(clearAuthError());

//     const cleanEmail =
//       email.trim().toLowerCase();

//     if (!cleanEmail) {
//       setLocalError(
//         "Please enter your email."
//       );

//       return;
//     }

//     if (!password) {
//       setLocalError(
//         "Please enter your password."
//       );

//       return;
//     }

//     const result = await dispatch(
//       login({
//         email: cleanEmail,
//         password,
//       })
//     );

//     if (login.fulfilled.match(result)) {
//       const loggedInUser =
//         result.payload.user;

//       if (
//         loggedInUser.role !==
//         UserRole.STUDENT
//       ) {
//         setLocalError(
//           "This login is currently available for students only."
//         );

//         return;
//       }

//       navigation.reset({
//         index: 0,

//         routes: [
//           {
//             name: "StudentApp",
//           },
//         ],
//       });
//     }
//   };

//   const displayError =
//     localError || error;

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={
//         Platform.OS === "ios"
//           ? "padding"
//           : undefined
//       }
//     >
//       <ScrollView
//         contentContainerStyle={
//           styles.scrollContent
//         }
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* HEADER */}

//         <View style={styles.header}>
//           <View style={styles.headerTop}>
//             <View style={styles.logo}>
//               <Ionicons
//                 name="school"
//                 size={28}
//                 color="#4355D8"
//               />
//             </View>

//             <Text style={styles.schoolName}>
//               Northstar Academy
//             </Text>
//           </View>

//           <View style={styles.headerText}>
//             <Text style={styles.portalText}>
//               STUDENT PORTAL
//             </Text>

//             <Text style={styles.welcome}>
//               Welcome back
//             </Text>
//           </View>
//         </View>

//         {/* FORM */}

//         <View style={styles.content}>
//           <Text style={styles.description}>
//             Continue your learning journey.
//           </Text>

//           {displayError ? (
//             <View style={styles.errorBox}>
//               <Ionicons
//                 name="alert-circle-outline"
//                 size={20}
//                 color="#CC3D4E"
//               />

//               <Text style={styles.errorText}>
//                 {displayError}
//               </Text>
//             </View>
//           ) : null}

//           <View style={styles.form}>
//             {/* EMAIL */}

//             <View style={styles.inputBox}>
//               <Text style={styles.label}>
//                 EMAIL
//               </Text>

//               <View style={styles.inputRow}>
//                 <Ionicons
//                   name="mail-outline"
//                   size={21}
//                   color="#606F88"
//                 />

//                 <TextInput
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="student@example.com"
//                   placeholderTextColor="#9AA3B4"
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                   autoCorrect={false}
//                   editable={!loading}
//                   style={styles.input}
//                 />
//               </View>
//             </View>

//             {/* PASSWORD */}

//             <View style={styles.inputBox}>
//               <Text style={styles.label}>
//                 PASSWORD
//               </Text>

//               <View style={styles.inputRow}>
//                 <Ionicons
//                   name="lock-closed-outline"
//                   size={21}
//                   color="#606F88"
//                 />

//                 <TextInput
//                   value={password}
//                   onChangeText={setPassword}
//                   placeholder="••••••••"
//                   placeholderTextColor="#9AA3B4"
//                   secureTextEntry={
//                     !showPassword
//                   }
//                   editable={!loading}
//                   style={styles.input}
//                 />

//                 <Pressable
//                   onPress={() =>
//                     setShowPassword(
//                       (prev) => !prev
//                     )
//                   }
//                   hitSlop={10}
//                 >
//                   <Ionicons
//                     name={
//                       showPassword
//                         ? "eye-off-outline"
//                         : "eye-outline"
//                     }
//                     size={22}
//                     color="#606F88"
//                   />
//                 </Pressable>
//               </View>
//             </View>

//             {/* FORGOT PASSWORD */}

//             <Pressable>
//               <Text style={styles.forgot}>
//                 Forgot password?
//               </Text>
//             </Pressable>

//             {/* LOGIN BUTTON */}

//             <Pressable
//               onPress={handleLogin}
//               disabled={loading}
//               style={({ pressed }) => [
//                 styles.loginButton,

//                 pressed &&
//                 !loading
//                   ? styles.loginButtonPressed
//                   : null,

//                 loading
//                   ? styles.loginButtonDisabled
//                   : null,
//               ]}
//             >
//               {loading ? (
//                 <>
//                   <ActivityIndicator
//                     size="small"
//                     color="#FFFFFF"
//                   />

//                   <Text
//                     style={
//                       styles.loginButtonText
//                     }
//                   >
//                     Signing in securely...
//                   </Text>
//                 </>
//               ) : (
//                 <Text
//                   style={
//                     styles.loginButtonText
//                   }
//                 >
//                   Sign in securely
//                 </Text>
//               )}
//             </Pressable>
//           </View>

//           <Text style={styles.securityText}>
//             Your account only shows your
//             own school records.
//           </Text>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F7FB",
//   },

//   scrollContent: {
//     flexGrow: 1,
//   },

//   header: {
//     height: 270,
//     backgroundColor: "#4355D8",
//     paddingTop: 60,
//     paddingHorizontal: 24,

//     borderBottomLeftRadius: 48,
//     borderBottomRightRadius: 48,
//   },

//   headerTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   logo: {
//     width: 50,
//     height: 50,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   schoolName: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   headerText: {
//     marginTop: 42,
//   },

//   portalText: {
//     color: "rgba(255,255,255,0.78)",
//     fontSize: 13,
//     fontWeight: "700",
//     letterSpacing: 1,
//   },

//   welcome: {
//     color: "#FFFFFF",
//     fontSize: 31,
//     fontWeight: "800",
//     marginTop: 7,
//   },

//   content: {
//     flex: 1,
//     marginTop: -22,
//     backgroundColor: "#F7F7FB",

//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,

//     paddingHorizontal: 24,
//     paddingTop: 32,
//     paddingBottom: 40,
//   },

//   description: {
//     fontSize: 16,
//     color: "#606F88",
//   },

//   errorBox: {
//     marginTop: 20,

//     borderWidth: 1,
//     borderColor: "rgba(220,76,90,0.25)",

//     backgroundColor: "#FDF2F2",

//     borderRadius: 14,

//     padding: 14,

//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//   },

//   errorText: {
//     flex: 1,
//     fontSize: 13,
//     lineHeight: 19,
//     color: "#CC3D4E",
//     fontWeight: "500",
//   },

//   form: {
//     marginTop: 28,
//     gap: 16,
//   },

//   inputBox: {
//     borderWidth: 1,
//     borderColor: "#D8DDEA",

//     backgroundColor: "#FFFFFF",

//     borderRadius: 14,

//     paddingHorizontal: 16,
//     paddingVertical: 13,
//   },

//   label: {
//     color: "#4355D8",
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 1,
//   },

//   inputRow: {
//     marginTop: 7,

//     flexDirection: "row",
//     alignItems: "center",

//     gap: 10,
//   },

//   input: {
//     flex: 1,
//     minHeight: 36,

//     color: "#15213B",

//     fontSize: 15,
//     paddingVertical: 0,
//   },

//   forgot: {
//     color: "#4355D8",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   loginButton: {
//     minHeight: 55,

//     backgroundColor: "#4355D8",

//     borderRadius: 14,

//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",

//     gap: 9,

//     marginTop: 12,

//     elevation: 3,
//   },

//   loginButtonPressed: {
//     transform: [
//       {
//         scale: 0.985,
//       },
//     ],
//   },

//   loginButtonDisabled: {
//     opacity: 0.7,
//   },

//   loginButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   securityText: {
//     textAlign: "center",
//     color: "#606F88",
//     fontSize: 12,
//     marginTop: 24,
//   },
// });









import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  clearAuthError,
  login,
  logout,
} from "../../features/auth/auth.slice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hook";

import {
  UserRole,
} from "types/auth.types";


const LoginScreen = () => {
  const dispatch =
    useAppDispatch();

  const {
    loading,
    error,
  } = useAppSelector(
    (state) => state.auth
  );

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    localError,
    setLocalError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    return () => {
      dispatch(
        clearAuthError()
      );
    };
  }, [dispatch]);


  const handleLogin =
    async () => {
      setLocalError(null);

      dispatch(
        clearAuthError()
      );

      const cleanEmail =
        email
          .trim()
          .toLowerCase();


      if (!cleanEmail) {
        setLocalError(
          "Please enter your email."
        );

        return;
      }


      if (!password) {
        setLocalError(
          "Please enter your password."
        );

        return;
      }


      try {
        const result =
          await dispatch(
            login({
              email: cleanEmail,
              password,
            })
          ).unwrap();


        const allowedRole =
          result.user.role ===
            UserRole.STUDENT ||
          result.user.role ===
            UserRole.TEACHER ||
            result.user.role === 
            UserRole.SCHOOL_ADMIN;


        if (!allowedRole) {
          await dispatch(
            logout()
          ).unwrap();

          setLocalError(
            "This mobile app is currently available for students and teachers only."
          );

          return;
        }

        /*
         * Navigation manually nahi karna.
         *
         * Redux user update hone ke baad
         * RootNavigator automatically:
         *
         * STUDENT -> StudentApp
         * TEACHER -> TeacherApp
         */
      } catch (
        loginError: any
      ) {
        console.log(
          "LOGIN ERROR:",
          loginError
        );
      }
    };


  const displayError =
    localError || error;


  return (
    <SafeAreaView
      edges={[
        "top",
        "left",
        "right",
      ]}
      className="flex-1 bg-[#F7F7FB]"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* ================================
              HEADER
          ================================= */}

          <View className="h-[250px] rounded-b-[42px] bg-[#4355D8] px-6 pt-5">

            {/* Logo + School */}

            <View className="flex-row items-center justify-between">

              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">

                <Ionicons
                  name="school"
                  size={26}
                  color="#4355D8"
                />

              </View>


              <View className="flex-row items-center">

                <View className="mr-2 h-2 w-2 rounded-full bg-[#7DE2B8]" />

                <Text className="text-sm font-bold text-white">
                  Northstar Academy
                </Text>

              </View>

            </View>


            {/* Welcome */}

            <View className="mt-10">

              <Text className="text-xs font-bold tracking-[1.5px] text-white/70">
                SCHOOL PORTAL
              </Text>

              <Text className="mt-2 text-[32px] font-extrabold tracking-tight text-white">
                Welcome back
              </Text>

              <Text className="mt-2 text-sm text-white/70">
                Student & Teacher Login
              </Text>

            </View>

          </View>


          {/* ================================
              CONTENT
          ================================= */}

          <View className="-mt-6 flex-1 rounded-t-[32px] bg-[#F7F7FB] px-6 pb-10 pt-8">

            <Text className="text-[15px] leading-6 text-[#606F88]">
              Sign in to continue to your school account.
            </Text>


            {/* ================================
                ERROR
            ================================= */}

            {displayError ? (
              <View className="mt-5 flex-row items-start rounded-2xl border border-[#F0C9CE] bg-[#FDF2F2] p-4">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#CC3D4E"
                />

                <Text className="ml-2 flex-1 text-[13px] font-medium leading-5 text-[#CC3D4E]">
                  {displayError}
                </Text>

              </View>
            ) : null}


            {/* ================================
                FORM
            ================================= */}

            <View className="mt-6">

              {/* EMAIL */}

              <View className="rounded-2xl border border-[#D8DDEA] bg-white px-4 py-3">

                <Text className="text-[10px] font-bold tracking-[1px] text-[#4355D8]">
                  EMAIL
                </Text>


                <View className="mt-1 flex-row items-center">

                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#606F88"
                  />


                  <TextInput
                    value={email}
                    onChangeText={(
                      value
                    ) => {
                      setEmail(value);

                      if (localError) {
                        setLocalError(
                          null
                        );
                      }
                    }}
                    placeholder="student@example.com"
                    placeholderTextColor="#9AA3B4"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="next"
                    className="ml-3 min-h-[42px] flex-1 text-[15px] text-[#15213B]"
                  />

                </View>

              </View>


              {/* PASSWORD */}

              <View className="mt-4 rounded-2xl border border-[#D8DDEA] bg-white px-4 py-3">

                <Text className="text-[10px] font-bold tracking-[1px] text-[#4355D8]">
                  PASSWORD
                </Text>


                <View className="mt-1 flex-row items-center">

                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#606F88"
                  />


                  <TextInput
                    value={password}
                    onChangeText={(
                      value
                    ) => {
                      setPassword(
                        value
                      );

                      if (localError) {
                        setLocalError(
                          null
                        );
                      }
                    }}
                    placeholder="••••••••"
                    placeholderTextColor="#9AA3B4"
                    secureTextEntry={
                      !showPassword
                    }
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={
                      handleLogin
                    }
                    className="ml-3 min-h-[42px] flex-1 text-[15px] text-[#15213B]"
                  />


                  <Pressable
                    onPress={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    hitSlop={10}
                    className="h-10 w-10 items-center justify-center"
                  >

                    <Ionicons
                      name={
                        showPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={21}
                      color="#606F88"
                    />

                  </Pressable>

                </View>

              </View>


              {/* FORGOT PASSWORD */}

              <Pressable
                disabled={loading}
                className="mt-4 self-start py-1"
              >

                <Text className="text-sm font-bold text-[#4355D8]">
                  Forgot password?
                </Text>

              </Pressable>


              {/* ================================
                  LOGIN BUTTON
              ================================= */}

              <Pressable
                onPress={
                  handleLogin
                }
                disabled={loading}
                className={
                  `mt-6 h-[58px] w-full flex-row items-center justify-center rounded-2xl ${
                    loading
                      ? "bg-[#7C88E5]"
                      : "bg-[#4355D8] active:bg-[#3545C4]"
                  }`
                }
                style={{
                  elevation: 6,
                  shadowColor:
                    "#4355D8",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity:
                    0.22,
                  shadowRadius: 8,
                }}
              >

                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 text-base font-extrabold text-white">
                      Signing in...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-base font-extrabold text-white">
                      Sign in securely
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#FFFFFF"
                      style={{
                        marginLeft: 8,
                      }}
                    />
                  </>
                )}

              </Pressable>


              {/* ================================
                  SECURITY
              ================================= */}

              <View className="mt-7 flex-row items-center justify-center px-3">

                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#606F88"
                />

                <Text className="ml-2 flex-shrink text-center text-[11px] leading-4 text-[#606F88]">
                  Your account only shows records you are authorized to access.
                </Text>

              </View>

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default LoginScreen;