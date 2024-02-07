import { useMutation } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import util from "../../../hooks/util";

export const useEmailPerformanceForm = () => {
  const fetch = useFetch();

  return useMutation<EmptyResponse, string, FormData>({
    mutationFn: async (form) => {
      const response = await fetch(`/leads/customer`, "POST", form, true);
      const result: EmptyResponse = await response.json();
      if (![200, 201].includes(response.status)) return util.handleError(result);
      return result;
    },
  });
};
