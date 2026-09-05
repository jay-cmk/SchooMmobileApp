/* =====================================================
   COMMON RELATION TYPES
===================================================== */

export interface BasicRelation {
  _id: string;
  name?: string;
}


/* =====================================================
   STUDENT
===================================================== */

export interface SchoolAdminStudent {
  _id: string;

  name: string;

  admissionNumber?: string;

  rollNumber?: number;

  email?: string;

  mobile?: string;

  gender?: string;

  status?: string;

  classId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  sessionId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  createdAt?: string;
}


/* =====================================================
   TEACHER
===================================================== */

export interface SchoolAdminTeacher {
  _id: string;

  name: string;

  employeeId?: string;

  email?: string;

  mobile?: string;

  gender?: string;

  qualification?: string;

  status?: string;

  isActive?: boolean;

  createdAt?: string;
}


/* =====================================================
   ACADEMIC SESSION
===================================================== */

export interface AcademicSession {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;

  status?: string;
}


/* =====================================================
   ACADEMIC CLASS
===================================================== */

export interface AcademicClass {
  _id: string;

  name: string;

  academicSessionId?:
    | string
    | AcademicSession;

  classTeacherId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  description?: string;

  status?: string;
}


/* =====================================================
   ACADEMIC SECTION
===================================================== */

export interface AcademicSection {
  _id: string;

  name: string;

  classId?:
    | string
    | AcademicClass;

  academicSessionId?:
    | string
    | AcademicSession;

  status?: string;
}


/* =====================================================
   ACADEMIC SUBJECT
===================================================== */

export interface AcademicSubject {
  _id: string;

  name: string;

  code?: string;

  description?: string;

  status?: string;
}


/* =====================================================
   HOMEWORK
===================================================== */

export interface SchoolAdminHomework {
  _id: string;

  title: string;

  description?: string;

  dueDate?: string;

  status?: string;

  subjectId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  classId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  teacherId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  createdAt?: string;
}


/* =====================================================
   ATTENDANCE
===================================================== */

export interface AttendanceRecord {
  _id?: string;

  date?: string;

  status?: string;

  studentId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  classId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId?:
    | string
    | {
        _id: string;
        name?: string;
      };
}


/* =====================================================
   SUBJECT ASSIGNMENT
===================================================== */

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

  updatedAt?: string;
}


/* =====================================================
   CREATE SUBJECT ASSIGNMENT PAYLOAD
===================================================== */

export interface CreateSubjectAssignmentPayload {
  academicSessionId: string;

  classId: string;

  sectionId: string;

  subjectId: string;

  teacherId: string;
}


/* =====================================================
   SCHOOL ADMIN DASHBOARD
===================================================== */

export interface SchoolAdminDashboardData {
  students: SchoolAdminStudent[];

  teachers: SchoolAdminTeacher[];

  sessions: AcademicSession[];

  classes: AcademicClass[];

  sections: AcademicSection[];

  subjects: AcademicSubject[];

  homework: SchoolAdminHomework[];
}