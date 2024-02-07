import { useMutation } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import util from "../../../hooks/util";

export const useCallsPerformanceForm = () => {
  const fetch = useFetch();

  return useMutation<EmptyResponse, string, FormData>({
    mutationFn: async (form) => {
      const response = await fetch(`/leads/customer`, "POST", form, true);
      const result: EmptyResponse = await response.json();
      if (response.status !== 200) return util.handleError(result);
      return result;
    },
  });
};
