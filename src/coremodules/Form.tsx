import React, { useState } from "react";
import Button from "./Button";
import FileInput from "./FileInput";


export namespace Form {
  type WrapperProps = {
    className?: string;
    containerClassName?: string;
    formClassName?: string;
    wrapperClassName?: string;
    title?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<any>;
    onChange?: (e: React.FormEvent<HTMLFormElement>) => any;
    error?: string | null;
    loading?: boolean;
    LoadingComponent?: React.ReactElement;
    disabled?: boolean;
    submitText?: string;
    resetOnSubmit?: boolean;
    Buttons?: React.ReactElement;
    titleClassName?: string;
    buttonClassName?: string;
    buttonWrapperClassName?: string;
    message?: string;
  };

  export const Wrapper: React.FC<React.PropsWithChildren & WrapperProps> = ({
    Buttons,
    message,
    buttonWrapperClassName,
    buttonClassName,
    titleClassName,
    resetOnSubmit,
    submitText = "Submit",
    children,
    wrapperClassName = "",
    formClassName = "",
    className = "",
    containerClassName = "",
    title,
    onSubmit,
    onChange,
    error,
    loading,
    LoadingComponent,
    disabled,
  }) => {
    return (
      <>
        <BaseWrapper
          title={title}
          className={className}
          containerClassName={containerClassName}
          titleClassName={titleClassName}
        >
          <form
            onChange={onChange}
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                onSubmit && (await onSubmit(e));
                resetOnSubmit &&
                  "reset" in e.target &&
                  typeof e.target.reset === "function" &&
                  e.target.reset();
              } catch (error) {}
            }}
            className={`mt-4 space-y-6 ${formClassName}`}
          >
            <div className={wrapperClassName}>
              {children}
              {error && (
                <p className="text-sm text-rose shadow-none border-none">
                  {typeof error === "string" ? error : "Unknown server error."}
                </p>
              )}
              {message && (
                <p className="text-sm text-green shadow-none border-none">
                  {message}
                </p>
              )}
            </div>

            {!!Buttons && (
              <div
                className={
                  buttonWrapperClassName
                    ? buttonWrapperClassName
                    : "flex justify-end"
                }
              >
                {Buttons}
                {!disabled && (
                  <Button
                    type={"submit"}
                    text={submitText}
                    className={buttonClassName ? buttonClassName : "w-full"}
                    disabled={loading}
                    rounded
                  />
                )}
              </div>
            )}

            {!Buttons && !disabled && (
              <Button
                type={"submit"}
                text={submitText}
                className={buttonClassName ? buttonClassName : "w-full"}
                disabled={loading}
                rounded
              />
            )}
          </form>

          {loading && LoadingComponent}
        </BaseWrapper>
      </>
    );
  };

  type BaseWrapperProps = {
    title?: string;
    className?: string;
    containerClassName?: string;
    titleClassName?: string;
  };

  export const BaseWrapper: React.FC<
    React.PropsWithChildren & BaseWrapperProps
  > = ({
    children = "",
    className,
    containerClassName = "",
    titleClassName = "",
    title,
  }) => {
    return (
      <div className={className}>
        <div
          className={`relative bg-white rounded-xl w-full ${containerClassName}`}
        >
          {title && (
            <>
              <p
                className={`text-lg text-primary font-medium mb-2 capitalize ${titleClassName}`}
              >
                {title}
              </p>
              <hr className="text-gray-light" />
            </>
          )}
          {children}
        </div>
      </div>
    );
  };

  export const inputStyle =
    "relative mb-2 block w-full rounded border border-gray-light p-2 text-sm outline-none text-black font-normal";

  export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    maxWidth48Percent?: boolean;
    containerClassName?: string;
  };

  export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
      const { maxWidth48Percent, containerClassName, ...inputProps } = props;

      return (
        <div
          className={`w-full ${
            maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
          } ${containerClassName ? containerClassName : ""}`}
        >
          <label
            htmlFor={props.id}
            className="text-gray-dark uppercase text-xs"
          >
            {props.label}
          </label>
          <input
            ref={ref}
            {...inputProps}
            className={`${inputStyle} ${props.className}`}
          />
        </div>
      );
    }
  );

  export type MobileNumberProps =
    React.InputHTMLAttributes<HTMLInputElement> & {
      label?: string;
      countryCodeDefaultValue?: string;
      countryCodeName?: string;
      maxWidth48Percent?: boolean;
      containerClassName?: string;
      readOnlyCountryCode?: boolean;
      countryCodeValue?: string;
    };

  export const MobileNumber = React.forwardRef<
    HTMLInputElement,
    MobileNumberProps
  >((props, ref) => {
    const {
      countryCodeValue,
      readOnlyCountryCode,
      maxWidth48Percent,
      containerClassName,
      countryCodeName,
      countryCodeDefaultValue,
      defaultValue,
      ...inputProps
    } = props;

    const [value, setValue] = useState<string>(
      defaultValue ? `${defaultValue}` : ""
    );

    return (
      <div
        className={`w-full ${
          maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
        } ${containerClassName ? containerClassName : ""}`}
      >
        <label htmlFor={props.id} className="text-gray-dark uppercase text-xs">
          {props.label}
        </label>
        <div className="flex gap-2 items-center mb-2">
          <span>+</span>
          <input
            {...inputProps}
            id="country-code"
            type="text"
            pattern="[0-9]{0,10}"
            autoComplete="country-code"
            title="Please enter the country code."
            name={countryCodeName}
            defaultValue={countryCodeDefaultValue}
            className={`${inputStyle} ${props.className} max-w-[60px] !mb-0 ${
              readOnlyCountryCode ? "bg-disabled outline-none" : ""
            }`}
            readOnly={readOnlyCountryCode}
            value={countryCodeValue}
          />
          <input
            ref={ref}
            {...inputProps}
            type="text"
            pattern="[0-9]{10}"
            min={0}
            max={10}
            value={value}
            onChange={(e) =>
              setValue((prev) =>
                e.target.value.length > 10 ? prev : e.target.value
              )
            }
            title="Please enter a 10 digit mobile number."
            className={`${inputStyle} ${props.className} !mb-0`}
          />
        </div>
      </div>
    );
  });

  export const InputMoney = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
      minVal?: number;
      maxVal?: number;
      label?: string;
      maxWidth48Percent?: boolean;
      containerClassName?: string;
    }
  >((props, ref) => {
    const {
      maxWidth48Percent,
      minVal = 0,
      maxVal = 2147483647,
      containerClassName,
      defaultValue,
      ...inputProps
    } = props;

    const [value, setValue] = useState(defaultValue);

    const clamp = (value: string) => {
      if (value === "") return "";
      const num = Number(value.replaceAll(",", "")) ?? 0;
      if (isNaN(num)) return minVal ?? 0;
      return Math.min(maxVal ?? 0, Math.max(minVal ?? 0, num));
    };

    return (
      <div
        className={`w-full ${
          maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
        } ${containerClassName ? containerClassName : ""}`}
      >
        <label htmlFor={props.id} className="text-gray-dark uppercase text-xs">
          {props.label}
        </label>
        <input type="hidden" name={inputProps.name} value={value} />
        <input
          ref={ref}
          type="text"
          {...inputProps}
          name=""
          value={Number(value ?? 0)?.toLocaleString()}
          onChange={(e) => {
            const formated = clamp(e.target.value).toLocaleString();
            if (inputProps.onChange) inputProps.onChange(e);
            setValue(formated.replaceAll(",", ""));
            e.target.value = formated;
          }}
          className={`${inputStyle} ${props.className}`}
        />
      </div>
    );
  });

  export type TextAreaProps =
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      label?: string;
      maxWidth48Percent?: boolean;
      containerClassName?: string;
    };

  export const TextArea: React.FC<TextAreaProps> = (props) => {
    const { maxWidth48Percent, containerClassName, ...inputProps } = props;

    return (
      <div
        className={`w-full ${
          maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
        } ${containerClassName ? containerClassName : ""}`}
      >
        <label htmlFor={props.id} className="text-gray-dark uppercase text-xs">
          {props.label}
        </label>
        <textarea
          {...inputProps}
          className={`${inputStyle} ${props.className}`}
        />
      </div>
    );
  };

  export const CustomComponent: React.FC<{
    id?: string;
    label?: string;
    component: React.ReactNode;
    maxWidth48Percent?: boolean;
    className?: string;
    labelClassName?: string;
  }> = (props) => {
    return (
      <div
        className={`w-full ${
          props.maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
        } ${props.className ? props.className : ""}`}
      >
        {props.label && (
          <label
            htmlFor={props.id}
            className={
              props.labelClassName
                ? props.labelClassName
                : "text-gray-dark uppercase text-xs"
            }
          >
            {props.label}
          </label>
        )}
        {props.component}
      </div>
    );
  };

  export const InputWrapper: React.FC<React.PropsWithChildren> = ({
    children,
  }) => {
    return <div className="flex flex-wrap justify-between">{children}</div>;
  };

  export const SectionGroup: React.FC<React.PropsWithChildren> = ({
    children,
  }) => {
    return (
      <div className="flex flex-col md:flex-row flex-wrap gap-8">
        {children}
      </div>
    );
  };

  export const Section: React.FC<
    {
      title: string;
      description?: string;
      noMargin?: boolean;
      className?: string;
    } & React.PropsWithChildren
  > = ({ title, description, noMargin, className = "", children }) => {
    return (
      <div className={`${noMargin ? "" : "my-8"} ${className}`}>
        <div className="mb-2">
          <p className="font-medium text-sm text-primary uppercase">{title}</p>
          {description && (
            <p className="font-medium text-xs text-gray">{description}</p>
          )}
        </div>
        {children}
      </div>
    );
  };

  export const CheckBox: React.FC<InputProps> = (props) => {
    const [checked, setChecked] = useState(props.defaultChecked ? 1 : 0);

    return (
      <div
        className={`w-full ${
          props.maxWidth48Percent === false ? "" : "sm:max-w-[48%]"
        } ${
          props.containerClassName
            ? props.containerClassName
            : "flex items-center justify-end flex-row-reverse gap-2 my-1"
        }`}
      >
        <label htmlFor={props.id} className="text-gray-dark uppercase text-xs">
          {props.label}
        </label>
        <input type="hidden" name={props.name} value={checked} />
        <input
          type="checkbox"
          value={checked}
          onChange={(e) => setChecked(e.target.checked ? 1 : 0)}
          {...props}
          name=""
          className={`${inputStyle} ${props.className}`}
        />
      </div>
    );
  };

  export const File: React.FC<
    InputProps & {
      defaultValue?: string | string[] | null;
      onDownloadFile?: (link: string, name: string) => void;
      accept?: string;
      isDeleting?: boolean;
      errorDeleting?: string;
      onDelete?: (id: string) => void;
    }
  > = ({ accept = "image/*, .docx, .doc, .pdf", ...props }) => {
    return (
      <Form.CustomComponent
        id={props.id}
        label={props.label}
        className="my-2"
        component={
          <FileInput
            id={props.id}
            title={props.label}
            hint={props.title}
            name={props.name}
            defaultValue={props.defaultValue}
            onDownloadFile={props.onDownloadFile}
            onDelete={props.onDelete}
            isDeleting={props.isDeleting}
            errorDeleting={props.errorDeleting}
            required={!!props.required}
            accept="image/*, .docx, .doc, .pdf"
          />
        }
      />
    );
  };
}
