import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant";

type SendOTPResponse =
	{
		error?: string;
		message?: string;
	}


type VerifyOTPResponse =
	{
		error?: string;
		message?: string;
	}


const useForgotPassword = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [otpSent, setOtpSent] = useState(false);
	const [form, setForm] = useState<FormData | null>(null);

	const sendOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
		setError("");
		const data = e ? new FormData(e.currentTarget) : form;
		if (!data) return;

		const email = data.get('email') as string | null;
		setForm(data);

		if (!email) return;

		setLoading(true)
		try {
			toast.loading("Generating OTP...", {toastId: "forgot-password-send-otp", updateId: 1})
			const response = await fetch(`${BASE_URL}/mapping/send_email_otp_forgot_password`, {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: { 'content-type': 'application/json' }
			});
			const result: SendOTPResponse = await response.json();
			if (response.status !== 200) {
                toast.dismiss("forgot-password-send-otp");
                return setError(result?.error ? result.error : "Something went wrong.");
            }
			setOtpSent(true);
			toast.info("An OTP has been sent to your email. Please enter the OTP and reset your password.", {toastId: "forgot-password-send-otp", updateId: 2})
			return result
		}
		catch (e) {
            toast.dismiss("forgot-password-send-otp");
            setError("Something went wrong, try again later.");
        }
		finally { setLoading(false); }
	}

	const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		setError("");

		const data = new FormData(e.currentTarget);
		const email = data.get('email') as string | null;
		const emp_id = data.get('emp_id') as string | null;
		const email_otp = data.get('email_otp') as string | null;
		const password = data.get('password') as string | null;
		const confirmPassword = data.get('confirm-password') as string | null;
		setForm(data);

		// if (!email || !email_otp) return;
		if (password !== confirmPassword) return setError("Your passwords do not match!");

		setLoading(true)
		try {
			const response = await fetch(`${BASE_URL}/mapping/forgot_password`, {
				method: "POST",
				body: JSON.stringify({ emp_id, email, email_otp, password }),
				headers: { 'content-type': 'application/json' }
			});
			const result: VerifyOTPResponse = await response.json();
			if (response.status !== 200) { return setError(result?.error ? result.error : "Something went wrong."); }
			toast.success("Your password has been reset. Please try logging in.")
			navigate("/login")
			return result
		}
		catch (e) { setError("Something went wrong, try again later."); }
		finally { setLoading(false); }
	}

	return useMemo(() => ({
		sendOTP,
		resetPassword,
		error,
		loading,
		otpSent,
	}), [loading, error, otpSent])
}

export default useForgotPassword;