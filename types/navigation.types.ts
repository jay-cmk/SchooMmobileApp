


// import type {
//   NavigatorScreenParams,
// } from "@react-navigation/native";

// // ROOT NAVIGATION
// export type RootStackParamList = {
//   Splash: undefined;
//   Login: undefined;
//   StudentApp: undefined;
//   TeacherApp: undefined;
//   SchoolAdminApp: undefined;
// };

// // STUDENT BOTTOM TABS
// export type StudentTabParamList = {
//   Home: undefined;
//   Subjects: undefined;
//   Attendance: undefined;
//   Homework: undefined;
//   Profile: undefined;
// };

// // STUDENT STACK
// export type StudentStackParamList = {
//   StudentTabs:
//     NavigatorScreenParams<StudentTabParamList>;

//   Timetable: undefined;
//   Exams: undefined;
//   Fees: undefined;

//   HomeworkDetail: {
//     homeworkId: string;
//   };

//   VideoClass: undefined;
//   LiveClass: undefined;
//   Syllabus: undefined;
//   EDocs: undefined;
//   NoticeBoard: undefined;
//   OnlineQuiz: undefined;
//   QuizReport: undefined;
//   ExamMarks: undefined;
//   ProgressReport: undefined;
//   Achievement: undefined;
//   Calendar: undefined;
//   ExamTimetable: undefined;
//   GPSTracker: undefined;
//   MediaGallery: undefined;
//   SchoolProfile: undefined;
// };

// // TEACHER BOTTOM TABS
// export type TeacherTabParamList = {
//   Home: undefined;
//   Classes: undefined;
//   Attendance: undefined;
//   Homework: undefined;
//   Profile: undefined;
// };

// // TEACHER STACK
// export type TeacherStackParamList = {
//   TeacherTabs: undefined;

//   Timetable: undefined;
//   Subjects: undefined;
//   Salary: undefined;
//   CreateHomework: undefined;

//   HomeworkReview: {
//     homeworkId: string;
//     sessionId: string;
//     classId: string;
//     sectionId: string;
//     homeworkTitle?: string;
//   };
// };


// export type SchoolAdminTabParamList = {
//   Home: undefined;
//   Students: undefined;
//   Teachers: undefined;
//   Academics: undefined;
//   Profile: undefined;
// };

// export type SchoolAdminStackParamList = {
//   SchoolAdminTabs: undefined;

//   Attendance: undefined;
//   SubjectAssignment: undefined;
//   Timetable: undefined;
//   Homework: undefined;

//   Sessions: undefined;
//   Classes: undefined;
//   Sections: undefined;
//   Subjects: undefined;
// };

// export interface SubjectAssignment {
//   _id: string;

//   academicSessionId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   classId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   sectionId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//       };

//   subjectId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//         code?: string;
//       };

//   teacherId:
//     | string
//     | {
//         _id: string;
//         name?: string;
//         email?: string;
//       };

//   status?: string;

//   createdAt?: string;
// }

// export interface CreateSubjectAssignmentPayload {
//   academicSessionId: string;
//   classId: string;
//   sectionId: string;
//   subjectId: string;
//   teacherId: string;
// }

import type {
  NavigatorScreenParams,
} from "@react-navigation/native";


/* =====================================================
   STUDENT BOTTOM TABS
===================================================== */

export type StudentTabParamList = {
  Home:
    undefined;

  Subjects:
    undefined;

  Attendance:
    undefined;

  Homework:
    undefined;

  Profile:
    undefined;
};


/* =====================================================
   STUDENT STACK
===================================================== */

export type StudentStackParamList = {
  StudentTabs:
    NavigatorScreenParams<
      StudentTabParamList
    >;

  /*
   * Student notification list screen.
   */
  Notifications:
    undefined;

  Timetable:
    undefined;

  Exams:
    undefined;

  Fees:
    undefined;

  HomeworkDetail: {
    homeworkId:
      string;
  };

  VideoClass:
    undefined;

  LiveClass:
    undefined;

  Syllabus:
    undefined;

  EDocs:
    undefined;

  NoticeBoard:
    undefined;

  OnlineQuiz:
    undefined;

  QuizReport:
    undefined;

  ExamMarks:
    undefined;

  ProgressReport:
    undefined;

  Achievement:
    undefined;

  Calendar:
    undefined;

  ExamTimetable:
    undefined;

  GPSTracker:
    undefined;

  MediaGallery:
    undefined;

  SchoolProfile:
    undefined;
};


/* =====================================================
   TEACHER BOTTOM TABS
===================================================== */

export type TeacherTabParamList = {
  Home:
    undefined;

  Classes:
    undefined;

  Attendance:
    undefined;

  Homework:
    undefined;

  Profile:
    undefined;
};


/* =====================================================
   TEACHER STACK
===================================================== */

export type TeacherStackParamList = {
  /*
   * TeacherTabs के अंदर Home, Classes, Attendance,
   * Homework और Profile screens हैं.
   */
  TeacherTabs:
    NavigatorScreenParams<
      TeacherTabParamList
    >;

  /*
   * Teacher notification list screen.
   */
  Notifications:
    undefined;

  Timetable:
    undefined;

  Subjects:
    undefined;

  Salary:
    undefined;

  CreateHomework:
    undefined;

  HomeworkReview: {
    homeworkId:
      string;

    sessionId:
      string;

    classId:
      string;

    sectionId:
      string;

    homeworkTitle?:
      string;
  };
};


/* =====================================================
   SCHOOL ADMIN BOTTOM TABS
===================================================== */

export type SchoolAdminTabParamList = {
  Home:
    undefined;

  Students:
    undefined;

  Teachers:
    undefined;

  Academics:
    undefined;

  Profile:
    undefined;
};


/* =====================================================
   SCHOOL ADMIN STACK
===================================================== */

export type SchoolAdminStackParamList = {
  SchoolAdminTabs:
    NavigatorScreenParams<
      SchoolAdminTabParamList
    >;

  /*
   * School Admin notification list screen.
   */
  Notifications:
    undefined;

  Attendance:
    undefined;

  SubjectAssignment:
    undefined;

  Timetable:
    undefined;

  Homework:
    undefined;

  Sessions:
    undefined;

  Classes:
    undefined;

  Sections:
    undefined;

  Subjects:
    undefined;
};


/* =====================================================
   ROOT NAVIGATION

   Root के अंदर role-based nested stacks हैं.
===================================================== */

export type RootStackParamList = {
  Splash:
    undefined;

  Login:
    undefined;

  StudentApp:
    NavigatorScreenParams<
      StudentStackParamList
    >;

  TeacherApp:
    NavigatorScreenParams<
      TeacherStackParamList
    >;

  SchoolAdminApp:
    NavigatorScreenParams<
      SchoolAdminStackParamList
    >;
};


/* =====================================================
   SUBJECT ASSIGNMENT RELATION
===================================================== */

export interface SubjectAssignmentRelation {
  _id:
    string;

  name?:
    string;
}


/* =====================================================
   SUBJECT RELATION
===================================================== */

export interface SubjectAssignmentSubjectRelation
  extends SubjectAssignmentRelation {
  code?:
    string;
}


/* =====================================================
   TEACHER RELATION
===================================================== */

export interface SubjectAssignmentTeacherRelation
  extends SubjectAssignmentRelation {
  email?:
    string;
}


/* =====================================================
   SUBJECT ASSIGNMENT

   Existing mobile School Admin functionality के लिए.
===================================================== */

export interface SubjectAssignment {
  _id:
    string;

  academicSessionId:
    | string
    | SubjectAssignmentRelation;

  classId:
    | string
    | SubjectAssignmentRelation;

  sectionId:
    | string
    | SubjectAssignmentRelation;

  subjectId:
    | string
    | SubjectAssignmentSubjectRelation;

  teacherId:
    | string
    | SubjectAssignmentTeacherRelation;

  status?:
    string;

  createdAt?:
    string;
}


/* =====================================================
   CREATE SUBJECT ASSIGNMENT PAYLOAD
===================================================== */

export interface CreateSubjectAssignmentPayload {
  academicSessionId:
    string;

  classId:
    string;

  sectionId:
    string;

  subjectId:
    string;

  teacherId:
    string;
}