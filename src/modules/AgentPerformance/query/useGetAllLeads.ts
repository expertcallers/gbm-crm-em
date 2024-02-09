import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import util from "../../../hooks/util";

export const useGetAllLeads = () => {
  const fetch = useFetch();
  const session = useSession();

  return {
    makeRequest,
    ...useQuery<GetAllAssetResponse, string>({

      placeholderData: keepPreviousData,
      queryKey: [
        "AgentPerformanceModule",
        "useGetAllLeads",
        session.user?.emp_id,
        
      ],
      queryFn: async () => makeRequest(fetch,'' ),
    }),
  };
};

const makeRequest = async (
  fetch: ReturnType<typeof useFetch>,
 query: string
) => {
  const response = await fetch(`/leads/customer`);
  const result: GetAllAssetResponse = await response.json();
  if (![200, 201,304].includes(response.status))return util.handleError(result);
  return result;
};
