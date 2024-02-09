import React from "react";
import { useNavigate } from "react-router-dom";

type ApplicationErrorProps =
    {
        title: string;
        description: string;
        navigate_to?: string;
        button?: string;
        onBack?: () => void;
    }

const ApplicationError: React.FC<ApplicationErrorProps> = ({ title, description, navigate_to, button, onBack }) => {
    const navigate = useNavigate();
    const back = () =>
    {
        navigate_to ? navigate(navigate_to) : navigate(-1);
        onBack && onBack();
    }
    return (
        <div className="m-10 flex flex-col flex-1 justify-start items-center">
            <span className="rounded-xl bg-white p-4 shadow-sm">
                <p className="m-4 font-light text-3xl">{title}</p>
                <p className="m-4 font-light text-xl">{description}</p>
                <button className="m-4 underline text-primary text-xl self-start cursor-pointer" type="button" onClick={back}>{button ? button : "Back"}</button>
            </span>
        </div>
    );
}

export default ApplicationError;