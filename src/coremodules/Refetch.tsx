import { useEffect, useState } from "react";

import { IoSyncOutline } from "react-icons/io5";
import Ping from "./Ping";

type Props = {
  refetch?: () => Promise<any>;
  isFetching?: boolean;
  isError?: boolean;
  className?: string;
  size?: number;
};

const Refetch: React.FC<Props> = ({
  refetch,
  size = 24,
  isFetching,
  isError,
  className = "",
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!refetch) return;
    typeof isError === "undefined" && setError(false);
    typeof isFetching === "undefined" && setIsLoading(true);
    try {
      await refetch();
    } catch (error) {
      typeof isError === "undefined" && setError(true);
    } finally {
      typeof isFetching === "undefined" && setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(!!isFetching);
  }, [isFetching]);

  return (
    <button
      className={`transition ${isFetching ? "text-primary" : ""} ${
        !isFetching && !(typeof isError === "undefined" ? error : isError)
          ? "text-gray-dark hover:text-primary"
          : ""
      } ${
        (typeof isError === "undefined" ? error : isError) ? "text-rose" : ""
      } relative ${className}`}
      onClick={onClick}
      disabled={typeof isFetching === "undefined" ? isLoading : isFetching}
      type="button"
    >
      <IoSyncOutline
        className={`transition ${
          isLoading ? "transition duration-[1000ms] rotate-180 " : undefined
        }`}
        size={size}
      />
      <Ping
        isLoading={typeof isFetching === "undefined" ? isLoading : isFetching}
      />
    </button>
  );
};

export default Refetch;
