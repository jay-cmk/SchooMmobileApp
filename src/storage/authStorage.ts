



import * as SecureStore from "expo-secure-store";

import type {
  AuthUser,
} from "types/auth.types";

const ACCESS_TOKEN_KEY =
  "accessToken";

const USER_KEY =
  "user";

export const saveAuth =
  async (
    accessToken: string,
    user: AuthUser
  ) => {
    await Promise.all([
      SecureStore.setItemAsync(
        ACCESS_TOKEN_KEY,
        accessToken
      ),

      SecureStore.setItemAsync(
        USER_KEY,
        JSON.stringify(user)
      ),
    ]);
  };

export const getAccessToken =
  async () => {
    return SecureStore.getItemAsync(
      ACCESS_TOKEN_KEY
    );
  };

export const getStoredUser =
  async (): Promise<AuthUser | null> => {
    const value =
      await SecureStore.getItemAsync(
        USER_KEY
      );

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(
        value
      ) as AuthUser;
    } catch {
      await SecureStore.deleteItemAsync(
        USER_KEY
      );

      return null;
    }
  };

export const clearAuth =
  async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(
        ACCESS_TOKEN_KEY
      ),

      SecureStore.deleteItemAsync(
        USER_KEY
      ),
    ]);
  };