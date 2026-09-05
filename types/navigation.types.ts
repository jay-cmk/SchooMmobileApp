


// // ROOT NAVIGATION
// export type RootStackParamList = {
//   Splash: undefined;
//   Login: undefined;
//   StudentApp: undefined;
//   TeacherApp: undefined;
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
//   StudentTabs: undefined;
//   Timetable: undefined;
//   Exams: undefined;
//   Fees: undefined;

//   HomeworkDetail: {
//     homeworkId: string;
//   };
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



import type {
  NavigatorScreenParams,
} from "@react-navigation/native";

// ROOT NAVIGATION
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  StudentApp: undefined;
  TeacherApp: undefined;
  SchoolAdminApp: undefined;
};

// STUDENT BOTTOM TABS
export type StudentTabParamList = {
  Home: undefined;
  Subjects: undefined;
  Attendance: undefined;
  Homework: undefined;
  Profile: undefined;
};

// STUDENT STACK
export type StudentStackParamList = {
  StudentTabs:
    NavigatorScreenParams<StudentTabParamList>;

  Timetable: undefined;
  Exams: undefined;
  Fees: undefined;

  HomeworkDetail: {
    homeworkId: string;
  };

  VideoClass: undefined;
  LiveClass: undefined;
  Syllabus: undefined;
  EDocs: undefined;
  NoticeBoard: undefined;
  OnlineQuiz: undefined;
  QuizReport: undefined;
  ExamMarks: undefined;
  ProgressReport: undefined;
  Achievement: undefined;
  Calendar: undefined;
  ExamTimetable: undefined;
  GPSTracker: undefined;
  MediaGallery: undefined;
  SchoolProfile: undefined;
};

// TEACHER BOTTOM TABS
export type TeacherTabParamList = {
  Home: undefined;
  Classes: undefined;
  Attendance: undefined;
  Homework: undefined;
  Profile: undefined;
};

// TEACHER STACK
export type TeacherStackParamList = {
  TeacherTabs: undefined;

  Timetable: undefined;
  Subjects: undefined;
  Salary: undefined;
  CreateHomework: undefined;

  HomeworkReview: {
    homeworkId: string;
    sessionId: string;
    classId: string;
    sectionId: string;
    homeworkTitle?: string;
  };
};


export type SchoolAdminTabParamList = {
  Home: undefined;
  Students: undefined;
  Teachers: undefined;
  Academics: undefined;
  Profile: undefined;
};

export type SchoolAdminStackParamList = {
  SchoolAdminTabs: undefined;

  Attendance: undefined;
  SubjectAssignment: undefined;
  Timetable: undefined;
  Homework: undefined;

  Sessions: undefined;
  Classes: undefined;
  Sections: undefined;
  Subjects: undefined;
};

export interface SubjectAssignment {
  _id: string;

  academicSessionId:
    | string
    | {
        _id: string;
        name?: string;
      };

  classId:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId:
    | string
    | {
        _id: string;
        name?: string;
      };

  subjectId:
    | string
    | {
        _id: string;
        name?: string;
        code?: string;
      };

  teacherId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };

  status?: string;

  createdAt?: string;
}

export interface CreateSubjectAssignmentPayload {
  academicSessionId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
}