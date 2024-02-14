import { useMutation } from "@tanstack/react-query";
import useFetch from "./useFetch";
import util from "./util";
import useSession from "./useSession";

export const useLogout = () => {
  const fetch = useFetch();
  const { storage } = useSession();

  const mutation = useMutation<LogoutResponse, string>({
    mutationFn: async () => {
     
      const response = await fetch(`/logout`);
      const result: LogoutResponse = await response.json();
      if (![200, 201,500].includes(response.status))
        return util.handleError(result);
      storage.clear();
      return result;
    },
  });

  return mutation;
};
