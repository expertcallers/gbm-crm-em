import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import util from "../../../hooks/util";

export const useEditCustomerForm = () => {
  const fetch = useFetch();
  const queryClient = useQueryClient();
  return useMutation<
    EmptyResponse,
    string,
    { customer_id: number; formData: FormData }
  >({
    mutationFn: async ({ customer_id, formData }) => {
      const response = await fetch(
        `/leads/customer/${customer_id}`,
        "POST",
        formData,
        true
      );
      const result: EmptyResponse = await response.json();
      if (![200, 201].includes(response.status))
        return util.handleError(result);
      await queryClient.invalidateQueries({
        queryKey: ["AgentPerformanceModule", "useGetAllLeads"],
      });
      return result;
    },
  });
};



