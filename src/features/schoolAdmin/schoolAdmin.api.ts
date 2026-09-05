import api from "../../api/axios";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
  AcademicSubject,
  CreateSubjectAssignmentPayload,
  SchoolAdminDashboardData,
  SchoolAdminHomework,
  SchoolAdminStudent,
  SchoolAdminTeacher,
  SubjectAssignment,
} from "types/schoolAdmin.types";

export interface GetSchoolAttendanceParams {
  academicSessionId: string;
  classId: string;
  sectionId: string;
  date: string;
}

export interface GetSchoolTimetableParams {
  academicSessionId: string;
  classId: string;
  sectionId: string;
}

/* =====================================================
   HELPERS
===================================================== */

const getApiData = (
  response: any
) => {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
};


const getArray = <T>(
  data: any,
  keys: string[]
): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  for (const key of keys) {
    if (
      Array.isArray(
        data?.[key]
      )
    ) {
      return data[key] as T[];
    }
  }

  return [];
};


/* =====================================================
   STUDENTS
===================================================== */

export const getSchoolStudentsApi =
  async (): Promise<
    SchoolAdminStudent[]
  > => {
    const response =
      await api.get(
        "/students"
      );

    const data =
      getApiData(response);

    return getArray<
      SchoolAdminStudent
    >(
      data,
      [
        "students",
        "student",
      ]
    );
  };


/* =====================================================
   TEACHERS
===================================================== */

export const getSchoolTeachersApi =
  async (): Promise<
    SchoolAdminTeacher[]
  > => {
    const response =
      await api.get(
        "/teachers"
      );

    const data =
      getApiData(response);

    return getArray<
      SchoolAdminTeacher
    >(
      data,
      [
        "teachers",
        "teacher",
      ]
    );
  };


/* =====================================================
   ACADEMIC SESSIONS
===================================================== */

export const getAcademicSessionsApi =
  async (): Promise<
    AcademicSession[]
  > => {
    const response =
      await api.get(
        "/academic/sessions"
      );

    const data =
      getApiData(response);

    return getArray<
      AcademicSession
    >(
      data,
      [
        "sessions",
        "academicSessions",
      ]
    );
  };


/* =====================================================
   CLASSES
===================================================== */

export const getAcademicClassesApi =
  async (): Promise<
    AcademicClass[]
  > => {
    const response =
      await api.get(
        "/academic/classes"
      );

    const data =
      getApiData(response);

    return getArray<
      AcademicClass
    >(
      data,
      [
        "classes",
        "classList",
      ]
    );
  };


/* =====================================================
   SECTIONS
===================================================== */

export const getAcademicSectionsApi =
  async (): Promise<
    AcademicSection[]
  > => {
    const response =
      await api.get(
        "/academic/sections"
      );

    const data =
      getApiData(response);

    return getArray<
      AcademicSection
    >(
      data,
      [
        "sections",
        "sectionList",
      ]
    );
  };


/* =====================================================
   SUBJECTS
===================================================== */

export const getAcademicSubjectsApi =
  async (): Promise<
    AcademicSubject[]
  > => {
    const response =
      await api.get(
        "/academic/subjects"
      );

    const data =
      getApiData(response);

    return getArray<
      AcademicSubject
    >(
      data,
      [
        "subjects",
        "subjectList",
      ]
    );
  };


/* =====================================================
   HOMEWORK
===================================================== */

export const getSchoolHomeworkApi =
  async (): Promise<
    SchoolAdminHomework[]
  > => {
    const response =
      await api.get(
        "/homework"
      );

    const data =
      getApiData(response);

    return getArray<
      SchoolAdminHomework
    >(
      data,
      [
        "homework",
        "homeworks",
        "assignments",
      ]
    );
  };


/* =====================================================
   SUBJECT ASSIGNMENTS
===================================================== */

export const getSubjectAssignmentsApi =
  async (): Promise<
    SubjectAssignment[]
  > => {
    const response =
      await api.get(
        "/academic/subject-assignments"
      );

    const data =
      getApiData(response);

    return getArray<
      SubjectAssignment
    >(
      data,
      [
        "assignments",
        "subjectAssignments",
      ]
    );
  };


/* =====================================================
   CREATE SUBJECT ASSIGNMENT
===================================================== */

export const createSubjectAssignmentApi =
  async (
    payload:
      CreateSubjectAssignmentPayload
  ): Promise<
    SubjectAssignment
  > => {
    const response =
      await api.post(
        "/academic/subject-assignments",
        payload
      );

    const data =
      getApiData(response);

    return (
      data?.assignment ??
      data?.subjectAssignment ??
      data
    ) as SubjectAssignment;
  };


/* =====================================================
   DASHBOARD
===================================================== */

export const getSchoolAdminDashboardApi =
  async (): Promise<
    SchoolAdminDashboardData
  > => {
    /*
     * Promise.allSettled use kar rahe hain.
     *
     * Isse agar ek API fail hoti hai,
     * to poora dashboard crash nahi hoga.
     */

    const results =
      await Promise.allSettled([
        getSchoolStudentsApi(),
        getSchoolTeachersApi(),
        getAcademicSessionsApi(),
        getAcademicClassesApi(),
        getAcademicSectionsApi(),
        getAcademicSubjectsApi(),
        getSchoolHomeworkApi(),
      ]);


    const [
      studentsResult,
      teachersResult,
      sessionsResult,
      classesResult,
      sectionsResult,
      subjectsResult,
      homeworkResult,
    ] = results;


    /* =================================================
       LOG FAILED APIs
    ================================================= */

    const apiNames = [
      "STUDENTS",
      "TEACHERS",
      "SESSIONS",
      "CLASSES",
      "SECTIONS",
      "SUBJECTS",
      "HOMEWORK",
    ];


    results.forEach(
      (
        result,
        index
      ) => {
        if (
          result.status ===
          "rejected"
        ) {
          console.log(
            `SCHOOL ADMIN ${apiNames[index]} ERROR:`,
            result.reason
              ?.response
              ?.data ??
              result.reason
                ?.message ??
              result.reason
          );
        }
      }
    );


    /* =================================================
       RETURN REAL API DATA
    ================================================= */

    return {
      students:
        studentsResult.status ===
        "fulfilled"
          ? studentsResult.value
          : [],

      teachers:
        teachersResult.status ===
        "fulfilled"
          ? teachersResult.value
          : [],

      sessions:
        sessionsResult.status ===
        "fulfilled"
          ? sessionsResult.value
          : [],

      classes:
        classesResult.status ===
        "fulfilled"
          ? classesResult.value
          : [],

      sections:
        sectionsResult.status ===
        "fulfilled"
          ? sectionsResult.value
          : [],

      subjects:
        subjectsResult.status ===
        "fulfilled"
          ? subjectsResult.value
          : [],

      homework:
        homeworkResult.status ===
        "fulfilled"
          ? homeworkResult.value
          : [],
    };
  };

  export const getSchoolAttendanceApi =
  async (
    params: GetSchoolAttendanceParams
  ) => {
    const response =
      await api.get(
        "/attendance",
        {
          params: {
            academicSessionId:
              params.academicSessionId,

            classId:
              params.classId,

            sectionId:
              params.sectionId,

            date:
              params.date,
          },
        }
      );

    return getApiData(response);
  };

  /* =====================================================
   TIMETABLE
===================================================== */




export const getSchoolTimetableApi =
  async (
    params: GetSchoolTimetableParams
  ) => {
    const response =
      await api.get(
        "/timetable",
        {
          params: {
            academicSessionId:
              params.academicSessionId,

            classId:
              params.classId,

            sectionId:
              params.sectionId,
          },
        }
      );

    return getApiData(response);
  };