import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import useSession from "./useSession";
import util from "./util";
import { BASE_URL, PREDEFINED } from "../constant";
import LoadingBlock from "../coremodules/LoadingBlock";

type GetPredefinedResponse = {
  error?: string;
} & typeof PREDEFINED;

const PredefinedContext = createContext<typeof PREDEFINED>(PREDEFINED);

const usePredefined = () => useContext(PredefinedContext);

export const PredefinedProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<typeof PREDEFINED>(PREDEFINED);
  const session = useSession();

  const query = useQuery<GetPredefinedResponse, string>({
    queryKey: ["usePredefined", session.user?.emp_id],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/mapping/get_pre_defined`,
        session.token
          ? { headers: { Authorization: `Token ${session.token}` } }
          : {}
      );
      const result: GetPredefinedResponse = await response.json();
      if (response.status !== 200) return util.handleError(result);
      setState((PREDEFINED) => ({ ...PREDEFINED, ...result }));
      return result;
    },
  });

  const isLoading = !session.token ? false : query.isPending;

  const refetch = useCallback(() => query.refetch(), []);

  const value = useMemo(
    () => ({ ...state, refetch, isLoading }),
    [query.isPending, JSON.stringify(state), isLoading]
  );

  if (isLoading) return <LoadingBlock />;

  return (
    <PredefinedContext.Provider value={value}>
      {children}
    </PredefinedContext.Provider>
  );
};

export default usePredefined;
