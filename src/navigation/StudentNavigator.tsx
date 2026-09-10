



// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

// import StudentTabNavigator from "./student/StudentTabNavigator";

// import StudentFeesScreen from
//   "../screens/student/fees/StudentFeesScreen";

// import StudentTimetableScreen from
//   "../screens/student/timetable/StudentTimetableScreen";

// import VideoClassScreen from
//   "../screens/student/services/videoClass/VideoClassScreen";

// import LiveClassScreen from
//   "../screens/student/services/liveClass/LiveClassScreen";

// import SyllabusScreen from
//   "../screens/student/services/syllabus/SyllabusScreen";

// import EDocsScreen from
//   "../screens/student/services/eDocs/EDocsScreen";

// import NoticeBoardScreen from
//   "../screens/student/services/noticeBoard/NoticeBoardScreen";

// import OnlineQuizScreen from
//   "../screens/student/services/onlineQuiz/OnlineQuizScreen";

// import QuizReportScreen from
//   "../screens/student/services/quizReport/QuizReportScreen";

// import ExamMarksScreen from
//   "../screens/student/services/examMarks/ExamMarksScreen";

// import ProgressReportScreen from
//   "../screens/student/services/progressReport/ProgressReportScreen";

// import AchievementScreen from
//   "../screens/student/services/achievement/AchievementScreen";

// import CalendarScreen from
//   "../screens/student/services/calendar/CalendarScreen";

// import ExamTimetableScreen from
//   "../screens/student/services/examTimetable/ExamTimetableScreen";

// import GPSTrackerScreen from
//   "../screens/student/services/gpsTracker/GPSTrackerScreen";

// import MediaGalleryScreen from
//   "../screens/student/services/mediaGallery/MediaGalleryScreen";

// import SchoolProfileScreen from
//   "../screens/student/services/schoolProfile/SchoolProfileScreen";


// import type {
//   StudentStackParamList,
// } from "types/navigation.types";
// import ExamsScreen from "@/screens/student/exams/StudentExamsScreen";


// const Stack =
//   createNativeStackNavigator<
//     StudentStackParamList
//   >();


// const StudentNavigator =
//   () => {
//     return (
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}
//       >

//         <Stack.Screen
//           name="StudentTabs"
//           component={
//             StudentTabNavigator
//           }
//         />


//         {/* EXISTING REAL SCREENS */}

//         <Stack.Screen
//           name="Timetable"
//           component={
//             StudentTimetableScreen
//           }
//         />

//         <Stack.Screen
//           name="Fees"
//           component={
//             StudentFeesScreen
//           }
//         />


//         {/* ALL SERVICES */}

//         <Stack.Screen
//           name="VideoClass"
//           component={
//             VideoClassScreen
//           }
//         />

//         <Stack.Screen
//           name="LiveClass"
//           component={
//             LiveClassScreen
//           }
//         />

//         <Stack.Screen
//           name="Syllabus"
//           component={
//             SyllabusScreen
//           }
//         />

//         <Stack.Screen
//           name="EDocs"
//           component={
//             EDocsScreen
//           }
//         />

//         <Stack.Screen
//           name="NoticeBoard"
//           component={
//             NoticeBoardScreen
//           }
//         />

//         <Stack.Screen
//           name="OnlineQuiz"
//           component={
//             OnlineQuizScreen
//           }
//         />

//         <Stack.Screen
//           name="QuizReport"
//           component={
//             QuizReportScreen
//           }
//         />

//         <Stack.Screen
//           name="ExamMarks"
//           component={
//             ExamMarksScreen
//           }
//         />

//         <Stack.Screen
//           name="ProgressReport"
//           component={
//             ProgressReportScreen
//           }
//         />

//         <Stack.Screen
//           name="Achievement"
//           component={
//             AchievementScreen
//           }
//         />

//         <Stack.Screen
//           name="Calendar"
//           component={
//             CalendarScreen
//           }
//         />

//         <Stack.Screen
//           name="ExamTimetable"
//           component={
//             ExamTimetableScreen
//           }
//         />

//         <Stack.Screen
//           name="GPSTracker"
//           component={
//             GPSTrackerScreen
//           }
//         />

//         <Stack.Screen
//           name="MediaGallery"
//           component={
//             MediaGalleryScreen
//           }
//         />

//         <Stack.Screen
//           name="SchoolProfile"
//           component={
//             SchoolProfileScreen
//           }
//         />

//         <Stack.Screen
//   name="Exams"
//   component={ExamsScreen}
// />

//       </Stack.Navigator>
//     );
//   };


// export default StudentNavigator;


import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import StudentTabNavigator
  from "./student/StudentTabNavigator";

import NotificationScreen
  from "../screens/common/notifications/NotificationScreen";

import StudentFeesScreen
  from "../screens/student/fees/StudentFeesScreen";

import StudentTimetableScreen
  from "../screens/student/timetable/StudentTimetableScreen";

import StudentExamsScreen
  from "../screens/student/exams/StudentExamsScreen";

import VideoClassScreen
  from "../screens/student/services/videoClass/VideoClassScreen";

import LiveClassScreen
  from "../screens/student/services/liveClass/LiveClassScreen";

import SyllabusScreen
  from "../screens/student/services/syllabus/SyllabusScreen";

import EDocsScreen
  from "../screens/student/services/eDocs/EDocsScreen";

import NoticeBoardScreen
  from "../screens/student/services/noticeBoard/NoticeBoardScreen";

import OnlineQuizScreen
  from "../screens/student/services/onlineQuiz/OnlineQuizScreen";

import QuizReportScreen
  from "../screens/student/services/quizReport/QuizReportScreen";

import ExamMarksScreen
  from "../screens/student/services/examMarks/ExamMarksScreen";

import ProgressReportScreen
  from "../screens/student/services/progressReport/ProgressReportScreen";

import AchievementScreen
  from "../screens/student/services/achievement/AchievementScreen";

import CalendarScreen
  from "../screens/student/services/calendar/CalendarScreen";

import ExamTimetableScreen
  from "../screens/student/services/examTimetable/ExamTimetableScreen";

import GPSTrackerScreen
  from "../screens/student/services/gpsTracker/GPSTrackerScreen";

import MediaGalleryScreen
  from "../screens/student/services/mediaGallery/MediaGalleryScreen";

import SchoolProfileScreen
  from "../screens/student/services/schoolProfile/SchoolProfileScreen";

import type {
  StudentStackParamList,
} from "../../types/navigation.types";


/* =====================================================
   STACK
===================================================== */

const Stack =
  createNativeStackNavigator<
    StudentStackParamList
  >();


/* =====================================================
   STUDENT NAVIGATOR
===================================================== */

const StudentNavigator =
  () => {
    return (
      <Stack.Navigator
        initialRouteName="StudentTabs"
        screenOptions={{
          headerShown:
            false,

          animation:
            "slide_from_right",
        }}
      >
        {/* ===========================================
            STUDENT BOTTOM TABS
        =========================================== */}

        <Stack.Screen
          name="StudentTabs"
          component={
            StudentTabNavigator
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
            EXISTING STUDENT SCREENS
        =========================================== */}

        <Stack.Screen
          name="Timetable"
          component={
            StudentTimetableScreen
          }
        />

        <Stack.Screen
          name="Exams"
          component={
            StudentExamsScreen
          }
        />

        <Stack.Screen
          name="Fees"
          component={
            StudentFeesScreen
          }
        />


        {/* ===========================================
            STUDENT SERVICES
        =========================================== */}

        <Stack.Screen
          name="VideoClass"
          component={
            VideoClassScreen
          }
        />

        <Stack.Screen
          name="LiveClass"
          component={
            LiveClassScreen
          }
        />

        <Stack.Screen
          name="Syllabus"
          component={
            SyllabusScreen
          }
        />

        <Stack.Screen
          name="EDocs"
          component={
            EDocsScreen
          }
        />

        <Stack.Screen
          name="NoticeBoard"
          component={
            NoticeBoardScreen
          }
        />

        <Stack.Screen
          name="OnlineQuiz"
          component={
            OnlineQuizScreen
          }
        />

        <Stack.Screen
          name="QuizReport"
          component={
            QuizReportScreen
          }
        />

        <Stack.Screen
          name="ExamMarks"
          component={
            ExamMarksScreen
          }
        />

        <Stack.Screen
          name="ProgressReport"
          component={
            ProgressReportScreen
          }
        />

        <Stack.Screen
          name="Achievement"
          component={
            AchievementScreen
          }
        />

        <Stack.Screen
          name="Calendar"
          component={
            CalendarScreen
          }
        />

        <Stack.Screen
          name="ExamTimetable"
          component={
            ExamTimetableScreen
          }
        />

        <Stack.Screen
          name="GPSTracker"
          component={
            GPSTrackerScreen
          }
        />

        <Stack.Screen
          name="MediaGallery"
          component={
            MediaGalleryScreen
          }
        />

        <Stack.Screen
          name="SchoolProfile"
          component={
            SchoolProfileScreen
          }
        />
      </Stack.Navigator>
    );
  };


export default
  StudentNavigator;