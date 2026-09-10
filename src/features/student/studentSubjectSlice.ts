import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";




import { getMySubjectsApi, MySubjectsEnrollment, MySubjectsStudent, StudentSubjectItem } from "./studentSubject.api";


/* =====================================================
   STUDENT SUBJECT STATE
===================================================== */

interface StudentSubjectState {
  student:
    MySubjectsStudent | null;

  enrollment:
    MySubjectsEnrollment | null;

  subjects:
    StudentSubjectItem[];

  loading: boolean;

  error: string | null;

  initialized: boolean;
}


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState:
  StudentSubjectState = {
    student: null,

    enrollment: null,

    subjects: [],

    loading: false,

    error: null,

    initialized: false,
  };


/* =====================================================
   GET MY SUBJECTS

   GET /api/v1/academic/subjects/me

   Backend normal class subjects और individually
   assigned elective subjects दोनों return करेगा.
===================================================== */

export const getMySubjects =
  createAsyncThunk(
    "studentSubjects/getMySubjects",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getMySubjectsApi();
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data
            ?.message ??
            error?.message ??
            "Failed to fetch subjects"
        );
      }
    }
  );


/* =====================================================
   STUDENT SUBJECT SLICE
===================================================== */

const studentSubjectSlice =
  createSlice({
    name:
      "studentSubjects",

    initialState,

    reducers: {
      /* =============================================
         CLEAR ERROR
      ============================================= */

      clearStudentSubjectError:
        (state) => {
          state.error = null;
        },


      /* =============================================
         CLEAR SUBJECT DATA
      ============================================= */

      clearStudentSubjects:
        (state) => {
          state.student = null;

          state.enrollment = null;

          state.subjects = [];

          state.loading = false;

          state.error = null;

          state.initialized = false;
        },
    },

    extraReducers:
      (builder) => {
        builder

          /* =========================================
             GET MY SUBJECTS
          ========================================= */

          .addCase(
            getMySubjects.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            getMySubjects.fulfilled,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.error = null;

              state.student =
                action.payload.student;

              state.enrollment =
                action.payload
                  .enrollment;

              state.subjects =
                Array.isArray(
                  action.payload.subjects
                )
                  ? action.payload
                      .subjects
                  : [];

              state.initialized = true;
            }
          )

          .addCase(
            getMySubjects.rejected,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.student = null;

              state.enrollment = null;

              state.subjects = [];

              state.error =
                (action.payload as string) ??
                "Failed to fetch subjects";

              state.initialized = true;
            }
          );
      },
  });


/* =====================================================
   EXPORT ACTIONS
===================================================== */

export const {
  clearStudentSubjectError,
  clearStudentSubjects,
} =
  studentSubjectSlice.actions;


/* =====================================================
   EXPORT REDUCER
===================================================== */

export default
  studentSubjectSlice.reducer;