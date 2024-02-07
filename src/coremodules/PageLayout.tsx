import BreadcrumbTrail from "./BreadcrumbTrail";
import { FullscreenInnerLayoutButton } from "./InnerLayout";
import Refetch from "./Refetch";

type Props = {
  request?: {
    isFetching: boolean;
    isError: boolean;
    refetch: () => Promise<any>;
  };
  extras?: string;
  refetch?: () => Promise<any>;
  hideLayout?: boolean;
  IconButtons?: React.ReactNode;
} & React.PropsWithChildren;

const PageLayout: React.FC<Props> = ({
  request,
  extras,
  refetch,
  hideLayout,
  children,
  IconButtons,
}) => {
  return (
    <>
      {!hideLayout && (
        <>
          <div className="flex items-center m-2 md:m-4 justify-between">
            <BreadcrumbTrail extras={extras} />
            <div className="flex gap-x-4 text-gray-dark">
              {IconButtons}
              {!!request && (
                <Refetch
                  isFetching={request.isFetching}
                  refetch={request.refetch}
                  isError={request.isError}
                />
              )}
              {!!refetch && <Refetch refetch={refetch} />}
              <FullscreenInnerLayoutButton className="transition hover:text-primary" />
            </div>
          </div>
          <hr className="text-gray-lightest" />
        </>
      )}
      {children}
    </>
  );
};

export default PageLayout;
