import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PERMISSIONS } from "../constant";


export type Permission = keyof typeof PERMISSIONS;
type Permissions = string[];

type PermissionType = {
  isLoading: boolean;
  isAllowed: (
    requiredPermissions: Permission | Permission[],
    anyOne?: boolean
  ) => boolean;
  getIfExists: (requiredPermissions: Permission | Permission[]) => Permission[];
  refresh: () => void;
};

const PermissionContext = createContext<PermissionType>({
  isLoading: true,
  isAllowed: () => false,
  refresh: () => {},
  getIfExists: () => [],
});

const usePermission = () => useContext(PermissionContext);

export const PermissionProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [permission, setPermission] = useState<Permissions>([]);

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
      isLoading: false, // since we're not fetching anymore
      isAllowed,
      getIfExists,
      refresh: () => {}, // no need to refresh anymore
    }),
    [isAllowed, getIfExists]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export default usePermission;
