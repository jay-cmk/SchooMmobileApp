import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  getMyTeacherAttendanceApi,
} from "./teacherAttendance.api";

import type {
  GetMyTeacherAttendanceParams,
  MyTeacherAttendanceData,
  TeacherAttendanceState,
} from "./teacherAttendance.types";

const initialState: TeacherAttendanceState = {
  myAttendance: null,
  loading: false,
  refreshing: false,
  error: null,
};

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return apiError.response?.data?.message ?? fallback;
  }

  return error instanceof Error
    ? error.message
    : fallback;
};

export const getMyTeacherAttendance = createAsyncThunk<
  MyTeacherAttendanceData,
  GetMyTeacherAttendanceParams | undefined,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/getMyAttendance",
  async (params, { rejectWithValue }) => {
    try {
      return await getMyTeacherAttendanceApi(params);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch your attendance.",
        ),
      );
    }
  },
);

const teacherAttendanceSlice = createSlice({
  name: "teacherAttendance",
  initialState,
  reducers: {
    clearTeacherAttendanceError: (state) => {
      state.error = null;
    },

    clearMyTeacherAttendance: (state) => {
      state.myAttendance = null;
      state.error = null;
    },

    setTeacherAttendanceRefreshing: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.refreshing = action.payload;
    },

    resetTeacherAttendanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTeacherAttendance.pending, (state) => {
        if (!state.refreshing) {
          state.loading = true;
        }

        state.error = null;
      })
      .addCase(
        getMyTeacherAttendance.fulfilled,
        (state, action) => {
          state.loading = false;
          state.refreshing = false;
          state.myAttendance = action.payload;
          state.error = null;
        },
      )
      .addCase(
        getMyTeacherAttendance.rejected,
        (state, action) => {
          state.loading = false;
          state.refreshing = false;
          state.error =
            action.payload ??
            "Failed to fetch your attendance.";
        },
      );
  },
});

export const {
  clearTeacherAttendanceError,
  clearMyTeacherAttendance,
  setTeacherAttendanceRefreshing,
  resetTeacherAttendanceState,
} = teacherAttendanceSlice.actions;

export default teacherAttendanceSlice.reducer;
