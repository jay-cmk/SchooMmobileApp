import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { loginApi } from "./auth.api";

import {
  clearAuthStorage,
  getAccessToken,
  getUser,
  saveAuthData,
} from "../../storage/authStorage";
import { LoginPayload ,AuthUser} from "types/auth.types";



interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;

  loading: boolean;
  initializing: boolean;

  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,

  loading: false,
  initializing: true,

  error: null,
};

export const login = createAsyncThunk(
  "auth/login",

  async (
    data: LoginPayload,
    { rejectWithValue }
  ) => {
    try {
      const result = await loginApi(data);

      await saveAuthData(
        result.accessToken,
        result.user
      );

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }
);

export const restoreAuth = createAsyncThunk(
  "auth/restoreAuth",

  async () => {
    const [accessToken, user] =
      await Promise.all([
        getAccessToken(),
        getUser(),
      ]);

    if (!accessToken || !user) {
      await clearAuthStorage();

      return {
        accessToken: null,
        user: null,
      };
    }

    return {
      accessToken,
      user: user as AuthUser,
    };
  }
);

export const logout = createAsyncThunk(
  "auth/logout",

  async () => {
    await clearAuthStorage();
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;

          state.accessToken =
            action.payload.accessToken;

          state.user = action.payload.user;

          state.error = null;
        }
      )

      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            (action.payload as string) ||
            "Login failed";
        }
      )

      // RESTORE AUTH
      .addCase(
        restoreAuth.pending,
        (state) => {
          state.initializing = true;
        }
      )

      .addCase(
        restoreAuth.fulfilled,
        (state, action) => {
          state.initializing = false;

          state.accessToken =
            action.payload.accessToken;

          state.user = action.payload.user;
        }
      )

      .addCase(
        restoreAuth.rejected,
        (state) => {
          state.initializing = false;
          state.accessToken = null;
          state.user = null;
        }
      )

      // LOGOUT
      .addCase(
        logout.fulfilled,
        (state) => {
          state.user = null;
          state.accessToken = null;
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const {
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;