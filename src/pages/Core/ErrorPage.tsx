import React, { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import useFetch from "../../hooks/useFetch";


const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const fetch = useFetch();

  useEffect(() => {
    try {
      fetch("/gbm/error_log", "POST", JSON.stringify({ message: error }));
    } catch (error) {
      console.info("Failed to log exception.");
    }
    console.error(error);
  }, []);

  return (
    <div className="m-10 flex flex-col flex-1 justify-start items-center">
      <span className="rounded-xl bg-white p-4 shadow-sm">
        <p className="m-4 font-normal text-3xl text-red-700">Oops!</p>
        <p className="m-4 font-normal text-xl text-red-500">
          {" "}
          An unexpected error has occurred.
        </p>
        <button
          className="m-4 underline text-primary text-xl self-start cursor-pointer"
          onClick={() => navigate(-1)}
          type="button"
        >
          Back
        </button>
      </span>
    </div>
  );
};

export default ErrorPage;
