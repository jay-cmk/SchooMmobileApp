// import {
//   configureStore,
// } from "@reduxjs/toolkit";

// import authReducer from "../features/auth/auth.slice";

// import studentSubjectReducer
//   from "../features/student/studentSubjectSlice";
// import teacherAttendanceReducer from
//   "../features/teacher/teacherAttendance.slice";  
  

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     studentSubjects:
//   studentSubjectReducer,
//   teacherAttendance:
//   teacherAttendanceReducer,
//   },
// });

// export type RootState =
//   ReturnType<typeof store.getState>;

// export type AppDispatch =
//   typeof store.dispatch;


import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer
  from "../features/auth/auth.slice";

import studentSubjectReducer
  from "../features/student/studentSubjectSlice";

import teacherAttendanceReducer
  from "../features/teacher/teacherAttendance.slice";

import notificationReducer
  from "../features/notifications/notification.slice";  


export const store = configureStore({
  reducer: {
    auth: authReducer,

    studentSubjects:
      studentSubjectReducer,

    teacherAttendance:
      teacherAttendanceReducer,

    notifications:
  notificationReducer,   
  },
});


export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;