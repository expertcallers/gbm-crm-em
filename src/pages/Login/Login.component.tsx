import React, { useState } from "react";
import Logo from "../../coremodules/Logo";
import Button from "../../coremodules/Button";
import LoadingBlock from "../../coremodules/LoadingBlock";

type Props = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  loading?: boolean;
  onForgotPassword?: () => void;
};

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  loading,
  error,
}: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 ">
      <div className="relative shadow-sm bg-black md:p-12 p-5 rounded-xl w-full max-w-md gap-8">
        <div>
          <div className="flex flex-col justify-center mb-2 max-w-xs">
            <Logo className="flex" />
          </div>
          <span className="flex border-b border-gray-light" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit && onSubmit(e);
          }}
          className="mt-8 space-y-6"
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="flex flex-col gap-2">
            <input
              id="login-form-empId"
              name="empId"
              type="text"
              autoComplete="empId"
              required
              className="relative block w-full rounded border border-gray-light p-2 outline-none sm:text-sm text-black"
              placeholder="Employee ID"
            />
            <input
              id="login-form-password"
              name="password"
              type="password"
              autoComplete="password"
              required
              className="relative block w-full rounded border border-gray-light p-2 outline-none sm:text-sm text-black"
              placeholder="Password"
            />
            {error && (
              <p className="text-sm text-white shadow-none border-none">
                {error}
              </p>
            )}
          </div>
          <Button
            type={"submit"}
            text={"Login"}
            className="w-full font-semibold"
            disabled={loading}
            rounded
          />
        </form>
        {loading && <LoadingBlock />}

        <span
          onClick={onForgotPassword}
          className="text-sm text-white underline float-right !mt-2 cursor-pointer"
        >
          Forgot password?
        </span>
      </div>
    </div>
  );
}
