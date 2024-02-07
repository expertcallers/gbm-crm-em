import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import useFetch from "./useFetch";
import useSession from "./useSession";
import { PERMISSIONS } from "../constant";
import util from "./util";

export type Permission = keyof typeof PERMISSIONS;
type ResponseWithError = {
  error?: string | undefined | null;
};

type Permissions = string[];

type PermissionType = {
  isLoading: boolean;
  isAllowed: (
    requiredPermissions: Permission | Permission[],
    anyOne?: boolean
  ) => boolean;
  getIfExists: (requiredPermissions: Permission | Permission[]) => Permission[];
  refresh: () => Promise<void>;
};

const PermissionContext = createContext<PermissionType>({
  isLoading: true,
  isAllowed: () => false,
  refresh: () => Promise.reject("Permissions not initialized."),
  getIfExists: () => [],
});

const usePermission = () => useContext(PermissionContext);

export const PermissionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const session = useSession();
  const fetch = useFetch();
  const [permission, setPermission] = useState<Permissions>([]);

  const query = useQuery<Permissions, string>({
    enabled: !!session.token,
    retry(failureCount, error) {
      if (error == "Invalid token.") return false;
      return failureCount < 3;
    },
    queryKey: ["usePermission", session.user?.emp_id],
    queryFn: async () => {
      const response = await fetch("/mapping/get_user_permissions");
      const result: ResponseWithError & { permissions: Permissions } =
        await response.json();
      if (![200, 201].includes(response.status))
        return util.handleError(result);
      setPermission((prev) =>
        equal(prev, result.permissions) ? prev : result.permissions
      );
      return result.permissions;
    },
  });

  useEffect(() => {
    if (!session.token) setPermission([]);
  }, [session.token]);

  const includes = useCallback((arr1: Permissions, arr2: any) => {
    if (Array.isArray(arr2)) return arr2.every((entry) => arr1.includes(entry));
    return arr1.includes(arr2);
  }, []);

  const isAllowed = useCallback(
    (permissions: Permission | Permission[], anyOne?: boolean) => {
      if (typeof permissions === "string")
        return includes(permission, PERMISSIONS[permissions]);
      if (permissions.length === 0) return true;
      if (anyOne)
        return !!permissions.find((p) => includes(permission, PERMISSIONS[p]));
      return permissions.every((p) => includes(permission, PERMISSIONS[p]));
    },
    [permission]
  );

  const getIfExists = useCallback(
    (permissions: Permission | Permission[]) => {
      const per = typeof permissions === "string" ? [permissions] : permissions;
      return per.filter((p) => includes(permission, PERMISSIONS[p]));
    },
    [permission]
  );

  const value = useMemo(
    () => ({
      isLoading: query.isPending,
      isAllowed,
      getIfExists,
      refresh: async () => {
        await query.refetch();
      },
    }),
    [query.isPending, isAllowed, getIfExists]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

function equal(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  arr1 = arr1.sort();
  arr2 = arr2.sort();
  for (let i = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false;
  return true;
}

export default usePermission;
