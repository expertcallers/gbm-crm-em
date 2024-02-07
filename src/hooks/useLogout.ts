import { useMutation } from "@tanstack/react-query";
import useFetch from "./useFetch";
import util from "./util";

export const useLogout = () => {
  const fetch = useFetch();

  const mutation = useMutation<LogoutResponse, string>({
    mutationFn: async () => {
      const response = await fetch(`/logout`);
      const result: LogoutResponse = await response.json();
      if (![200, 201].includes(response.status)) return util.handleError(result);
      return result;
    },
  });

  return mutation;
};
