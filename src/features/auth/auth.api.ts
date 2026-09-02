import { LoginResponse ,LoginPayload } from "types/auth.types";
import api from "../../api/axios";



export const loginApi = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data.data;
};