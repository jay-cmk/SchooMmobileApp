import api from "../../api/axios";

import type {
  GetMyTeacherAttendanceParams,
  MyTeacherAttendanceData,
  MyTeacherAttendanceResponse,
} from "./teacherAttendance.types";

export const getMyTeacherAttendanceApi = async (
  params?: GetMyTeacherAttendanceParams,
): Promise<MyTeacherAttendanceData> => {
  const queryParams: Record<string, number> = {};

  if (params?.month !== undefined) {
    queryParams.month = params.month;
  }

  if (params?.year !== undefined) {
    queryParams.year = params.year;
  }

  const response = await api.get<MyTeacherAttendanceResponse>(
    "/teacher-attendance/me",
    {
      params: queryParams,
    },
  );

  return response.data.data;
};
