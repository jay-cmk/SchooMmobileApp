import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId?: string;
  studentId?: string;
  teacherId?: string;
}

export const saveAccessToken = async (
  token: string
): Promise<void> => {
  await SecureStore.setItemAsync(
    ACCESS_TOKEN_KEY,
    token
  );
};

export const getAccessToken = async (): Promise<
  string | null
> => {
  return await SecureStore.getItemAsync(
    ACCESS_TOKEN_KEY
  );
};

export const saveUser = async (
  user: StoredUser
): Promise<void> => {
  await SecureStore.setItemAsync(
    USER_KEY,
    JSON.stringify(user)
  );
};

export const getUser = async (): Promise<
  StoredUser | null
> => {
  const user = await SecureStore.getItemAsync(
    USER_KEY
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as StoredUser;
  } catch {
    await SecureStore.deleteItemAsync(USER_KEY);
    return null;
  }
};

export const removeAccessToken =
  async (): Promise<void> => {
    await SecureStore.deleteItemAsync(
      ACCESS_TOKEN_KEY
    );
  };

export const removeUser =
  async (): Promise<void> => {
    await SecureStore.deleteItemAsync(USER_KEY);
  };

export const clearAuthStorage =
  async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  };

export const saveAuthData = async (
  token: string,
  user: StoredUser
): Promise<void> => {
  await Promise.all([
    saveAccessToken(token),
    saveUser(user),
  ]);
};