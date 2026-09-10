


// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import { loginApi } from "./auth.api";

// import {
//   clearAuth,
//   getAccessToken,
//   getStoredUser,
//   saveAuth,
// } from "../../storage/authStorage";

// import type {
//   AuthUser,
//   LoginPayload,
// } from "types/auth.types";

// interface AuthState {
//   user: AuthUser | null;
//   accessToken: string | null;
//   loading: boolean;
//   error: string | null;
//   authInitialized: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   loading: false,
//   error: null,
//   authInitialized: false,
// };

// /* =====================================================
//    LOGIN
// ===================================================== */

// export const login = createAsyncThunk(
//   "auth/login",
//   async (data: LoginPayload, { rejectWithValue }) => {
//     try {
//       const result = await loginApi(data);

//       await saveAuth(result.accessToken, result.user);

//       return result;
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message ?? "Login failed",
//       );
//     }
//   },
// );

// /* =====================================================
//    RESTORE AUTH
// ===================================================== */

// export const restoreAuth = createAsyncThunk(
//   "auth/restoreAuth",
//   async (_, { rejectWithValue }) => {
//     try {
//       const [accessToken, user] = await Promise.all([
//         getAccessToken(),
//         getStoredUser(),
//       ]);

//       if (!accessToken || !user) {
//         await clearAuth();

//         return {
//           accessToken: null,
//           user: null,
//         };
//       }

//       return {
//         accessToken,
//         user,
//       };
//     } catch (error: any) {
//       await clearAuth();

//       return rejectWithValue(
//         error?.message ?? "Failed to restore login",
//       );
//     }
//   },
// );

// /* =====================================================
//    LOGOUT
// ===================================================== */

// export const logout = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await clearAuth();
//       return true;
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.message ?? "Logout failed",
//       );
//     }
//   },
// );

// /* =====================================================
//    AUTH SLICE
// ===================================================== */

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     clearAuthError: (state) => {
//       state.error = null;
//     },

//     /*
//      * Axios interceptor ise 401 par trigger karega.
//      * Storage interceptor me clear ho chuka hoga;
//      * yahan Redux auth state immediately clear hogi.
//      */
//     sessionExpired: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       state.loading = false;
//       state.error = null;
//       state.authInitialized = true;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//         state.authInitialized = true;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           (action.payload as string) ?? "Login failed";
//         state.authInitialized = true;
//       })

//       .addCase(restoreAuth.pending, (state) => {
//         state.authInitialized = false;
//       })
//       .addCase(restoreAuth.fulfilled, (state, action) => {
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//         state.loading = false;
//         state.error = null;
//         state.authInitialized = true;
//       })
//       .addCase(restoreAuth.rejected, (state, action) => {
//         state.user = null;
//         state.accessToken = null;
//         state.loading = false;
//         state.error = (action.payload as string) ?? null;
//         state.authInitialized = true;
//       })

//       .addCase(logout.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.accessToken = null;
//         state.loading = false;
//         state.error = null;
//         state.authInitialized = true;
//       })
//       .addCase(logout.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           (action.payload as string) ?? "Logout failed";
//       });
//   },
// });

// export const {
//   clearAuthError,
//   sessionExpired,
// } = authSlice.actions;

// export default authSlice.reducer;



import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  loginApi,
} from "./auth.api";

import {
  clearAuth,
  getAccessToken,
  getStoredUser,
  saveAuth,
} from "../../storage/authStorage";

import {
  deactivateDeviceTokenApi,
} from "../notifications/notification.api";

import {
  getNotificationDeviceId,
} from "../../services/expoNotification.service";

import {
  disconnectSocket,
} from "../../services/socket.service";

import type {
  AuthUser,
  LoginPayload,
} from "types/auth.types";


/* =====================================================
   AUTH STATE
===================================================== */

interface AuthState {
  user:
    AuthUser | null;

  accessToken:
    string | null;

  loading:
    boolean;

  error:
    string | null;

  authInitialized:
    boolean;
}


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState:
  AuthState = {
    user:
      null,

    accessToken:
      null,

    loading:
      false,

    error:
      null,

    authInitialized:
      false,
  };


/* =====================================================
   LOGIN
===================================================== */

export const login =
  createAsyncThunk(
    "auth/login",

    async (
      data:
        LoginPayload,

      {
        rejectWithValue,
      }
    ) => {
      try {
        const result =
          await loginApi(
            data
          );

        await saveAuth(
          result.accessToken,
          result.user
        );

        return result;
      } catch (
        error: any
      ) {
        return rejectWithValue(
          error?.response
            ?.data
            ?.message ??
            error?.message ??
            "Login failed"
        );
      }
    }
  );


/* =====================================================
   RESTORE AUTH
===================================================== */

export const restoreAuth =
  createAsyncThunk(
    "auth/restoreAuth",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const [
          accessToken,
          user,
        ] =
          await Promise.all([
            getAccessToken(),
            getStoredUser(),
          ]);

        if (
          !accessToken ||
          !user
        ) {
          await clearAuth();

          return {
            accessToken:
              null,

            user:
              null,
          };
        }

        return {
          accessToken,
          user,
        };
      } catch (
        error: any
      ) {
        await clearAuth();

        return rejectWithValue(
          error?.message ??
            "Failed to restore login"
        );
      }
    }
  );


/* =====================================================
   LOGOUT

   Correct order:

   1. Existing JWT available है
   2. Backend device token deactivate
   3. Socket disconnect
   4. Secure storage clear
   5. Redux state clear
===================================================== */

export const logout =
  createAsyncThunk(
    "auth/logout",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const accessToken =
          await getAccessToken();

        /*
         * Device-token API protected है, इसलिए इसे
         * access token clear करने से पहले call करें.
         */
        if (
          accessToken
        ) {
          try {
            const deviceId =
              await getNotificationDeviceId();

            await deactivateDeviceTokenApi(
              deviceId
            );
          } catch (
            notificationError
          ) {
            /*
             * Notification cleanup fail होने पर user
             * को logout होने से नहीं रोकना है.
             */
            console.log(
              "DEVICE TOKEN DEACTIVATION ERROR:",
              notificationError
            );
          }
        }

        /*
         * Socket connection immediately close करें.
         */
        disconnectSocket();

        /*
         * इसके बाद local authentication हटाएं.
         */
        await clearAuth();

        return true;
      } catch (
        error: any
      ) {
        /*
         * Unexpected error में भी socket बंद करने और
         * local token हटाने का प्रयास करें.
         */
        disconnectSocket();

        try {
          await clearAuth();
        } catch (
          storageError
        ) {
          console.log(
            "AUTH STORAGE CLEAR ERROR:",
            storageError
          );
        }

        return rejectWithValue(
          error?.message ??
            "Logout failed"
        );
      }
    }
  );


/* =====================================================
   AUTH SLICE
===================================================== */

const authSlice =
  createSlice({
    name:
      "auth",

    initialState,

    reducers: {
      /* =============================================
         CLEAR ERROR
      ============================================= */

      clearAuthError: (
        state
      ) => {
        state.error =
          null;
      },


      /* =============================================
         SESSION EXPIRED

         Axios interceptor storage clear कर चुका होगा.
         Socket RootNavigator/useNotifications cleanup
         से disconnect होगी.
      ============================================= */

      sessionExpired: (
        state
      ) => {
        state.user =
          null;

        state.accessToken =
          null;

        state.loading =
          false;

        state.error =
          null;

        state.authInitialized =
          true;
      },
    },


    extraReducers: (
      builder
    ) => {
      builder

        /* =========================================
           LOGIN
        ========================================= */

        .addCase(
          login.pending,

          (
            state
          ) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          login.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              null;

            state.accessToken =
              action.payload
                .accessToken;

            state.user =
              action.payload
                .user;

            state.authInitialized =
              true;
          }
        )

        .addCase(
          login.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              (
                action.payload as
                  string
              ) ??
              "Login failed";

            state.authInitialized =
              true;
          }
        )


        /* =========================================
           RESTORE AUTH
        ========================================= */

        .addCase(
          restoreAuth.pending,

          (
            state
          ) => {
            state.authInitialized =
              false;
          }
        )

        .addCase(
          restoreAuth.fulfilled,

          (
            state,
            action
          ) => {
            state.accessToken =
              action.payload
                .accessToken;

            state.user =
              action.payload
                .user;

            state.loading =
              false;

            state.error =
              null;

            state.authInitialized =
              true;
          }
        )

        .addCase(
          restoreAuth.rejected,

          (
            state,
            action
          ) => {
            state.user =
              null;

            state.accessToken =
              null;

            state.loading =
              false;

            state.error =
              (
                action.payload as
                  string
              ) ??
              null;

            state.authInitialized =
              true;
          }
        )


        /* =========================================
           LOGOUT
        ========================================= */

        .addCase(
          logout.pending,

          (
            state
          ) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          logout.fulfilled,

          (
            state
          ) => {
            state.user =
              null;

            state.accessToken =
              null;

            state.loading =
              false;

            state.error =
              null;

            state.authInitialized =
              true;
          }
        )

        .addCase(
          logout.rejected,

          (
            state,
            action
          ) => {
            /*
             * Local auth cleanup attempt हो चुका है,
             * इसलिए failure में भी login state clear
             * रखनी है.
             */
            state.user =
              null;

            state.accessToken =
              null;

            state.loading =
              false;

            state.error =
              (
                action.payload as
                  string
              ) ??
              "Logout failed";

            state.authInitialized =
              true;
          }
        );
    },
  });


/* =====================================================
   ACTIONS
===================================================== */

export const {
  clearAuthError,
  sessionExpired,
} =
  authSlice.actions;


/* =====================================================
   REDUCER
===================================================== */

export default
  authSlice.reducer;