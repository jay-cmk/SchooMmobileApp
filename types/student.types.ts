



export type StudentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";

export interface StudentRelation {
  _id?: string;
  id?: string;
  name?: string;
}

export interface StudentAddress {
  addressLine?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface StudentParentDetails {
  name?: string;
  mobile?: string;
  aadhaarNumber?: string;
  occupation?: string;
}

export interface StudentProfile {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  admissionNumber?: string;
  admissionNo?: string;
  admissionId?: string;
  rollNumber?: string | number;
  rollNo?: string | number;
  profileImage?: string;
  avatar?: string;
  photo?: string;
  dob?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  admissionDate?: string;
  admissionType?: string;
  admissionCategory?: string;
  religion?: string;
  category?: string;
  caste?: string;
  aadhaarNumber?: string;
  apaarId?: string;
  

penNumber?: string;

stream?:
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";
  status?: string;
  schoolId?: StudentRelation | string;
  sessionId?: StudentRelation | string;
  classId?: StudentRelation | string;
  sectionId?: StudentRelation | string;
  class?: StudentRelation | string;
  section?: StudentRelation | string;
  session?: StudentRelation | string;
  father?: StudentParentDetails;
  mother?: StudentParentDetails;
  address?: StudentAddress;
  currentAddress?: StudentAddress;
  permanentAddress?: StudentAddress;
}

export interface StudentSubject {
  _id?: string;
  subjectId?: {
    _id?: string;
    name?: string;
    code?: string;
  };
  subject?: {
    _id?: string;
    name?: string;
    code?: string;
  };
  teacherId?: {
    _id?: string;
    name?: string;
  };
  teacher?: {
    _id?: string;
    name?: string;
  };
  weeklyPeriods?: number;
}

export interface AttendanceRecord {
  _id?: string;
  date?: string;
  status?:
    | "PRESENT"
    | "ABSENT"
    | "LEAVE"
    | "HALF_DAY"
    | string;
  subjectId?: {
    _id?: string;
    name?: string;
  };
  subject?: {
    _id?: string;
    name?: string;
  };
}

export interface TimetableEntry {
  _id?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  period?: number;
  periodNumber?: number;
  room?: string;
  subjectId?: {
    _id?: string;
    name?: string;
  };
  subject?: {
    _id?: string;
    name?: string;
  };
  teacherId?: {
    _id?: string;
    name?: string;
  };
  teacher?: {
    _id?: string;
    name?: string;
  };
}

export interface HomeworkItem {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  submissionStatus?: string;
  subjectId?: {
    _id?: string;
    name?: string;
  };
  subject?: {
    _id?: string;
    name?: string;
  };
  teacherId?: {
    _id?: string;
    name?: string;
  };
  teacher?: {
    _id?: string;
    name?: string;
  };
}
