import React, { useEffect, useState } from "react";
import useForgotPassword from "./useForgotPassword";
import useCountdown from "./useCountdown";
import { useLocation } from "react-router-dom";
import OuterLayout from "../../coremodules/OuterLayout";
import { Form } from "../../coremodules/Form";
import Button from "../../coremodules/Button";

const ForgotPassword: React.FC = () => {
  const location = useLocation();

  const [title, setTitle] = useState("Forgot password");

  const { resetPassword, sendOTP, otpSent, loading, error } =
    useForgotPassword();

  const isResetPassword = location.state?.title;

  useEffect(() => {
    location.state?.title && setTitle(location.state.title);
  }, []);

  const onSubmit = async (e: any) => {
    if (!isResetPassword && !otpSent) return await sendOTP(e);
    await resetPassword(e);
  };

  return (
    <OuterLayout title={title} >
      <div className="flex flex-1 justify-center items-center">
        {!isResetPassword && (
          <Form.Wrapper
            title={title}
            submitText={otpSent ? "Reset password" : "Generate OTP"}
            className={`flex flex-1 w-full items-center justify-center my-10 m-2 max-w-md`}
            containerClassName={`md:p-12 p-5`}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            buttonWrapperClassName="flex gap-2 flex-col-reverse"
            Buttons={
              <ResendOTPButton
                loading={loading}
                sendOTP={sendOTP}
                otpSent={otpSent}
              />
            }
          >
            <Form.Input
              id="forgot-password-form-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="-"
              maxWidth48Percent={false}
              label="Email"
              pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$"
            />

            <Form.Input
              id="forgot-password-form-otp"
              name="email_otp"
              type="text"
              required
              placeholder="-"
              maxWidth48Percent={false}
              label="OTP"
              min={6}
              max={6}
              disabled={!otpSent}
            />

            <Form.Input
              id="forgot-password-form-new-password"
              name="password"
              type="password"
              required
              placeholder="-"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              maxWidth48Percent={false}
              label="New password"
              disabled={!otpSent}
            />
            <Form.Input
              id="forgot-password-form-confirm-password"
              type="password"
              name="confirm-password"
              required
              placeholder="-"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              maxWidth48Percent={false}
              label="Confirm new password"
              disabled={!otpSent}
            />
          </Form.Wrapper>
        )}

        {isResetPassword && (
          <Form.Wrapper
            title={title}
            submitText={"Reset password"}
            className={`flex flex-1 w-full items-center justify-center my-10 m-2 max-w-md`}
            containerClassName={`md:p-12 p-5`}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            buttonWrapperClassName="flex gap-2 flex-col-reverse"
            Buttons={
              <ResendOTPButton
                loading={loading}
                sendOTP={sendOTP}
                otpSent={otpSent}
              />
            }
          >
            <Form.Input
              id="forgot-password-form-email"
              name="emp_id"
              defaultValue={location.state?.empId}
              required
              readOnly
              placeholder="-"
              maxWidth48Percent={false}
              label="Employee ID"
              className="bg-slate-50 "
            />

            <Form.Input
              id="forgot-password-form-new-password"
              name="password"
              type="password"
              required
              placeholder="-"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              maxWidth48Percent={false}
              label="New password"
            />
            <Form.Input
              id="forgot-password-form-confirm-password"
              type="password"
              name="confirm-password"
              required
              placeholder="-"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              maxWidth48Percent={false}
              label="Confirm new password"
            />
          </Form.Wrapper>
        )}
      </div>
    </OuterLayout>
  );
};

type Props = {
  otpSent?: boolean;
  loading: boolean;
  sendOTP: () => Promise<any>;
};
const ResendOTPButton: React.FC<Props> = ({ otpSent, loading, sendOTP }) => {
  const countdown = useCountdown(30, 1000);

  const onResendOTP = async () => {
    await sendOTP();
    countdown.reset();
    countdown.start();
  };

  useEffect(() => {
    countdown.reset();
    countdown.start();
  }, [otpSent]);

  if (!otpSent) return null;
  return (
    <Button
      text={`Resend OTP (${countdown.timeRemaining}s)`}
      className="text-center"
      onClick={onResendOTP}
      disabled={loading || countdown.timeRemaining > 0}
      rounded
    />
  );
};

export default ForgotPassword;
