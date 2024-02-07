import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import util from "../../../hooks/util";

export const useGetAllLeads = (query: string) => {
  const fetch = useFetch();
  const session = useSession();

  return {
    makeRequest,
    ...useQuery<GetAllAssetResponse, string>({
      enabled: !!query,
      placeholderData: keepPreviousData,
      queryKey: [
        "AssetManagementModule",
        "useGetAllAssets",
        session.user?.emp_id,
        query,
      ],
      queryFn: async () => makeRequest(fetch, query),
    }),
  };
};

const makeRequest = async (
  fetch: ReturnType<typeof useFetch>,
  query: string
) => {
  const response = await fetch(`/asset/get_all_assets?${query}`);
  const result: GetAllAssetResponse = await response.json();
  if (response.status !== 200) return util.handleError(result);
  return result;
};
