import React from "react";
import LoadingCircle from "./LoadingCircle";

export type ButtonProps = {
  text?: string | React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  rounded?: boolean;
  Icon?: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
  disabled?: boolean;
  borderLess?: boolean;
  alignLeft?: boolean;
  disableMinWidthHeight?: boolean;
  loading?: boolean;
  iconRight?: boolean;
  as?: "span";
  hidden?: boolean;
  disableAutoCapitalize?: boolean;
  theme?: "primary" | "white";
} & React.PropsWithChildren;

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  rounded,
  Icon,
  onClick,
  className = "",
  activeClassName = "",
  disabledClassName = "",
  disabled,
  borderLess,
  alignLeft,
  disableMinWidthHeight,
  loading,
  iconRight,
  as,
  children,
  hidden,
  disableAutoCapitalize,
  theme = "primary",
}) => {
  const Wrapper = (props: any) =>
    as === "span" ? <span {...props} /> : <button {...props} />;

  if (hidden) return null;

  return (
    <Wrapper
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${rounded ? "rounded-md" : ""} ${
        borderLess ? "" : "border"
      } ${disableMinWidthHeight ? "" : "min-w-[85px] min-h-[40px]"} px-2 flex ${
        alignLeft ? "" : "justify-center"
      } items-center transition duration-300 ${
        disabled || loading
          ? `bg-gray-disabled text-gray border-gray ${disabledClassName}`
          : `${
              theme === "primary"
                ? "bg-black text-white "
                : "bg-white text-black"
            } ${activeClassName}`
      } ${className}`}
    >
      <span
        className={`flex items-center justify-center ${
          iconRight ? "flex-row-reverse" : ""
        }`}
      >
        {loading ? (
          <LoadingCircle
            size="small"
            className={`${!text ? "" : iconRight ? "ml-2" : "mr-2"}`}
          />
        ) : (
          Icon
        )}
        <span
          className={`${
            Icon && !!text ? (iconRight ? "mr-2" : "ml-2") : ""
          } flex items-center text-start ${
            disableAutoCapitalize ? "" : "lowercase"
          }`}
        >
          {!!text && (
            <span
              className={`${
                disableAutoCapitalize ? "" : "first-letter:uppercase"
              }`}
            >
              {text}
            </span>
          )}
        </span>
      </span>
      {children}
    </Wrapper>
  );
};

export const WidgetButton: React.FC<ButtonProps> = React.memo((props) => {
  return (
    <Button
      className="ml-4 min-w-[100px] text-xs p-1 uppercase"
      rounded
      disableMinWidthHeight
      {...props}
    />
  );
});

export default Button;
