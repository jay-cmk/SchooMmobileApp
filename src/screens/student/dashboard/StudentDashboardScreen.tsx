



// import React, {
//   useCallback,
//   useMemo,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   Text,
//   View,
// } from "react-native";

// import {
//   SafeAreaView,
// } from "react-native-safe-area-context";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import {
//   useFocusEffect,
//   useNavigation,
// } from "@react-navigation/native";

// import type {
//   NativeStackNavigationProp,
// } from "@react-navigation/native-stack";

// import api from "../../../api/axios";



// import type {
//   AttendanceRecord,
//   HomeworkItem,
//   StudentProfile,
//   TimetableEntry,
// } from "types/student.types";



// import {
//   extractApiData,
//   extractArray,
//   getName,
//   getTodayName,
// } from "utils/studentHelpers";
// import { useAppSelector } from "@/store/hook";
// import { StudentStackParamList } from "types/navigation.types";

// /* =====================================================
//    NAVIGATION TYPE
// ===================================================== */

// type NavigationProp =
//   NativeStackNavigationProp<StudentStackParamList>;

// type AttendanceSummary = {
//   presentDays: number;
//   absentDays: number;
//   leaveDays: number;
//   halfDays: number;
//   workingDays: number;
//   attendancePercentage: number;
//   below75: boolean;
// };

// type HomeworkSubmission = {
//   _id?: string;
//   homeworkId?:
//     | string
//     | {
//         _id?: string;
//         id?: string;
//       };
//   submissionStatus?: string;
//   reviewStatus?: string;
//   submissionMode?: string;
// };

// const initialAttendanceSummary: AttendanceSummary = {
//   presentDays: 0,
//   absentDays: 0,
//   leaveDays: 0,
//   halfDays: 0,
//   workingDays: 0,
//   attendancePercentage: 0,
//   below75: false,
// };

// const getEntityId = (
//   value:
//     | string
//     | {
//         _id?: string;
//         id?: string;
//       }
//     | null
//     | undefined
// ) => {
//   if (!value) return "";
//   if (typeof value === "string") return value;
//   return value._id ?? value.id ?? "";
// };

// /* =====================================================
//    SCREEN
// ===================================================== */

// const StudentDashboardScreen = () => {
//   const navigation =
//     useNavigation<NavigationProp>();

//   const authUser =
//     useAppSelector(
//       (state) => state.auth.user
//     );

//   /* ===================================================
//      STATE
//   =================================================== */

//   const [
//     profile,
//     setProfile,
//   ] =
//     useState<StudentProfile | null>(
//       null
//     );

//   const [
//     attendance,
//     setAttendance,
//   ] = useState<
//     AttendanceRecord[]
//   >([]);

//   const [
//     attendanceSummary,
//     setAttendanceSummary,
//   ] = useState<AttendanceSummary>(
//     initialAttendanceSummary
//   );

//   const [
//     homeworkSubmissions,
//     setHomeworkSubmissions,
//   ] = useState<HomeworkSubmission[]>([]);

//   const [
//     timetable,
//     setTimetable,
//   ] = useState<
//     TimetableEntry[]
//   >([]);

//   const [
//     homework,
//     setHomework,
//   ] = useState<
//     HomeworkItem[]
//   >([]);

//   const [
//     loading,
//     setLoading,
//   ] = useState(true);

//   const [
//     refreshing,
//     setRefreshing,
//   ] = useState(false);

//   const [
//     error,
//     setError,
//   ] = useState<string | null>(
//     null
//   );

//   /* ===================================================
//      LOAD DASHBOARD DATA
//   =================================================== */

//   const fetchDashboard =
//     useCallback(
//       async (
//         refresh = false
//       ) => {
//         try {
//           if (refresh) {
//             setRefreshing(true);
//           } else {
//             setLoading(true);
//           }

//           setError(null);

//           const results =
//             await Promise.allSettled(
//               [
//                 api.get(
//                   "/students/me"
//                 ),

//                 api.get(
//                   "/attendance/me"
//                 ),

//                 api.get(
//                   "/timetable/me"
//                 ),

//                 api.get(
//                   "/homework/me"
//                 ),

//                 api.get(
//                   "/homework-submissions/me"
//                 ),
//               ]
//             );

//           const [
//             profileResult,
//             attendanceResult,
//             timetableResult,
//             homeworkResult,
//             homeworkSubmissionsResult,
//           ] = results;

//           /* =============================================
//              PROFILE
//           ============================================= */

//           if (
//             profileResult.status ===
//             "fulfilled"
//           ) {
//             const data =
//               extractApiData(
//                 profileResult.value
//               );

//             setProfile(
//               data?.student ??
//                 data?.profile ??
//                 data ??
//                 null
//             );
//           } else {
//             console.log(
//               "PROFILE ERROR:",
//               profileResult.reason
//                 ?.response?.data ??
//                 profileResult.reason
//                   ?.message ??
//                 profileResult.reason
//             );
//           }

//           /* =============================================
//              ATTENDANCE
//           ============================================= */

//           if (
//             attendanceResult.status ===
//             "fulfilled"
//           ) {
//             const data =
//               extractApiData(
//                 attendanceResult.value
//               );

//             setAttendance(
//               Array.isArray(
//                 data?.calendar
//               )
//                 ? data.calendar
//                 : []
//             );

//             setAttendanceSummary(
//               data?.summary ??
//                 initialAttendanceSummary
//             );
//           } else {
//             console.log(
//               "ATTENDANCE ERROR:",
//               attendanceResult.reason
//                 ?.response?.data ??
//                 attendanceResult.reason
//                   ?.message ??
//                 attendanceResult.reason
//             );
//           }

//           /* =============================================
//              TIMETABLE
//           ============================================= */

//           if (
//             timetableResult.status ===
//             "fulfilled"
//           ) {
//             const data =
//               extractApiData(
//                 timetableResult.value
//               );

//             setTimetable(
//               extractArray(
//                 data,
//                 [
//                   "timetable",
//                   "entries",
//                   "periods",
//                   "schedules",
//                 ]
//               )
//             );
//           } else {
//             console.log(
//               "TIMETABLE ERROR:",
//               timetableResult.reason
//                 ?.response?.data ??
//                 timetableResult.reason
//                   ?.message ??
//                 timetableResult.reason
//             );
//           }

//           /* =============================================
//              HOMEWORK
//           ============================================= */

//           if (
//             homeworkResult.status ===
//             "fulfilled"
//           ) {
//             const data =
//               extractApiData(
//                 homeworkResult.value
//               );

//             setHomework(
//               extractArray(
//                 data,
//                 [
//                   "homework",
//                   "homeworks",
//                   "assignments",
//                 ]
//               )
//             );
//           } else {
//             console.log(
//               "HOMEWORK ERROR:",
//               homeworkResult.reason
//                 ?.response?.data ??
//                 homeworkResult.reason
//                   ?.message ??
//                 homeworkResult.reason
//             );
//           }

//           /* =============================================
//              HOMEWORK SUBMISSIONS / TEACHER REVIEW
//           ============================================= */

//           if (
//             homeworkSubmissionsResult.status ===
//             "fulfilled"
//           ) {
//             const data =
//               extractApiData(
//                 homeworkSubmissionsResult.value
//               );

//             const list =
//               extractArray(
//                 data,
//                 [
//                   "submissions",
//                   "submission",
//                   "homeworkSubmissions",
//                 ]
//               ) as HomeworkSubmission[];

//             setHomeworkSubmissions(
//               list
//             );

//             console.log(
//               "DASHBOARD HOMEWORK SUBMISSIONS:",
//               JSON.stringify(
//                 homeworkSubmissionsResult.value.data,
//                 null,
//                 2
//               )
//             );
//           } else {
//             console.log(
//               "HOMEWORK SUBMISSIONS ERROR:",
//               homeworkSubmissionsResult.reason
//                 ?.response?.data ??
//                 homeworkSubmissionsResult.reason
//                   ?.message ??
//                 homeworkSubmissionsResult.reason
//             );
//           }

//           /* =============================================
//              ALL API FAILED
//           ============================================= */

//           const failedRequests =
//             results.filter(
//               (result) =>
//                 result.status ===
//                 "rejected"
//             );

//           if (
//             failedRequests.length ===
//             results.length
//           ) {
//             setError(
//               "Dashboard data load nahi ho saka."
//             );
//           }
//         } catch (err: any) {
//           console.log(
//             "DASHBOARD ERROR:",
//             err?.response?.data ??
//               err?.message
//           );

//           setError(
//             err?.response?.data
//               ?.message ??
//               err?.message ??
//               "Something went wrong."
//           );
//         } finally {
//           setLoading(false);
//           setRefreshing(false);
//         }
//       },
//       []
//     );

//   /* ===================================================
//      INITIAL LOAD
//   =================================================== */

//   useFocusEffect(
//     useCallback(() => {
//       fetchDashboard();
//     }, [fetchDashboard])
//   );

//   /* ===================================================
//      STUDENT DATA
//   =================================================== */

//   const studentName =
//     profile?.name ??
//     authUser?.name ??
//     "Student";

//   const firstName =
//     studentName
//       .trim()
//       .split(" ")[0] ||
//     "Student";

//   const className =
//     getName(
//       profile?.classId
//     ) ||
//     getName(
//       profile?.class
//     ) ||
//     "-";

//   const sectionName =
//     getName(
//       profile?.sectionId
//     ) ||
//     getName(
//       profile?.section
//     ) ||
//     "-";

//   const rollNumber =
//     profile?.rollNumber ??
//     profile?.rollNo ??
//     "-";

//   const admissionNumber =
//     profile?.admissionNumber ??
//     profile?.admissionNo ??
//     profile?.admissionId ??
//     "-";

//   /* ===================================================
//      ATTENDANCE - BACKEND SUMMARY
//   =================================================== */

//   const attendanceStats = {
//     present:
//       attendanceSummary.presentDays,
//     absent:
//       attendanceSummary.absentDays,
//     leave:
//       attendanceSummary.leaveDays,
//     halfDay:
//       attendanceSummary.halfDays,
//     total:
//       attendanceSummary.workingDays,
//     percentage:
//       attendanceSummary.attendancePercentage,
//   };

//   /* ===================================================
//      PENDING HOMEWORK - TEACHER REVIEW STATUS
//   =================================================== */

//   const submissionMap =
//     useMemo(() => {
//       const map =
//         new Map<
//           string,
//           HomeworkSubmission
//         >();

//       homeworkSubmissions.forEach(
//         (submission) => {
//           const homeworkId =
//             getEntityId(
//               submission.homeworkId
//             );

//           if (homeworkId) {
//             map.set(
//               homeworkId,
//               submission
//             );
//           }
//         }
//       );

//       return map;
//     }, [homeworkSubmissions]);

//   const pendingHomework =
//     useMemo(() => {
//       return homework.filter(
//         (item) => {
//           const homeworkId =
//             item._id ??
//             item.id ??
//             "";

//           const submission =
//             submissionMap.get(
//               homeworkId
//             );

//           if (!submission) {
//             return true;
//           }

//           const reviewStatus =
//             (
//               submission.reviewStatus ??
//               "PENDING"
//             ).toUpperCase();

//           return (
//             reviewStatus !==
//               "COMPLETED" &&
//             reviewStatus !==
//               "REVIEWED"
//           );
//         }
//       );
//     }, [
//       homework,
//       submissionMap,
//     ]);

//   /* ===================================================
//      TODAY CLASSES
//   =================================================== */

//   const todayClasses =
//     useMemo(() => {
//       const today =
//         getTodayName();

//       return timetable
//         .filter(
//           (item) =>
//             !item.day ||
//             item.day.toUpperCase() ===
//               today
//         )
//         .sort((a, b) =>
//           (
//             a.startTime ?? ""
//           ).localeCompare(
//             b.startTime ?? ""
//           )
//         );
//     }, [timetable]);

//   const nextClass =
//     todayClasses[0];

//   /* ===================================================
//      LOADING
//   =================================================== */

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
//         <View className="mb-5 h-20 w-20 items-center justify-center rounded-[24px] bg-[#4355D8]">
//           <Ionicons
//             name="school"
//             size={36}
//             color="#FFFFFF"
//           />
//         </View>

//         <ActivityIndicator
//           size="large"
//           color="#4355D8"
//         />

//         <Text className="mt-4 text-sm font-semibold text-[#606F88]">
//           Loading dashboard...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ===================================================
//      UI
//   =================================================== */

//   return (
//     <SafeAreaView
//       edges={[
//         "top",
//         "left",
//         "right",
//       ]}
//       className="flex-1 bg-[#4355D8]"
//     >
//       <View className="flex-1 bg-[#F7F7FB]">

//         {/* ============================================
//             HEADER
//         ============================================ */}

//         <View className="rounded-b-[35px] bg-[#4355D8] px-5 pb-16 pt-6">

//           <View className="flex-row items-center justify-between">

//             <View className="flex-1">

//               <Text className="text-sm font-medium text-white/80">
//                 Welcome back 👋
//               </Text>

//               <Text className="mt-1 text-3xl font-extrabold text-white">
//                 {firstName}
//               </Text>

//               <Text className="mt-1 text-xs text-white/70">
//                 Ready for another
//                 productive day?
//               </Text>

//             </View>

//             {/* Notification */}

//             <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
//               <Ionicons
//                 name="notifications-outline"
//                 size={23}
//                 color="#FFFFFF"
//               />

//               <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FFCF55]" />
//             </Pressable>

//           </View>

//         </View>

//         {/* ============================================
//             SCROLL CONTENT
//         ============================================ */}

//         <ScrollView
//           className="-mt-8"
//           showsVerticalScrollIndicator={
//             false
//           }
//           contentContainerClassName="px-5 pb-10"
//           refreshControl={
//             <RefreshControl
//               refreshing={
//                 refreshing
//               }
//               onRefresh={() =>
//                 fetchDashboard(
//                   true
//                 )
//               }
//               tintColor="#4355D8"
//             />
//           }
//         >

//           {/* ==========================================
//               ERROR
//           ========================================== */}

//           {error ? (
//             <View className="mb-4 flex-row items-center rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

//               <Ionicons
//                 name="alert-circle-outline"
//                 size={20}
//                 color="#DC4C5A"
//               />

//               <Text className="ml-2 flex-1 text-xs font-medium text-[#DC4C5A]">
//                 {error}
//               </Text>

//             </View>
//           ) : null}

//           {/* ==========================================
//               STUDENT CARD
//           ========================================== */}

//           <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

//             <View className="flex-row items-start justify-between">

//               <View className="flex-1">

//                 <Text className="text-lg font-extrabold text-[#15213B]">
//                   {studentName}
//                 </Text>

//                 <Text className="mt-1 text-xs leading-5 text-[#606F88]">
//                   {className} •
//                   Section{" "}
//                   {sectionName} •
//                   Roll No.{" "}
//                   {rollNumber}
//                 </Text>

//               </View>

//               <View className="ml-3 rounded-xl bg-[#EEF0FF] px-3 py-2">

//                 <Text className="text-[9px] font-bold text-[#606F88]">
//                   ADMISSION
//                 </Text>

//                 <Text className="mt-0.5 text-[11px] font-extrabold text-[#4355D8]">
//                   {String(
//                     admissionNumber
//                   )}
//                 </Text>

//               </View>

//             </View>

//           </View>

//           {/* ==========================================
//               TODAY AT A GLANCE
//           ========================================== */}

//           <View className="mt-6">

//             <View className="mb-3 flex-row items-center justify-between">

//               <Text className="text-lg font-extrabold text-[#15213B]">
//                 Today at a glance
//               </Text>

//               <View className="flex-row items-center">

//                 <View className="mr-2 h-2 w-2 rounded-full bg-[#2BAA7B]" />

//                 <Text className="text-xs font-bold text-[#4355D8]">
//                   Live
//                 </Text>

//               </View>

//             </View>

//             <View className="flex-row flex-wrap justify-between gap-y-3">

//               {/* ATTENDANCE */}

//               <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

//                 <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E7F7F1]">

//                   <Ionicons
//                     name="stats-chart-outline"
//                     size={20}
//                     color="#2BAA7B"
//                   />

//                 </View>

//                 <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
//                   ATTENDANCE
//                 </Text>

//                 <Text className="mt-1 text-3xl font-extrabold text-[#2BAA7B]">
//                   {
//                     attendanceStats.percentage
//                   }
//                   %
//                 </Text>

//                 <Text className="mt-1 text-xs text-[#606F88]">
//                   Overall attendance
//                 </Text>

//               </View>

//               {/* HOMEWORK */}

//               <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

//                 <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

//                   <Ionicons
//                     name="document-text-outline"
//                     size={20}
//                     color="#4355D8"
//                   />

//                 </View>

//                 <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
//                   HOMEWORK
//                 </Text>

//                 <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
//                   {
//                     pendingHomework.length
//                   }
//                 </Text>

//                 <Text className="mt-1 text-xs text-[#606F88]">
//                   Pending tasks
//                 </Text>

//               </View>

//               {/* FEES */}

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Fees"
//                   )
//                 }
//                 className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
//               >

//                 <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2DE]">

//                   <Ionicons
//                     name="card-outline"
//                     size={20}
//                     color="#E59A2F"
//                   />

//                 </View>

//                 <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
//                   FEES
//                 </Text>

//                 <Text className="mt-2 text-base font-extrabold text-[#15213B]">
//                   View Fees
//                 </Text>

//                 <View className="mt-1 flex-row items-center">

//                   <Text className="text-xs text-[#606F88]">
//                     Fee details
//                   </Text>

//                   <Ionicons
//                     name="chevron-forward"
//                     size={13}
//                     color="#606F88"
//                   />

//                 </View>

//               </Pressable>

//               {/* NEXT CLASS */}

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Timetable"
//                   )
//                 }
//                 className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
//               >

//                 <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

//                   <Ionicons
//                     name="time-outline"
//                     size={20}
//                     color="#4355D8"
//                   />

//                 </View>

//                 <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
//                   NEXT CLASS
//                 </Text>

//                 <Text
//                   numberOfLines={1}
//                   className="mt-2 text-base font-extrabold text-[#15213B]"
//                 >
//                   {nextClass
//                     ? getName(
//                         nextClass.subjectId
//                       ) ||
//                       getName(
//                         nextClass.subject
//                       ) ||
//                       "Subject"
//                     : "No Class"}
//                 </Text>

//                 <Text className="mt-1 text-xs text-[#606F88]">
//                   {nextClass
//                     ?.startTime ??
//                     "No class today"}
//                 </Text>

//               </Pressable>

//             </View>

//           </View>

//           {/* ==========================================
//               QUICK ACCESS
//           ========================================== */}

//           <View className="mt-6">

//             <Text className="mb-3 text-lg font-extrabold text-[#15213B]">
//               Quick access
//             </Text>

//             <View className="flex-row gap-3">

//               {/* TIMETABLE */}

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Timetable"
//                   )
//                 }
//                 className="flex-1 items-center rounded-2xl bg-[#EEF0FF] p-4"
//               >

//                 <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

//                   <Ionicons
//                     name="calendar-outline"
//                     size={24}
//                     color="#4355D8"
//                   />

//                 </View>

//                 <Text className="mt-2 text-xs font-bold text-[#15213B]">
//                   Timetable
//                 </Text>

//               </Pressable>

//               {/* FEES */}

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Fees"
//                   )
//                 }
//                 className="flex-1 items-center rounded-2xl bg-[#FFF2DE] p-4"
//               >

//                 <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

//                   <Ionicons
//                     name="wallet-outline"
//                     size={24}
//                     color="#E59A2F"
//                   />

//                 </View>

//                 <Text className="mt-2 text-xs font-bold text-[#15213B]">
//                   Fees
//                 </Text>

//               </Pressable>

//               {/* EXAMS */}

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Exams"
//                   )
//                 }
//                 className="flex-1 items-center rounded-2xl bg-[#EFF1F6] p-4"
//               >

//                 <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

//                   <Ionicons
//                     name="ribbon-outline"
//                     size={24}
//                     color="#4355D8"
//                   />

//                 </View>

//                 <Text className="mt-2 text-xs font-bold text-[#15213B]">
//                   Exams
//                 </Text>

//               </Pressable>

//             </View>

//           </View>

//           {/* ==========================================
//               ALL SERVICES
//           ========================================== */}

//           <View className="mt-6">

//             <View className="mb-4 flex-row items-center justify-between">

//               <View>
//                 <Text className="text-lg font-extrabold text-[#15213B]">
//                   All Services
//                 </Text>

//                 <Text className="mt-1 text-xs text-[#606F88]">
//                   Everything you need in one place
//                 </Text>
//               </View>

//               <View className="rounded-full bg-[#EEF0FF] px-3 py-1.5">
//                 <Text className="text-[10px] font-extrabold text-[#4355D8]">
//                   STUDENT
//                 </Text>
//               </View>

//             </View>

//             <View className="flex-row flex-wrap justify-between">

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "StudentTabs",
//                     { screen: "Homework" }
//                   )
//                 }
//                 className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4"
//               >
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
//                   <Ionicons name="document-text-outline" size={23} color="#4355D8" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Assignment</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("VideoClass")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
//                   <Ionicons name="videocam-outline" size={23} color="#DC4C5A" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Video Class</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("LiveClass")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
//                   <Ionicons name="radio-outline" size={23} color="#2BAA7B" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Live Class</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("Syllabus")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
//                   <Ionicons name="book-outline" size={23} color="#E59A2F" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Session Syllabus</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("EDocs")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
//                   <Ionicons name="documents-outline" size={23} color="#4355D8" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">E-Docs</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("NoticeBoard")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
//                   <Ionicons name="megaphone-outline" size={23} color="#DC4C5A" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Notice Board</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("Fees")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
//                   <Ionicons name="wallet-outline" size={23} color="#E59A2F" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Fee Detail</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("OnlineQuiz")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
//                   <Ionicons name="help-circle-outline" size={23} color="#2BAA7B" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Online Quiz</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("QuizReport")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
//                   <Ionicons name="bar-chart-outline" size={23} color="#4355D8" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Quiz Report</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("ExamMarks")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
//                   <Ionicons name="school-outline" size={23} color="#E59A2F" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Exam Marks</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("ProgressReport")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
//                   <Ionicons name="analytics-outline" size={23} color="#2BAA7B" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Progress Report</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("Achievement")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
//                   <Ionicons name="trophy-outline" size={23} color="#E59A2F" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Achievement</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("Calendar")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
//                   <Ionicons name="calendar-outline" size={23} color="#4355D8" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Calendar</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("Timetable")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
//                   <Ionicons name="time-outline" size={23} color="#2BAA7B" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Time Table</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("ExamTimetable")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
//                   <Ionicons name="calendar-number-outline" size={23} color="#DC4C5A" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Exam TimeTable</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("GPSTracker")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
//                   <Ionicons name="location-outline" size={23} color="#2BAA7B" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">GPS Tracker</Text>
//               </Pressable>

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "StudentTabs",
//                     { screen: "Profile" }
//                   )
//                 }
//                 className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4"
//               >
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
//                   <Ionicons name="person-outline" size={23} color="#4355D8" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Student Profile</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("MediaGallery")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
//                   <Ionicons name="images-outline" size={23} color="#DC4C5A" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Media Gallery</Text>
//               </Pressable>

//               <Pressable onPress={() => navigation.navigate("SchoolProfile")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
//                 <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
//                   <Ionicons name="business-outline" size={23} color="#E59A2F" />
//                 </View>
//                 <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">School Profile</Text>
//               </Pressable>

//             </View>

//           </View>

//           {/* ==========================================
//               TODAY'S CLASSES
//           ========================================== */}

//           <View className="mt-6">

//             <View className="mb-3 flex-row items-center justify-between">

//               <Text className="text-lg font-extrabold text-[#15213B]">
//                 Today's classes
//               </Text>

//               <Pressable
//                 onPress={() =>
//                   navigation.navigate(
//                     "Timetable"
//                   )
//                 }
//               >
//                 <Text className="text-xs font-bold text-[#4355D8]">
//                   View schedule
//                 </Text>
//               </Pressable>

//             </View>

//             {todayClasses.length >
//             0 ? (
//               todayClasses
//                 .slice(0, 3)
//                 .map(
//                   (
//                     item,
//                     index
//                   ) => (
//                     <View
//                       key={
//                         item._id ??
//                         String(index)
//                       }
//                       className="mb-3 flex-row rounded-2xl border border-[#E5E8F0] bg-white p-4"
//                     >

//                       {/* TIME */}

//                       <View className="w-[70px]">

//                         <Text className="text-xs font-extrabold text-[#4355D8]">
//                           {item.startTime ??
//                             "--:--"}
//                         </Text>

//                         {item.endTime ? (
//                           <Text className="mt-1 text-[10px] text-[#606F88]">
//                             {
//                               item.endTime
//                             }
//                           </Text>
//                         ) : null}

//                       </View>

//                       {/* LINE */}

//                       <View className="mr-4 items-center">

//                         <View className="h-3 w-3 rounded-full bg-[#2BAA7B]" />

//                         <View className="mt-1 h-12 w-px bg-[#E5E8F0]" />

//                       </View>

//                       {/* CLASS */}

//                       <View className="flex-1">

//                         <View className="self-start rounded-md bg-[#EEF0FF] px-2 py-1">

//                           <Text className="text-[8px] font-extrabold text-[#4355D8]">
//                             PERIOD{" "}
//                             {item.periodNumber ??
//                               item.period ??
//                               index +
//                                 1}
//                           </Text>

//                         </View>

//                         <Text className="mt-2 text-base font-extrabold text-[#15213B]">
//                           {getName(
//                             item.subjectId
//                           ) ||
//                             getName(
//                               item.subject
//                             ) ||
//                             "Subject"}
//                         </Text>

//                         <Text className="mt-1 text-xs text-[#606F88]">
//                           {getName(
//                             item.teacherId
//                           ) ||
//                             getName(
//                               item.teacher
//                             ) ||
//                             "Teacher"}
//                         </Text>

//                         {item.room ? (
//                           <View className="mt-1 flex-row items-center">

//                             <Ionicons
//                               name="location-outline"
//                               size={12}
//                               color="#606F88"
//                             />

//                             <Text className="ml-1 text-[10px] text-[#606F88]">
//                               {
//                                 item.room
//                               }
//                             </Text>

//                           </View>
//                         ) : null}

//                       </View>

//                     </View>
//                   )
//                 )
//             ) : (
//               <View className="items-center rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-6">

//                 <Ionicons
//                   name="calendar-clear-outline"
//                   size={32}
//                   color="#4355D8"
//                 />

//                 <Text className="mt-2 text-sm font-extrabold text-[#15213B]">
//                   No classes today
//                 </Text>

//                 <Text className="mt-1 text-center text-xs text-[#606F88]">
//                   Enjoy your free time.
//                 </Text>

//               </View>
//             )}

//           </View>

//           {/* ==========================================
//               HOMEWORK SUMMARY
//           ========================================== */}

//           <View className="mt-6">

//             <View className="mb-3 flex-row items-center justify-between">

//               <Text className="text-lg font-extrabold text-[#15213B]">
//                 Homework
//               </Text>

//               <Text className="text-xs font-bold text-[#4355D8]">
//                 {
//                   pendingHomework.length
//                 }{" "}
//                 Pending
//               </Text>

//             </View>

//             {pendingHomework.length >
//             0 ? (
//               pendingHomework
//                 .slice(0, 2)
//                 .map(
//                   (
//                     item,
//                     index
//                   ) => (
//                     <View
//                       key={
//                         item._id ??
//                         item.id ??
//                         String(index)
//                       }
//                       className="mb-3 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4"
//                     >

//                       <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF]">

//                         <Ionicons
//                           name="document-text-outline"
//                           size={21}
//                           color="#4355D8"
//                         />

//                       </View>

//                       <View className="ml-3 flex-1">

//                         <Text
//                           numberOfLines={
//                             1
//                           }
//                           className="text-sm font-extrabold text-[#15213B]"
//                         >
//                           {item.title ??
//                             "Homework"}
//                         </Text>

//                         <Text className="mt-1 text-xs text-[#606F88]">
//                           {getName(
//                             item.subjectId
//                           ) ||
//                             getName(
//                               item.subject
//                             ) ||
//                             "Subject"}
//                         </Text>

//                       </View>

//                       <View className="rounded-lg bg-[#FFF2DE] px-2.5 py-1.5">

//                         <Text className="text-[9px] font-extrabold text-[#7D4B0A]">
//                           PENDING
//                         </Text>

//                       </View>

//                     </View>
//                   )
//                 )
//             ) : (
//               <View className="items-center rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-6">

//                 <Ionicons
//                   name="checkmark-circle-outline"
//                   size={34}
//                   color="#2BAA7B"
//                 />

//                 <Text className="mt-2 text-sm font-extrabold text-[#15213B]">
//                   All caught up!
//                 </Text>

//                 <Text className="mt-1 text-xs text-[#606F88]">
//                   No pending homework.
//                 </Text>

//               </View>
//             )}

//           </View>

//         </ScrollView>

//       </View>
//     </SafeAreaView>
//   );
// };

// export default StudentDashboardScreen;











import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import api from "../../../api/axios";



import type {
  AttendanceRecord,
  HomeworkItem,
  StudentProfile,
  TimetableEntry,
} from "types/student.types";



import {
  extractApiData,
  extractArray,
  getName,
  getTodayName,
} from "utils/studentHelpers";
import { useAppSelector } from "@/store/hook";
import { StudentStackParamList } from "types/navigation.types";

/* =====================================================
   NAVIGATION TYPE
===================================================== */

type NavigationProp =
  NativeStackNavigationProp<StudentStackParamList>;

type AttendanceSummary = {
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  workingDays: number;
  attendancePercentage: number;
  below75: boolean;
};

type HomeworkSubmission = {
  _id?: string;
  homeworkId?:
    | string
    | {
        _id?: string;
        id?: string;
      };
  submissionStatus?: string;
  reviewStatus?: string;
  submissionMode?: string;
};

const initialAttendanceSummary: AttendanceSummary = {
  presentDays: 0,
  absentDays: 0,
  leaveDays: 0,
  halfDays: 0,
  workingDays: 0,
  attendancePercentage: 0,
  below75: false,
};

const getEntityId = (
  value:
    | string
    | {
        _id?: string;
        id?: string;
      }
    | null
    | undefined
) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id ?? value.id ?? "";
};

/* =====================================================
   SCREEN
===================================================== */

const StudentDashboardScreen = () => {
  const navigation =
    useNavigation<NavigationProp>();

  const authUser =
    useAppSelector(
      (state) => state.auth.user
    );

  /* ===================================================
     STATE
  =================================================== */

  const [
    profile,
    setProfile,
  ] =
    useState<StudentProfile | null>(
      null
    );

  const [
    attendance,
    setAttendance,
  ] = useState<
    AttendanceRecord[]
  >([]);

  const [
    attendanceSummary,
    setAttendanceSummary,
  ] = useState<AttendanceSummary>(
    initialAttendanceSummary
  );

  const [
    homeworkSubmissions,
    setHomeworkSubmissions,
  ] = useState<HomeworkSubmission[]>([]);

  const [
    timetable,
    setTimetable,
  ] = useState<
    TimetableEntry[]
  >([]);

  const [
    homework,
    setHomework,
  ] = useState<
    HomeworkItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  /* ===================================================
     LOAD DASHBOARD DATA
  =================================================== */

  const fetchDashboard =
    useCallback(
      async (
        refresh = false
      ) => {
        try {
          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const results =
            await Promise.allSettled(
              [
                api.get(
                  "/students/me"
                ),

                api.get(
                  "/attendance/me"
                ),

                api.get(
                  "/timetable/me"
                ),

                api.get(
                  "/homework/me"
                ),

                api.get(
                  "/homework-submissions/me"
                ),
              ]
            );

          const [
            profileResult,
            attendanceResult,
            timetableResult,
            homeworkResult,
            homeworkSubmissionsResult,
          ] = results;

          /* =============================================
             PROFILE
          ============================================= */

          if (
            profileResult.status ===
            "fulfilled"
          ) {
            const data =
              extractApiData(
                profileResult.value
              );

            const studentProfile =
              data?.student ??
              data?.profile ??
              data?.data?.student ??
              data?.data?.profile ??
              data?.data ??
              data;

            setProfile(
              studentProfile &&
                typeof studentProfile ===
                  "object"
                ? studentProfile
                : null
            );
          } else {
            console.log(
              "PROFILE ERROR:",
              profileResult.reason
                ?.response?.data ??
                profileResult.reason
                  ?.message ??
                profileResult.reason
            );
          }

          /* =============================================
             ATTENDANCE
          ============================================= */

          if (
            attendanceResult.status ===
            "fulfilled"
          ) {
            const data =
              extractApiData(
                attendanceResult.value
              );

            setAttendance(
              Array.isArray(
                data?.calendar
              )
                ? data.calendar
                : []
            );

            setAttendanceSummary(
              data?.summary ??
                initialAttendanceSummary
            );
          } else {
            console.log(
              "ATTENDANCE ERROR:",
              attendanceResult.reason
                ?.response?.data ??
                attendanceResult.reason
                  ?.message ??
                attendanceResult.reason
            );
          }

          /* =============================================
             TIMETABLE
          ============================================= */

          if (
            timetableResult.status ===
            "fulfilled"
          ) {
            const data =
              extractApiData(
                timetableResult.value
              );

            setTimetable(
              extractArray(
                data,
                [
                  "timetable",
                  "entries",
                  "periods",
                  "schedules",
                ]
              )
            );
          } else {
            console.log(
              "TIMETABLE ERROR:",
              timetableResult.reason
                ?.response?.data ??
                timetableResult.reason
                  ?.message ??
                timetableResult.reason
            );
          }

          /* =============================================
             HOMEWORK
          ============================================= */

          if (
            homeworkResult.status ===
            "fulfilled"
          ) {
            const data =
              extractApiData(
                homeworkResult.value
              );

            setHomework(
              extractArray(
                data,
                [
                  "homework",
                  "homeworks",
                  "assignments",
                ]
              )
            );
          } else {
            console.log(
              "HOMEWORK ERROR:",
              homeworkResult.reason
                ?.response?.data ??
                homeworkResult.reason
                  ?.message ??
                homeworkResult.reason
            );
          }

          /* =============================================
             HOMEWORK SUBMISSIONS / TEACHER REVIEW
          ============================================= */

          if (
            homeworkSubmissionsResult.status ===
            "fulfilled"
          ) {
            const data =
              extractApiData(
                homeworkSubmissionsResult.value
              );

            const list =
              extractArray(
                data,
                [
                  "submissions",
                  "submission",
                  "homeworkSubmissions",
                ]
              ) as HomeworkSubmission[];

            setHomeworkSubmissions(
              list
            );

            console.log(
              "DASHBOARD HOMEWORK SUBMISSIONS:",
              JSON.stringify(
                homeworkSubmissionsResult.value.data,
                null,
                2
              )
            );
          } else {
            console.log(
              "HOMEWORK SUBMISSIONS ERROR:",
              homeworkSubmissionsResult.reason
                ?.response?.data ??
                homeworkSubmissionsResult.reason
                  ?.message ??
                homeworkSubmissionsResult.reason
            );
          }

          /* =============================================
             ALL API FAILED
          ============================================= */

          const failedRequests =
            results.filter(
              (result) =>
                result.status ===
                "rejected"
            );

          if (
            failedRequests.length ===
            results.length
          ) {
            setError(
              "Dashboard data load nahi ho saka."
            );
          }
        } catch (err: any) {
          console.log(
            "DASHBOARD ERROR:",
            err?.response?.data ??
              err?.message
          );

          setError(
            err?.response?.data
              ?.message ??
              err?.message ??
              "Something went wrong."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  /* ===================================================
     STUDENT DATA
  =================================================== */

  const studentName =
    profile?.name ??
    authUser?.name ??
    "Student";

  const firstName =
    studentName
      .trim()
      .split(" ")[0] ||
    "Student";

  const className =
    getName(
      profile?.classId
    ) ||
    getName(
      profile?.class
    ) ||
    "-";

  const sectionName =
    getName(
      profile?.sectionId
    ) ||
    getName(
      profile?.section
    ) ||
    "-";

  const rollNumber =
    profile?.rollNumber ??
    profile?.rollNo ??
    "-";

  const admissionNumber =
    profile?.admissionNumber ??
    profile?.admissionNo ??
    profile?.admissionId ??
    "-";

  /* ===================================================
     ATTENDANCE - BACKEND SUMMARY
  =================================================== */

  const attendanceStats = {
    present:
      attendanceSummary.presentDays,
    absent:
      attendanceSummary.absentDays,
    leave:
      attendanceSummary.leaveDays,
    halfDay:
      attendanceSummary.halfDays,
    total:
      attendanceSummary.workingDays,
    percentage:
      attendanceSummary.attendancePercentage,
  };

  /* ===================================================
     PENDING HOMEWORK - TEACHER REVIEW STATUS
  =================================================== */

  const submissionMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          HomeworkSubmission
        >();

      homeworkSubmissions.forEach(
        (submission) => {
          const homeworkId =
            getEntityId(
              submission.homeworkId
            );

          if (homeworkId) {
            map.set(
              homeworkId,
              submission
            );
          }
        }
      );

      return map;
    }, [homeworkSubmissions]);

  const pendingHomework =
    useMemo(() => {
      return homework.filter(
        (item) => {
          const homeworkId =
            item._id ??
            item.id ??
            "";

          const submission =
            submissionMap.get(
              homeworkId
            );

          if (!submission) {
            return true;
          }

          const reviewStatus =
            (
              submission.reviewStatus ??
              "PENDING"
            ).toUpperCase();

          return (
            reviewStatus !==
              "COMPLETED" &&
            reviewStatus !==
              "REVIEWED"
          );
        }
      );
    }, [
      homework,
      submissionMap,
    ]);

  /* ===================================================
     TODAY CLASSES
  =================================================== */

  const todayClasses =
    useMemo(() => {
      const today =
        getTodayName();

      return timetable
        .filter(
          (item) =>
            !item.day ||
            item.day.toUpperCase() ===
              today
        )
        .sort((a, b) =>
          (
            a.startTime ?? ""
          ).localeCompare(
            b.startTime ?? ""
          )
        );
    }, [timetable]);

  const nextClass =
    todayClasses[0];

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-[24px] bg-[#4355D8]">
          <Ionicons
            name="school"
            size={36}
            color="#FFFFFF"
          />
        </View>

        <ActivityIndicator
          size="large"
          color="#4355D8"
        />

        <Text className="mt-4 text-sm font-semibold text-[#606F88]">
          Loading dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "left",
        "right",
      ]}
      className="flex-1 bg-[#4355D8]"
    >
      <View className="flex-1 bg-[#F7F7FB]">

        {/* ============================================
            HEADER
        ============================================ */}

        <View className="rounded-b-[35px] bg-[#4355D8] px-5 pb-16 pt-6">

          <View className="flex-row items-center justify-between">

            <View className="flex-1">

              <Text className="text-sm font-medium text-white/80">
                Welcome back 👋
              </Text>

              <Text className="mt-1 text-3xl font-extrabold text-white">
                {firstName}
              </Text>

              <Text className="mt-1 text-xs text-white/70">
                Ready for another
                productive day?
              </Text>

            </View>

            {/* Notification */}

            <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#FFFFFF"
              />

              <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FFCF55]" />
            </Pressable>

          </View>

        </View>

        {/* ============================================
            SCROLL CONTENT
        ============================================ */}

        <ScrollView
          className="-mt-8"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="px-5 pb-10"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                fetchDashboard(
                  true
                )
              }
              tintColor="#4355D8"
            />
          }
        >

          {/* ==========================================
              ERROR
          ========================================== */}

          {error ? (
            <View className="mb-4 flex-row items-center rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#DC4C5A"
              />

              <Text className="ml-2 flex-1 text-xs font-medium text-[#DC4C5A]">
                {error}
              </Text>

            </View>
          ) : null}

          {/* ==========================================
              STUDENT CARD
          ========================================== */}

          <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

            <View className="flex-row items-start justify-between">

              <View className="flex-1">

                <Text className="text-lg font-extrabold text-[#15213B]">
                  {studentName}
                </Text>

                <Text className="mt-1 text-xs leading-5 text-[#606F88]">
                  {className} •
                  Section{" "}
                  {sectionName} •
                  Roll No.{" "}
                  {rollNumber}
                </Text>

              </View>

              <View className="ml-3 rounded-xl bg-[#EEF0FF] px-3 py-2">

                <Text className="text-[9px] font-bold text-[#606F88]">
                  ADMISSION
                </Text>

                <Text className="mt-0.5 text-[11px] font-extrabold text-[#4355D8]">
                  {String(
                    admissionNumber
                  )}
                </Text>

              </View>

            </View>

          </View>

          {/* ==========================================
              TODAY AT A GLANCE
          ========================================== */}

          <View className="mt-6">

            <View className="mb-3 flex-row items-center justify-between">

              <Text className="text-lg font-extrabold text-[#15213B]">
                Today at a glance
              </Text>

              <View className="flex-row items-center">

                <View className="mr-2 h-2 w-2 rounded-full bg-[#2BAA7B]" />

                <Text className="text-xs font-bold text-[#4355D8]">
                  Live
                </Text>

              </View>

            </View>

            <View className="flex-row flex-wrap justify-between gap-y-3">

              {/* ATTENDANCE */}

              <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

                <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E7F7F1]">

                  <Ionicons
                    name="stats-chart-outline"
                    size={20}
                    color="#2BAA7B"
                  />

                </View>

                <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                  ATTENDANCE
                </Text>

                <Text className="mt-1 text-3xl font-extrabold text-[#2BAA7B]">
                  {
                    attendanceStats.percentage
                  }
                  %
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Overall attendance
                </Text>

              </View>

              {/* HOMEWORK */}

              <View className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4">

                <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#4355D8"
                  />

                </View>

                <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                  HOMEWORK
                </Text>

                <Text className="mt-1 text-3xl font-extrabold text-[#15213B]">
                  {
                    pendingHomework.length
                  }
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Pending tasks
                </Text>

              </View>

              {/* FEES */}

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Fees"
                  )
                }
                className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
              >

                <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2DE]">

                  <Ionicons
                    name="card-outline"
                    size={20}
                    color="#E59A2F"
                  />

                </View>

                <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                  FEES
                </Text>

                <Text className="mt-2 text-base font-extrabold text-[#15213B]">
                  View Fees
                </Text>

                <View className="mt-1 flex-row items-center">

                  <Text className="text-xs text-[#606F88]">
                    Fee details
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color="#606F88"
                  />

                </View>

              </Pressable>

              {/* NEXT CLASS */}

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Timetable"
                  )
                }
                className="w-[48%] rounded-2xl border border-[#E5E8F0] bg-white p-4"
              >

                <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">

                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#4355D8"
                  />

                </View>

                <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                  NEXT CLASS
                </Text>

                <Text
                  numberOfLines={1}
                  className="mt-2 text-base font-extrabold text-[#15213B]"
                >
                  {nextClass
                    ? getName(
                        nextClass.subjectId
                      ) ||
                      getName(
                        nextClass.subject
                      ) ||
                      "Subject"
                    : "No Class"}
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {nextClass
                    ?.startTime ??
                    "No class today"}
                </Text>

              </Pressable>

            </View>

          </View>

          {/* ==========================================
              QUICK ACCESS
          ========================================== */}

          <View className="mt-6">

            <Text className="mb-3 text-lg font-extrabold text-[#15213B]">
              Quick access
            </Text>

            <View className="flex-row gap-3">

              {/* TIMETABLE */}

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Timetable"
                  )
                }
                className="flex-1 items-center rounded-2xl bg-[#EEF0FF] p-4"
              >

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color="#4355D8"
                  />

                </View>

                <Text className="mt-2 text-xs font-bold text-[#15213B]">
                  Timetable
                </Text>

              </Pressable>

              {/* FEES */}

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Fees"
                  )
                }
                className="flex-1 items-center rounded-2xl bg-[#FFF2DE] p-4"
              >

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color="#E59A2F"
                  />

                </View>

                <Text className="mt-2 text-xs font-bold text-[#15213B]">
                  Fees
                </Text>

              </Pressable>

              {/* EXAMS */}

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Exams"
                  )
                }
                className="flex-1 items-center rounded-2xl bg-[#EFF1F6] p-4"
              >

                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/70">

                  <Ionicons
                    name="ribbon-outline"
                    size={24}
                    color="#4355D8"
                  />

                </View>

                <Text className="mt-2 text-xs font-bold text-[#15213B]">
                  Exams
                </Text>

              </Pressable>

            </View>

          </View>

          {/* ==========================================
              ALL SERVICES
          ========================================== */}

          <View className="mt-6">

            <View className="mb-4 flex-row items-center justify-between">

              <View>
                <Text className="text-lg font-extrabold text-[#15213B]">
                  All Services
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Everything you need in one place
                </Text>
              </View>

              <View className="rounded-full bg-[#EEF0FF] px-3 py-1.5">
                <Text className="text-[10px] font-extrabold text-[#4355D8]">
                  STUDENT
                </Text>
              </View>

            </View>

            <View className="flex-row flex-wrap justify-between">

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "StudentTabs",
                    { screen: "Homework" }
                  )
                }
                className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4"
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons name="document-text-outline" size={23} color="#4355D8" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Assignment</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("VideoClass")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
                  <Ionicons name="videocam-outline" size={23} color="#DC4C5A" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Video Class</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("LiveClass")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
                  <Ionicons name="radio-outline" size={23} color="#2BAA7B" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Live Class</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Syllabus")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                  <Ionicons name="book-outline" size={23} color="#E59A2F" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Session Syllabus</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("EDocs")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons name="documents-outline" size={23} color="#4355D8" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">E-Docs</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("NoticeBoard")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
                  <Ionicons name="megaphone-outline" size={23} color="#DC4C5A" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Notice Board</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Fees")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                  <Ionicons name="wallet-outline" size={23} color="#E59A2F" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Fee Detail</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("OnlineQuiz")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
                  <Ionicons name="help-circle-outline" size={23} color="#2BAA7B" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Online Quiz</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("QuizReport")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons name="bar-chart-outline" size={23} color="#4355D8" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Quiz Report</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("ExamMarks")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                  <Ionicons name="school-outline" size={23} color="#E59A2F" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Exam Marks</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("ProgressReport")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
                  <Ionicons name="analytics-outline" size={23} color="#2BAA7B" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Progress Report</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Achievement")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                  <Ionicons name="trophy-outline" size={23} color="#E59A2F" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Achievement</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Calendar")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons name="calendar-outline" size={23} color="#4355D8" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Calendar</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Timetable")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
                  <Ionicons name="time-outline" size={23} color="#2BAA7B" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Time Table</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("ExamTimetable")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
                  <Ionicons name="calendar-number-outline" size={23} color="#DC4C5A" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Exam TimeTable</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("GPSTracker")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F7F1]">
                  <Ionicons name="location-outline" size={23} color="#2BAA7B" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">GPS Tracker</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "StudentTabs",
                    { screen: "Profile" }
                  )
                }
                className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4"
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                  <Ionicons name="person-outline" size={23} color="#4355D8" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Student Profile</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("MediaGallery")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEE]">
                  <Ionicons name="images-outline" size={23} color="#DC4C5A" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">Media Gallery</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("SchoolProfile")} className="mb-3 w-[31.5%] items-center rounded-2xl border border-[#E5E8F0] bg-white px-2 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2DE]">
                  <Ionicons name="business-outline" size={23} color="#E59A2F" />
                </View>
                <Text className="mt-2 text-center text-[11px] font-bold text-[#15213B]">School Profile</Text>
              </Pressable>

            </View>

          </View>

          {/* ==========================================
              TODAY'S CLASSES
          ========================================== */}

          <View className="mt-6">

            <View className="mb-3 flex-row items-center justify-between">

              <Text className="text-lg font-extrabold text-[#15213B]">
                Today's classes
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "Timetable"
                  )
                }
              >
                <Text className="text-xs font-bold text-[#4355D8]">
                  View schedule
                </Text>
              </Pressable>

            </View>

            {todayClasses.length >
            0 ? (
              todayClasses
                .slice(0, 3)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <View
                      key={
                        item._id ??
                        String(index)
                      }
                      className="mb-3 flex-row rounded-2xl border border-[#E5E8F0] bg-white p-4"
                    >

                      {/* TIME */}

                      <View className="w-[70px]">

                        <Text className="text-xs font-extrabold text-[#4355D8]">
                          {item.startTime ??
                            "--:--"}
                        </Text>

                        {item.endTime ? (
                          <Text className="mt-1 text-[10px] text-[#606F88]">
                            {
                              item.endTime
                            }
                          </Text>
                        ) : null}

                      </View>

                      {/* LINE */}

                      <View className="mr-4 items-center">

                        <View className="h-3 w-3 rounded-full bg-[#2BAA7B]" />

                        <View className="mt-1 h-12 w-px bg-[#E5E8F0]" />

                      </View>

                      {/* CLASS */}

                      <View className="flex-1">

                        <View className="self-start rounded-md bg-[#EEF0FF] px-2 py-1">

                          <Text className="text-[8px] font-extrabold text-[#4355D8]">
                            PERIOD{" "}
                            {item.periodNumber ??
                              item.period ??
                              index +
                                1}
                          </Text>

                        </View>

                        <Text className="mt-2 text-base font-extrabold text-[#15213B]">
                          {getName(
                            item.subjectId
                          ) ||
                            getName(
                              item.subject
                            ) ||
                            "Subject"}
                        </Text>

                        <Text className="mt-1 text-xs text-[#606F88]">
                          {getName(
                            item.teacherId
                          ) ||
                            getName(
                              item.teacher
                            ) ||
                            "Teacher"}
                        </Text>

                        {item.room ? (
                          <View className="mt-1 flex-row items-center">

                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#606F88"
                            />

                            <Text className="ml-1 text-[10px] text-[#606F88]">
                              {
                                item.room
                              }
                            </Text>

                          </View>
                        ) : null}

                      </View>

                    </View>
                  )
                )
            ) : (
              <View className="items-center rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-6">

                <Ionicons
                  name="calendar-clear-outline"
                  size={32}
                  color="#4355D8"
                />

                <Text className="mt-2 text-sm font-extrabold text-[#15213B]">
                  No classes today
                </Text>

                <Text className="mt-1 text-center text-xs text-[#606F88]">
                  Enjoy your free time.
                </Text>

              </View>
            )}

          </View>

          {/* ==========================================
              HOMEWORK SUMMARY
          ========================================== */}

          <View className="mt-6">

            <View className="mb-3 flex-row items-center justify-between">

              <Text className="text-lg font-extrabold text-[#15213B]">
                Homework
              </Text>

              <Text className="text-xs font-bold text-[#4355D8]">
                {
                  pendingHomework.length
                }{" "}
                Pending
              </Text>

            </View>

            {pendingHomework.length >
            0 ? (
              pendingHomework
                .slice(0, 2)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <View
                      key={
                        item._id ??
                        item.id ??
                        String(index)
                      }
                      className="mb-3 flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white p-4"
                    >

                      <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF]">

                        <Ionicons
                          name="document-text-outline"
                          size={21}
                          color="#4355D8"
                        />

                      </View>

                      <View className="ml-3 flex-1">

                        <Text
                          numberOfLines={
                            1
                          }
                          className="text-sm font-extrabold text-[#15213B]"
                        >
                          {item.title ??
                            "Homework"}
                        </Text>

                        <Text className="mt-1 text-xs text-[#606F88]">
                          {getName(
                            item.subjectId
                          ) ||
                            getName(
                              item.subject
                            ) ||
                            "Subject"}
                        </Text>

                      </View>

                      <View className="rounded-lg bg-[#FFF2DE] px-2.5 py-1.5">

                        <Text className="text-[9px] font-extrabold text-[#7D4B0A]">
                          PENDING
                        </Text>

                      </View>

                    </View>
                  )
                )
            ) : (
              <View className="items-center rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-6">

                <Ionicons
                  name="checkmark-circle-outline"
                  size={34}
                  color="#2BAA7B"
                />

                <Text className="mt-2 text-sm font-extrabold text-[#15213B]">
                  All caught up!
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  No pending homework.
                </Text>

              </View>
            )}

          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

export default StudentDashboardScreen;
