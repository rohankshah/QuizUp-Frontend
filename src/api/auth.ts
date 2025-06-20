import { apiUrls } from "../constants/apiUrls";
import { apiClient, apiClientProtected } from "../utils/apiClient";

export interface LoginPayload {
  username: string;
  password: string;
}

export const useLoginUser = async (data: LoginPayload) => {
  const response = await apiClient.post(apiUrls.login, data);
  return response.data;
};

export const useGetProfile = async () => {
  const response = await apiClientProtected.get(apiUrls.getProfile);
  return response.data;
};
