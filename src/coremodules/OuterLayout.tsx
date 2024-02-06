import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Logo from "./Logo";

type Props = {
  title?: string;
  onBack?: () => void;
  onNavigateToHome?: () => void;
  StartComponent?: React.ReactNode;
  EndComponent?: React.ReactNode;
  containerClassName?: string;
  rootClassName?: string;
} & React.PropsWithChildren;

const OuterLayout: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  return (
    <div className={props.rootClassName ?? "flex flex-col w-full gap-1 p-1 text-white"}>
      <div className="md:h-16 flex items-center justify-between bg-black rounded-lg">
        {props.title || props.onBack ? (
          <div className="flex items-center m-2">
            <button
              onClick={props.onBack ? props.onBack : () => navigate(-1)}
              type="button"
            >
              <IoArrowBack size={24} />
            </button>
            {props.title && (
              <p className="text-center ml-2 text-md md:text-xl text-white">
                {props.title}
              </p>
            )}
          </div>
        ) : props.StartComponent ? (
          props.StartComponent
        ) : (
          <button
            type="button"
            onClick={
              props.onNavigateToHome
                ? props.onNavigateToHome
                : () => navigate("/")
            }
            className="cursor-pointer max-w-[150px] md:max-w-[200px] m-4"
          >
            <Logo className="w-[150px] md:w-[200px]" />
          </button>
        )}
        {props.EndComponent}
      </div>
      <div className={`flex flex-col flex-1 ${props.containerClassName ?? ""}`}>
        {props.children}
      </div>
    </div>
  );
};

export default OuterLayout;
