import api from "../../api/axios";


export interface SubjectRelation {
  _id: string;

  name: string;

  code: string;

  subjectType:
    | "CORE"
    | "LANGUAGE"
    | "PRACTICAL"
    | "ELECTIVE";

  description?: string;
}


export interface SubjectTeacher {
  _id: string;

  name: string;

  employeeId?: string;

  email?: string;

  mobile?: string;

  profileImage?: string;
}


export interface StudentSubjectItem {
  assignmentId: string;

  studentSubjectEnrollmentId?: string;

  subject: SubjectRelation;

  teacher?: SubjectTeacher | null;

  weeklyPeriods?: number;

  enrollmentType:
    | "CLASS"
    | "ELECTIVE";
}


export interface StudentAcademicRelation {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;
}


export interface MySubjectsStudent {
  _id: string;

  name: string;

  admissionNumber: string;

  rollNumber?: number;

  sessionId:
    | string
    | StudentAcademicRelation;

  classId:
    | string
    | StudentAcademicRelation;

  sectionId:
    | string
    | StudentAcademicRelation;
}


export interface MySubjectsEnrollment {
  _id: string;

  rollNumber?: number;

  stream?:
    | "SCIENCE"
    | "COMMERCE"
    | "ARTS"
    | "VOCATIONAL";

  enrollmentStatus:
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

  promotionStatus:
    | "NOT_DECIDED"
    | "PROMOTED"
    | "RETAINED"
    | "TRANSFERRED"
    | "LEFT"
    | "GRADUATED";

  sessionId:
    | string
    | StudentAcademicRelation;

  classId:
    | string
    | StudentAcademicRelation;

  sectionId:
    | string
    | StudentAcademicRelation;
}


export interface MySubjectsData {
  student: MySubjectsStudent;

  enrollment: MySubjectsEnrollment;

  subjects: StudentSubjectItem[];
}


/* =====================================================
   GET LOGGED-IN STUDENT SUBJECTS

   Normal class subjects + individually assigned
   elective subjects दोनों इसी API से आएंगे.
===================================================== */

export const getMySubjectsApi =
  async (): Promise<MySubjectsData> => {
    const response =
      await api.get(
        "/academic/subjects/me"
      );

    const data =
      response.data?.data;

    if (
      !data ||
      !data.student ||
      !data.enrollment ||
      !Array.isArray(
        data.subjects
      )
    ) {
      throw new Error(
        "Invalid student subjects response"
      );
    }

    return data as MySubjectsData;
  };