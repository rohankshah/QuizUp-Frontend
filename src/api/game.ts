import { apiUrls } from "../constants/apiUrls";
import {  apiClientProtected } from "../utils/apiClient";

export const fetchQuizCategories  = async () => {
  const response = await apiClientProtected.get(apiUrls.quiz_categories);
  return response.data;
};
