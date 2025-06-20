import { useQuery } from "@tanstack/react-query";
import { fetchQuizCategories } from "../api/game";

export const useQuizCategories = () => {
  return useQuery({
    queryKey: ["quizCategories"],
    queryFn: fetchQuizCategories,
  });
};
