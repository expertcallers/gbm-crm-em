import { useMutation } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import util from "../../../hooks/util";

export const useLeadForm = () => {
  const fetch = useFetch();

  return useMutation<EmptyResponse, string, FormData>({
    mutationFn: async (form) => {
      const response = await fetch(`/leads/lead`, "POST", form, true);
      const result: EmptyResponse = await response.json();
      if (response.status !== 200) return util.handleError(result);
      return result;
    },
  });
};
