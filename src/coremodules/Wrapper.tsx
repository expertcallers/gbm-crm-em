import LoadingCircle from "./LoadingCircle";

type WrapperProps = {
  title?: string | React.ReactNode;
  description?: string;
  wrapperClassname?: string;
  titleWrapperClassname?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  BeforeTitle?: React.ReactNode;
  MenuButton?: React.ReactNode;
  isLoading?: boolean;
  borderLess?: boolean;
  onEdit?: () => void;
} & React.PropsWithChildren;

const Wrapper: React.FC<WrapperProps> = ({
  BeforeTitle,
  onEdit,
  title,
  description,
  descriptionClassName = "",
  titleWrapperClassname = "",
  wrapperClassname,
  titleClassName = "",
  isLoading,
  children,
  MenuButton,
  borderLess,
}) => {
  return (
    <div
      className={`flex flex-col w-full ${
        borderLess ? "" : "shadow border border-gray-lightest"
      } rounded-lg ${wrapperClassname ? wrapperClassname : "max-w-[300px]"}`}
    >
      <div
        className={`flex ${
          titleWrapperClassname
            ? titleWrapperClassname
            : borderLess
            ? ""
            : "m-4"
        }`}
      >
        {BeforeTitle}
        {title && (
          <div className="w-full flex justify-between text-gray items-center">
            <span className="w-full">
              <span className="flex justify-between">
                {typeof title === "string" ? (
                  <h3
                    className={`font-medium text-sm uppercase text-primary flex items-center gap-2 ${titleClassName}`}
                  >
                    {title} {isLoading && <LoadingCircle size="smaller" />}{" "}
                  </h3>
                ) : (
                  title
                )}
                {onEdit && (
                  <button type="button" onClick={() => onEdit()}>
                    <IoPencil />
                  </button>
                )}
              </span>
              {description && (
                <p
                  className={`font-medium text-xs text-gray ${descriptionClassName}`}
                >
                  {description}
                </p>
              )}
            </span>
            {MenuButton}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

function IoPencil() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-[20px] text-primary"
    >
      <path
        d="M358.62 129.28L86.49 402.08 70 442l39.92-16.49 272.8-272.13-24.1-24.1zM413.07 74.84l-11.79 11.78 24.1 24.1 11.79-11.79a16.51 16.51 0 000-23.34l-.75-.75a16.51 16.51 0 00-23.35 0z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="44"
      />
    </svg>
  );
}

export default Wrapper;
