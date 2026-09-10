export const TeacherAttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LEAVE: "LEAVE",
  HALF_DAY: "HALF_DAY",
} as const;

export type TeacherAttendanceStatus =
  (typeof TeacherAttendanceStatus)[keyof typeof TeacherAttendanceStatus];

export interface MyAttendanceTeacher {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile?: string;
  gender?: string;
  qualification?: string;
  profileImage?: string;
  isActive?: boolean;
}

export interface MyTeacherAttendanceRecord {
  _id: string;
  schoolId: string;
  teacherId: string | MyAttendanceTeacher;
  date: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  markedBy?: string | {
    _id: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MyTeacherAttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  attendancePercentage: number;
}

export interface MyTeacherAttendanceData {
  teacher: MyAttendanceTeacher;
  month: number;
  year: number;
  summary: MyTeacherAttendanceSummary;
  attendance: MyTeacherAttendanceRecord[];
}

export interface GetMyTeacherAttendanceParams {
  month?: number;
  year?: number;
}

export interface MyTeacherAttendanceResponse {
  success: boolean;
  message: string;
  data: MyTeacherAttendanceData;
}

export interface TeacherAttendanceState {
  myAttendance: MyTeacherAttendanceData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}
