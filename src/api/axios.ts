// import axios from "axios";

// import {
//   clearAuthStorage,
//   getAccessToken,
// } from "../storage/authStorage";

// const API_URL =
//   process.env.EXPO_PUBLIC_API_URL ??
//   "http://10.52.122.182:5000/api/v1";

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await getAccessToken();

//     if (token) {
//       config.headers.Authorization =
//         `Bearer ${token}`;
//     }

//     return config;
//   },
//   async (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     if (error.response?.status === 401) {
//       await clearAuthStorage();
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;







import axios from "axios";

import {
  clearAuthStorage,
  getAccessToken,
} from "../storage/authStorage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "http://10.52.122.182:5000/api/v1";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let isHandlingUnauthorized = false;

/* =====================================================
   REGISTER GLOBAL UNAUTHORIZED HANDLER

   RootNavigator yahan callback register karega.
   Isse axios ko Redux store directly import nahi karna
   padega aur circular dependency nahi banegi.
===================================================== */

export const setUnauthorizedHandler = (
  handler: UnauthorizedHandler | null,
) => {
  unauthorizedHandler = handler;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   REQUEST INTERCEPTOR
===================================================== */

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =====================================================
   RESPONSE INTERCEPTOR

   Kisi bhi protected API par 401 aane par:
   1. Secure auth storage clear hoga.
   2. Registered Redux handler run hoga.
   3. RootNavigator Login screen show karega.

   Login API ka 401 exclude hai, kyunki wrong email/
   password session-expiry nahi hota.
===================================================== */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/auth/login");

    if (
      status === 401 &&
      !isLoginRequest &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      try {
        await clearAuthStorage();
      } catch (storageError) {
        console.log("AUTH STORAGE CLEAR ERROR:", storageError);
      } finally {
        unauthorizedHandler?.();
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
