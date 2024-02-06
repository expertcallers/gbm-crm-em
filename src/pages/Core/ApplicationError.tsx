import { useNavigate } from "react-router-dom";

interface ApplicationErrorProps {
  title: string;
  description: string;
  navigate_to?: string;
  button?: string;
  onBack?: () => void;
}

export default function ApplicationError(props: ApplicationErrorProps) {
  const navigate = useNavigate();
  const back = () => {
    props.navigate_to ? navigate(props.navigate_to) : navigate(-1);
    props.onBack && props.onBack();
  };
  return (
    <div className="m-10 flex flex-col flex-1 justify-start items-center">
      <span className="rounded-xl bg-white p-4 shadow-sm">
        <p className="m-4 font-light text-3xl">{props.title}</p>
        <p className="m-4 font-light text-xl">{props.description}</p>
        <button
          className="m-4 underline text-primary text-xl self-start cursor-pointer"
          type="button"
          onClick={back}
        >
          {props.button ? props.button : "Back"}
        </button>
      </span>
    </div>
  );
}
