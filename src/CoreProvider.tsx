import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { FetchProvider } from "./hooks/useFetch";
import { PredefinedProvider } from "./hooks/usePredefined";
import { SessionProvider } from "./hooks/useSession";
import "react-toastify/dist/ReactToastify.css";
import { PermissionProvider } from "./hooks/usePermission";
import util from "./hooks/util";
import AlertContainer from "./coremodules/AlertContainer";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: util.toastError("Error"),
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: util.toastError("Error"),
      onSuccess: util.toastSuccess("Success"),
    },
  },
});

const CoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <FetchProvider>
        <PermissionProvider>
          <PredefinedProvider>
            {children}
            <ToastContainer
              position="top-right"
              theme="dark"
              hideProgressBar
              limit={3}
            />
            <AlertContainer />
          </PredefinedProvider>
        </PermissionProvider>
      </FetchProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default CoreProvider;
