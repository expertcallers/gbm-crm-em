import Button from "./Button";
import ReactSelect, { ActionMeta } from "react-select";
import CreatableReactSelect from "react-select/creatable";
import AsyncCreatableReactSelect from "react-select/async-creatable";
import AsyncReactSelect from "react-select/async";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  IoAddOutline,
  IoCloseOutline,
  IoStar,
  IoStarOutline,
  IoTrashOutline,
} from "react-icons/io5";
import util from "../hooks/util";

type OnSelectInputChange = (
  name: string,
  newValue: { label: string; value: any }
) => void;

const responsiveColumns: {
  [Grid in NFormGenerator.Columns]: string;
} = {
  "grid-cols-1": "grid-cols-1",
  "grid-cols-2": "grid-cols-1 sm:grid-cols-2",
  "grid-cols-3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  "grid-cols-4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  "grid-cols-5": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5",
  "grid-cols-6": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
};

const responsiveGroupColumns: {
  [Grid in NFormGenerator.Columns]: string;
} = {
  "grid-cols-1": "grid-cols-1",
  "grid-cols-2": "grid-cols-1 sm:grid-cols-2",
  "grid-cols-3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "grid-cols-4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  "grid-cols-5": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  "grid-cols-6": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const responsiveColSpan = {
  "col-span-1": "",
  "col-span-2": "col-span-1 sm:col-span-2",
  "col-span-3": "col-span-1 md:col-span-2 lg: col-span-3",
  "col-span-4": "col-span-1 md:col-span-2 lg: col-span-3 xl:col-span-4",
  "col-span-full": "col-span-full",
};

function useRequiredGroups<GroupNames extends string>(
  groups: [GroupNames, NFormGenerator.CommonInputProps[]][]
) {
  const [state, setState] = useState(
    groups.reduce((r, [_, inputs]) => {
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.requiredGroup) continue;
        if (!r[input.requiredGroup]) r[input.requiredGroup] = {};
        // @ts-ignore
        r[input.requiredGroup] = {
          ...r[input.requiredGroup],
          [(input as any).name]: true,
        };
      }
      return r;
    }, {} as { [groups: string]: { [name: string]: boolean } })
  );

  const onChange = (
    value: string,
    { name, requiredGroup }: { name: string; requiredGroup: string }
  ) => {
    setState((prev) => {
      const next = { ...prev };
      next[requiredGroup][name] = !value;
      return next;
    });
  };

  // TODO Don't remove the * if it's the field with a value
  const isRequired = (name: string, requiredGroup: string) => {
    if (state[requiredGroup] && state[requiredGroup][name])
      return !Object.values(state[requiredGroup]).includes(false);
    return false;
  };

  return { isRequired, onChange };
}

export default function FormGenerator<GroupNames extends string>(
  config: NFormGenerator.Config<GroupNames>
) {
  return (
    <FormGeneratorController {...config}>
      <FormBody {...config} />
    </FormGeneratorController>
  );
}

export function FormGeneratorController(
  config: NFormGenerator.FormGeneratorControllerConfig
) {
  const {
    gap: configGap = "gap-6",
    formClassName = "",
    buttonsWrapperClassName = "",
  } = config;

  const formRef = useRef<HTMLFormElement>(null);

  const controller = useFormGeneratorEvents(config.onChange);

  const submitText = config.submitText ?? "Submit";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!config.onSubmit && !config.onSubmitEvent)
      return Promise.reject("Submit not handled.");

    if (config.onSubmitEvent) {
      config.onSubmitEvent(e);
    }

    if (config.onSubmit) {
      const formData = new FormData(e.currentTarget);
      for (let key of formData.keys())
        key.startsWith("__") && formData.delete(key);
      config.onSubmit(formData);
    }
  };

  const onExport = () => {
    if (!formRef.current || !config.onExport) return;
    controller.onFormChange(formRef.current, config.onExport);
  };

  useEffect(() => {
    formRef.current && controller.onFormChange(formRef.current);
  }, [formRef.current]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={(e) => controller.onFormChange(e.currentTarget)}
      className={`flex flex-col ${
        configGap === "none" ? "" : configGap
      } ${formClassName}`}
    >
      {config.heading && (
        <p className="uppercase text-lg font-bold text-primary underline mr-[32px]">
          {config.heading}
        </p>
      )}
      {config.children}
      {!!config.submitError && (
        <p className="text-sm text-rose shadow-none border-none">
          {String(config.submitError)}
        </p>
      )}
      {!config.readonly && (
        <div className={`flex justify-end gap-2 ${buttonsWrapperClassName}`}>
          {config.extraButtons?.map((btn) => (
            <Button
              key={btn.name}
              type={"button"}
              text={btn.name}
              disabled={
                config.isSubmitting || config.isSubmitDisabled || btn.disabled
              }
              loading={config.isSubmitting}
              className={btn.className ?? "self-end py-1"}
              onClick={btn.onClick}
              disableMinWidthHeight
              rounded
            />
          ))}
          {config.onExport && (
            <Button
              type={"button"}
              text={"Export"}
              disabled={config.isSubmitting || config.isSubmitDisabled}
              loading={config.isSubmitting}
              className="self-end py-1"
              onClick={onExport}
              disableMinWidthHeight
              rounded
            />
          )}
          {!config.hideSubmit && (
            <Button
              type={"submit"}
              text={submitText}
              disabled={config.isSubmitting || config.isSubmitDisabled}
              loading={config.isSubmitting}
              className="self-end py-1"
              disableMinWidthHeight
              rounded
            />
          )}
        </div>
      )}
    </form>
  );
}

export function FormBody<GroupNames extends string>(
  config: NFormGenerator.Config<GroupNames>
) {
  const {
    groupColumns: configGroupColumns = "grid-cols-1",
    columns: configColumns = "grid-cols-1",
    groupGap: configGroupGap = "gap-12",
    gap: configGap = "gap-6",
    margin = "",
    maxFormWidth,
    maxColumnWidth,
    expand,
    noHeaders,
    labelStyle = "title",
    titleStyle = "heading",
    title,
    isResponsive = true,
    groupColSpan = "",
    hideColumn,
  } = config;

  const formRef = useRef<HTMLFormElement>(null);

  const controller = useFormGeneratorEvents(config.onChange);

  useEffect(() => {
    formRef.current && controller.onFormChange(formRef.current);
  }, [formRef.current]);

  const groups = (
    Object.entries(config.inputs) as [GroupNames, NFormGenerator.InputProps[]][]
  ).filter(([groupName, inputs]) => inputs.length > 0);

  const groupColumns = isResponsive
    ? responsiveGroupColumns[configGroupColumns]
    : config.groupColumns;

  const columns = isResponsive
    ? responsiveColumns[configColumns]
    : config.columns;

  const requiredGroups = useRequiredGroups(groups as any);

  return (
    <div
      className={`flex flex-col ${configGap} ${margin} ${
        expand ? "flex-1" : ""
      } ${maxFormWidth ? maxFormWidth : ""}`}
    >
      {!title ? null : titleStyle === "heading" ? (
        <p className="uppercase text-lg font-bold text-primary underline mr-[32px]">
          {title}
        </p>
      ) : (
        <p className="uppercase text-base text-primary mr-[32px]">{title}</p>
      )}
      <div className={`grid ${configGroupGap} ${groupColumns}`}>
        {groups.map(([group, inputs], groupId) => (
          <div
            key={group}
            className={`${
              hideColumn?.includes(group) ? "hidden" : "flex"
            } flex-col ${configGap} ${
              groupColSpan &&
              responsiveColSpan[groupColSpan[group] ?? "col-span-1"]
                ? responsiveColSpan[groupColSpan[group] ?? "col-span-1"]
                : ""
            }`}
          >
            {!noHeaders && (
              <>
                {labelStyle === "title" && (
                  <p className="uppercase text-lg font-bold text-primary underline mr-[32px]">
                    {util.camelCaseToSpaceSeparated(group)}
                  </p>
                )}
                {labelStyle === "subtitle" && (
                  <p className="capitalize rounded text-sm bg-primary-background p-1 text-primary">
                    {util.camelCaseToSpaceSeparated(group)}
                  </p>
                )}
              </>
            )}
            <div
              className={`grid ${configGap} ${columns} ${
                maxColumnWidth ? maxColumnWidth : ""
              }`}
            >
              {inputs.flatMap((inputProps: any, inputId) => {
                const isGroupRequired = requiredGroups.isRequired(
                  inputProps.name,
                  inputProps.requiredGroup
                );
                return (
                  <Field
                    key={`${
                      inputProps.name ?? inputProps.key
                    }-${groupId}-${inputId}`}
                    readOnly={config.readonly}
                    isGroupRequired={isGroupRequired}
                    {...inputProps}
                    onChange={(e) => {
                      if (inputProps.requiredGroup)
                        requiredGroups.onChange(e.target.value, {
                          name: inputProps.name,
                          requiredGroup: inputProps.requiredGroup,
                        });
                      if (inputProps.onChange) inputProps.onChange(e);
                    }}
                    id={`${
                      inputProps.name ?? inputProps.key
                    }-${groupId}-${inputId}`}
                    onSelectInputChange={controller.onSelectInputChange}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label?: string;
  type: NFormGenerator.InputProps["type"];
  omit?: boolean;
  note?: string;
  noteClassName?: string;
  onSelectInputChange?: OnSelectInputChange;
  colSpan?: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4";
  isGroupRequired?: boolean;
  requiredGroup?: string;
  buttons?: NFormGenerator.CommonInputProps["buttons"];
} & React.InputHTMLAttributes<any>;

// For performance, may want to memonize this component. However, it may add a lot of checks
const Field = (props: FieldProps) => {
  const {
    id,
    type,
    omit,
    note,
    noteClassName,
    colSpan = "col-span-1",
    isGroupRequired,
    requiredGroup,
    buttons,
    ...inputProps
  } = props;

  const label = inputProps.label ?? inputProps.name?.replaceAll("_", " ");

  const title = inputProps.title ?? `Please check the input for \"${label}\"`;

  const isAddable =
    type === "SelectCreatable" || type === "AsyncSelectCreatable";

  const componentProps = prepareComponentProps(inputProps, type);

  const InputComponent = InputTypes[type];

  if (type === "Hidden")
    return (
      <InputComponent
        id={id}
        title={title}
        label={label}
        {...componentProps}
        required={isGroupRequired || componentProps.required}
        className={`placeholder:text-xs w-full border-b border-b-gray-light outline-none focus:border-b-primary ${
          componentProps.readOnly ? "text-gray-dark bg-gray-lightest" : ""
        } ${componentProps.className ?? ""}`}
      />
    );

  const isListType =
    type === "Textarea" ||
    type === "Checkbox" ||
    type === "Creatable" ||
    type === "BaseFileUpload" ||
    type === "Document" ||
    type === "PhotoCopy";

  if (omit) return null;

  return (
    <div
      className={`flex flex-col mb-auto w-full h-full ${responsiveColSpan[colSpan]}`}
    >
      <label
        htmlFor={id}
        className={`text-[#9F9F9F] uppercase text-xs relative ${
          isListType ? "" : "h-full"
        }`}
      >
        <div className="flex justify-between">
          <div>
            {label}
            {inputProps.required && <span className="text-rose">*</span>}
            {isGroupRequired && <span className="text-rose font-bold">*</span>}
          </div>
          {isAddable && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.29687 8.2381H3V6.92857H7.29687V3H8.72917V6.92857H13.026V8.2381H8.72917V12.1667H7.29687V8.2381Z"
                fill="#3498DB"
              />
              <rect
                x="0.5"
                y="0.5"
                width="15"
                height="15"
                rx="1.5"
                stroke="#3498DB"
              />
            </svg>
          )}
        </div>
        {inputProps.multiple && (
          <span className="text-[10px]">
            {" "}
            (<span className="italic">multi</span>)
          </span>
        )}
      </label>
      <pre
        className={`text-gray italic text-xs font-sans whitespace-pre-wrap ${noteClassName}`}
      >
        {note}
      </pre>

      {!buttons ? (
        <InputComponent
          id={id}
          title={title}
          label={label}
          {...componentProps}
          required={isGroupRequired || componentProps.required}
          className={`placeholder:text-xs w-full border-b border-b-gray-light outline-none focus:bg-primary-background transition focus:border-b-primary ${
            componentProps.readOnly ? "text-gray-dark bg-gray-lightest" : ""
          } ${componentProps.className ?? ""}`}
        />
      ) : (
        <div className="flex w-full gap-2">
          <InputComponent
            id={id}
            title={title}
            label={label}
            {...componentProps}
            required={isGroupRequired || componentProps.required}
            className={`placeholder:text-xs w-full border-b border-b-gray-light outline-none focus:bg-primary-background transition focus:border-b-primary ${
              componentProps.readOnly ? "text-gray-dark bg-gray-lightest" : ""
            } ${componentProps.className ?? ""}`}
          />
          {buttons.map(({ name, onClick, Icon }, i) => (
            <Button
              key={i}
              text={name}
              Icon={Icon}
              disableMinWidthHeight={!!Icon}
              className={`${!!Icon ? "rounded-full w-[32px] h-[32px]" : ""}`}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const InputTypes: {
  [K in NFormGenerator.InputProps["type"]]: React.FC<any>;
} = {
  PanNumber: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only valid pan numbers are allowed here.";

    return (
      <input
        {...props}
        pattern="[A-Z]{5}[0-9]{4}[A-Z]"
        title={title}
        type="text"
      />
    );
  },
  Checkbox: (props: NFormGenerator.CheckboxProps) => {
    const { required, readOnly, createable, defaultValue, ...inputProps } =
      props;

    const id = useId();

    const [options, setOptions] = useState(props.options ?? []);
    const [values, setValues] = useState<{ [value: string]: boolean }>({});

    const onChange = (
      value: string,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setValues((prev) => ({ ...prev, [value]: e.target.checked }));
      inputProps.onChange && inputProps.onChange(e);
    };

    const [moreError, setMoreError] = useState("");
    const [more, setMore] = useState("");

    const onAddMore = () => {
      if (
        !!Object.keys(values).find(
          (v) => v.toLowerCase() === more.trim().toLowerCase()
        )
      ) {
        return setMoreError(
          "Option already exists, please enter a unique option."
        );
      }
      setOptions((prev) => [
        ...prev,
        { label: more.trim(), value: more.trim() },
      ]);
      setValues((prev) => ({ ...prev, [more.trim()]: true }));
      setMore("");
      setMoreError("");
    };

    const isRequired = required && !Object.values(values).includes(true);

    return (
      <div className="flex flex-col gap-1 mt-2">
        {!readOnly && createable && (
          <div>
            <div className="flex gap-2">
              <input
                value={more}
                onChange={(e) => setMore(e.target.value.trimStart())}
                className={(inputProps as any).className}
                placeholder="Add more options..."
                required={isRequired}
              />
              <Button
                type="button"
                disableMinWidthHeight
                className="p-1 text-xs uppercase"
                onClick={onAddMore}
                disabled={more.length === 0}
                rounded
              >
                <IoAddOutline />
              </Button>
            </div>
            {moreError && <p className="text-rose text-xs">{moreError}</p>}
          </div>
        )}
        {options.map((option) => (
          <div key={`${id}-${option.value}`} className="flex gap-4">
            <input
              {...inputProps}
              type="checkbox"
              value={option.value}
              id={`${id}-${option.value}`}
              className="w-4 mb-auto mt-1"
              required={option.required || isRequired}
              disabled={option.disabled || inputProps.disabled}
              onChange={(e) => onChange(option.value, e)}
              checked={
                readOnly && defaultValue
                  ? defaultValue.includes(option.value)
                  : !!values[option.value]
              }
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className="flex-1 text-sm "
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  },
  Hidden: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    return <input {...props} type="hidden" />;
  },
  Any: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only lowercase and uppercase characters are allowed here.";

    return <input {...props} title={title} type="text" />;
  },
  Password: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
      <input
        {...props}
        type="password"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
      />
    );
  },
  Alpha: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only lowercase and uppercase characters are allowed here.";

    return <input {...props} pattern="[a-zA-Z]+" title={title} type="text" />;
  },

  AlphaWithSpace: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title =
      "Only lowercase, uppercase characters and spaces are allowed here.";

    const className = `mt-auto placeholder:text-xs w-full border-b border-b-gray-light outline-none focus:border-b-primary ${
      props.readOnly ? "text-gray-dark bg-gray-lightest" : ""
    } ${props.className ?? ""}`;

    return (
      <input
        {...props}
        className={className}
        pattern="[a-zA-Z\s]+"
        title={title}
        type="text"
      />
    );
  },

  AlphaWithSpaceAndNumbers: (
    props: React.InputHTMLAttributes<HTMLInputElement>
  ) => {
    const title = "Only lowercase and uppercase characters are allowed here.";

    return (
      <input {...props} pattern="[a-zA-Z0-9\s]+" title={title} type="text" />
    );
  },

  Numeric: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only numeric characters are allowed here.";

    return <input {...props} pattern="[0-9]+" title={title} type="text" />;
  },

  Number: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only numbers are allowed here.";

    return (
      <input {...props} title={title} type="number" min={props.min ?? 0} />
    );
  },

  Decimal: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only numbers and decimals are allowed here.";

    return (
      <input {...props} pattern="^\d+(\.\d+)?$" title={title} type="text" />
    );
  },

  Alphanumeric: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only alphanumeric characters are allowed here.";
    const className = `mt-auto placeholder:text-xs w-full border-b border-b-gray-light outline-none focus:border-b-primary ${
      props.readOnly ? "text-gray-dark bg-gray-lightest" : ""
    } ${props.className ?? ""}`;

    return (
      <input
        {...props}
        className={className}
        pattern="[0-9a-zA-Z]+"
        title={title}
        type="text"
      />
    );
  },

  Time: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "hh:mm - Only date values are allowed here.";

    return <input {...props} type="time" title={title} />;
  },

  Date: (
    props: React.InputHTMLAttributes<HTMLInputElement> &
      NFormGenerator.DateProps
  ) => {
    const { noOfDaysFromToday, defaultValue, ...inputProps } = props;

    const title = "DD/MM/YYYY - Only date values are allowed here.";

    const [date, setDate] = useState<string>(
      formatDateTime(defaultValue) ?? ""
    );

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
      props.onChange && props.onChange(e);
    };

    const customProps = {
      ...inputProps,
      ...(noOfDaysFromToday
        ? {
            onChange: onValueChange,
            value: date,
          }
        : {}),
    };

    useEffect(() => {
      if (!props.value) return;
      setDate(props.value);
    }, [props.value]);

    const days = noOfDaysFromToday
      ? date
        ? dayjs(date).isAfter(dayjs())
          ? dayjs(date).diff(dayjs(), "days") + 1
          : 0
        : 0
      : 0;

    return (
      <div className="flex flex-col gap-2">
        <input
          {...customProps}
          type="date"
          title={title}
          value={date}
          onChange={onValueChange}
        />
        {noOfDaysFromToday && (
          <span className="text-gray italic text-xs">
            <span className="text-primary">{days}</span> calendar days.
          </span>
        )}
      </div>
    );
  },

  DateTime: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "DD/MM/YYYY hh:mm - Only datetime values are allowed here.";

    return (
      <input
        {...props}
        type="datetime-local"
        title={title}
        defaultValue={formatDateTime(props.defaultValue, true)}
      />
    );
  },

  Email: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only valid email addresses allowed here.";

    return <input {...props} type="email" title={title} />;
  },

  Textarea: (props: React.InputHTMLAttributes<HTMLTextAreaElement>) => {
    const title =
      "Characters, numbers and special characters are allowed here.";
    return <textarea {...props} title={title} />;
  },

  IFSC: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only valid bank ifsc is allowed here. ABCDxxxxxxx";

    return (
      <input {...props} pattern="^[A-Z]{4}[0-9]{7}" title={title} type="text" />
    );
  },

  Custom: (props: NFormGenerator.CustomProps & { id: string }) => {
    const { Component, ...inputProps } = props;
    return props.Component(inputProps);
  },

  /// CUSTOM COMPONENTS BELOW

  TimeRange: (props: NFormGenerator.TimeRangeProps) => {
    const {
      fromTime,
      toTime,
      onChange,

      ...inputProps
    } = props;

    const fromLabel = fromTime.label ?? fromTime.name?.replaceAll("_", " ");
    const toLabel = toTime.label ?? toTime.name?.replaceAll("_", " ");

    const [from, setFrom] = useState<string>(fromTime.defaultValue ?? "");
    const [to, setTo] = useState<string>(toTime.defaultValue ?? "");

    useEffect(() => {
      if (fromTime.defaultValue) setFrom(fromTime.defaultValue ?? "");
      if (toTime.defaultValue) setTo(toTime.defaultValue ?? "");
    }, [fromTime.defaultValue, toTime.defaultValue]);

    const onFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      setFrom(time);
      if (dayjs(time).isAfter(to) || to.length === 0) {
        setTo(time);
        onChange && onChange({ from: time, to: time });
        return;
      }
      onChange && onChange({ from: time, to });
    };

    const onToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      setTo(time);
      onChange && onChange({ from, to: time });
    };

    const difference = timeDifference(from, to);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-gray-dark uppercase text-xs">
              {fromTime.required && <span className="text-rose">*</span>}
              {fromLabel}
            </label>
            <InputTypes.Time
              {...fromTime}
              {...inputProps}
              value={from}
              onChange={onFromChange}
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-gray-dark uppercase text-xs">
              {toTime.required && <span className="text-rose">*</span>}
              {toLabel}
            </label>
            <InputTypes.Time
              {...toTime}
              {...inputProps}
              value={to}
              onChange={onToChange}
            />
          </div>
        </div>
        <span className="text-gray-dark text-xs">
          {difference && (
            <span className="italic text-gray">
              <span className="text-primary">{difference.hours}</span> hours(s),{" "}
              <span className="text-primary">{difference.minutes}</span>{" "}
              minute(s).
            </span>
          )}
          {!difference && (
            <span className="italic text-gray">
              <span className="text-primary">0</span> hours(s),{" "}
              <span className="text-primary">0</span> minute(s).
            </span>
          )}
        </span>
      </div>
    );
  },

  DateRange: (props) => {
    const {
      toDate,
      fromDate,
      fromMax,
      fromMin,
      toMax,
      toMin,
      onChange,
      ...inputProps
    } = props as NFormGenerator.DateRangeProps;

    const fromLabel = fromDate.label ?? fromDate.name?.replaceAll("_", " ");
    const toLabel = toDate.label ?? toDate.name?.replaceAll("_", " ");

    const [from, setFrom] = useState<string>(fromDate.defaultValue ?? "");
    const [to, setTo] = useState<string>(toDate.defaultValue ?? "");

    useEffect(() => {
      if (fromDate.defaultValue) setFrom(fromDate.defaultValue ?? "");
      if (toDate.defaultValue) setTo(toDate.defaultValue ?? "");
    }, [fromDate.defaultValue, toDate.defaultValue]);

    const onFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setFrom(date);
      if (dayjs(date).isAfter(to) || to.length === 0) {
        setTo(date);
        onChange && onChange({ from: date, to: date });
        return;
      }
      onChange && onChange({ from: date, to });
    };

    const onToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setTo(date);
      onChange && onChange({ from, to: date });
    };

    const days = from && to ? dayjs(to).diff(from, "days") + 1 : 0;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <div className={"flex flex-col w-full"}>
            <label className="text-gray-dark uppercase text-xs">
              {fromLabel}
              {fromDate.required && <span className="text-rose">*</span>}
            </label>
            <InputTypes.Date
              {...inputProps}
              {...fromDate}
              min={fromMin}
              max={fromMax}
              value={from}
              onChange={onFromChange}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-dark uppercase text-xs">
              {toLabel}
              {toDate.required && <span className="text-rose">*</span>}
            </label>
            <InputTypes.Date
              {...inputProps}
              {...toDate}
              min={from.length > 0 ? from : fromMin}
              max={toMax}
              value={to}
              onChange={onToChange}
            />
          </div>
        </div>
        <span className="text-gray italic text-xs">
          Selected <span className="text-primary">{days}</span> day(s).
        </span>
      </div>
    );
  },

  Document: (props: NFormGenerator.DocumentInputProps) => {
    const title = "Only png, pdf, jpg, jpeg, docx and doc allowed here.";

    return (
      <InputTypes.BaseFileUpload
        title={title}
        accept="image/*, .docx, .doc, .pdf"
        {...props}
      />
    );
  },

  PhotoCopy: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const title = "Only png, pdf, jpg and jpeg allowed here.";

    return (
      <InputTypes.BaseFileUpload
        title={title}
        accept="image/*, .pdf"
        {...props}
      />
    );
  },

  BaseFileUpload: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const {
      defaultValue,
      type,
      title,
      onDelete,
      isDeleting,
      errorDeleting,
      onDownloadFile,
      link,
      ...inputProps
    } = props as NFormGenerator.DocumentInputProps &
      React.InputHTMLAttributes<HTMLInputElement>;

    const links = Array.isArray(link) ? link : link ? [link] : null;

    const [defaultValues, setDefaultValues] = useState<
      { id: string; name: string; path: string }[]
    >([]);

    useEffect(() => {
      if (!defaultValue) return;
      const links: { path: string; name: string }[] = Array.isArray(
        defaultValue
      )
        ? defaultValue
        : [defaultValue];
      setDefaultValues(
        links.reduce(
          (r, link) => [
            ...r,
            { id: link.path.split("/").reverse()[0], ...link },
          ],
          [] as { id: string; name: string; path: string }[]
        )
      );
    }, [defaultValue]);

    const handleDelete = async (id: string) => {
      if (isDeleting || !onDelete) return;
      try {
        await onDelete(id);
        setDefaultValues((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {}
    };

    const renderPreview = (item: (typeof defaultValues)[0], index: number) => (
      <div
        key={item.id}
        className={`flex items-center ${
          inputProps.readOnly ? "bg-gray-lightest" : ""
        } overflow-hidden`}
      >
        {onDelete && (
          <button onClick={() => handleDelete(item.id)} type="button">
            <IoTrashOutline size={20} className="mr-1 mb-1 text-rose" />
          </button>
        )}
        <button
          className="flex text-xs text-start text-primary underline font-bold whitespace-nowrap text-ellipsis"
          type="button"
          onClick={() =>
            onDownloadFile && onDownloadFile(item.path, item.name ?? "File")
          }
        >
          {item.name}
        </button>
      </div>
    );

    return (
      <>
        {defaultValues.map(renderPreview)}
        {!inputProps.readOnly && (
          <input
            {...inputProps}
            className="border-b border-b-gray-light outline-none focus:border-b-primary text-xs py-2 flex flex-1"
            type="file"
          />
        )}
        {links && (
          <>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.path}
                download={link.download}
                className="text-primary underline text-xs my-1"
              >
                {link.name}
              </a>
            ))}
          </>
        )}
      </>
    );
  },

  Creatable: (props: any) => {
    const defaultCount = props.defaultCount ?? 1;

    const { name, ...inputProps } = props.creatableProps;

    const [value, setValue] = useState<{ [key: number]: any }>(
      props.defaultValue ?? []
    );
    const [keys, setkeys] = useState<number[]>(
      new Array(props.defaultValue ? props.defaultValue.length : defaultCount)
        .fill(0)
        .map((_, i) => i)
    );
    const InputComponent =
      InputTypes[
        props.creatableProps.type as NFormGenerator.InputProps["type"]
      ];

    const onAdd = () =>
      setkeys((prev) => [
        ...prev,
        prev.reduce((r, c) => (c > r ? c : r), 0) + 1,
      ]);

    const onRemove = (key: number) => {
      setkeys((prev) => prev.filter((k) => k !== key));
      setValue((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

    const onChange = (key: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.creatableProps.onChange) props.creatableProps.onChange(e);
      setValue((prev) => {
        const next = { ...prev };
        next[key] = e.target.value;
        return next;
      });
    };

    const componentProps = prepareComponentProps(
      {
        ...inputProps,
        onSelectInputChange: props.onSelectInputChange,
      },
      inputProps.type
    );

    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <input
          name={props.name}
          value={Object.values(value) ?? ""}
          onChange={() => {}}
          hidden
        />
        <div className="flex flex-col gap-2 w-full rounded-[5px] bg-primary-background p-4">
          {keys.map((key, index) => (
            <div key={key} className="flex gap-2">
              {(props.indexed || props.indexPrefix) && (
                <span className="text-sm text-gray self-start mt-2 uppercase">
                  {props.indexPrefix
                    ? `${props.indexPrefix}${props.indexed ? " " : ""}`
                    : ""}
                  {props.indexed ? `${index + 1}.` : ""}
                </span>
              )}
              <InputComponent
                {...componentProps}
                className={`w-full border-b border-b-gray-light outline-none focus:border-b-primary ${
                  props.readOnly ? "text-gray-dark bg-gray-lightest" : ""
                }`}
                name={`__${name}`}
                value={value[key] ?? ""}
                onChange={(e: any) => onChange(key, e)}
                required={props.required}
              />
              {!props.readOnly && defaultCount <= key && (
                <button onClick={() => onRemove(key)} type="button">
                  <IoCloseOutline size={24} className="text-rose" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!props.readOnly && (
          <button onClick={onAdd} className="self-end" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.29687 8.2381H3V6.92857H7.29687V3H8.72917V6.92857H13.026V8.2381H8.72917V12.1667H7.29687V8.2381Z"
                fill="#3498DB"
              />
              <rect
                x="0.5"
                y="0.5"
                width="15"
                height="15"
                rx="1.5"
                stroke="#3498DB"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },

  Select: (props: any) => {
    const onChange = (next: any) => {
      props.onSelectInputChange(props.name, next);
      props.onChange && props.onChange(next);
    };

    const defaultProps = getDefaultSelectProps(props);

    return <ReactSelect {...defaultProps} onChange={onChange} />;
  },

  SelectCreatable: (props: any) => {
    const onChange = (next: any) => {
      props.onSelectInputChange(props.name, next);
      props.onChange && props.onChange(next);
    };

    const defaultProps = getDefaultSelectProps(props);

    return <CreatableReactSelect {...defaultProps} onChange={onChange} />;
  },

  AsyncSelectCreatable: (props: any) => {
    const onChange = (next: any) => {
      props.onSelectInputChange(props.name, next);
      props.onChange && props.onChange(next);
    };

    const defaultProps = getDefaultSelectProps(props);

    return (
      <AsyncCreatableReactSelect
        placeholder="Type to search..."
        noOptionsMessage={(_) => "Type to search..."}
        {...defaultProps}
        onChange={onChange}
      />
    );
  },

  AsyncSelect: (props: any) => {
    const onChange = (next: any) => {
      props.onSelectInputChange(props.name, next);
      props.onChange && props.onChange(next);
    };

    const defaultProps = getDefaultSelectProps(props);

    return (
      <AsyncReactSelect
        placeholder="Type to search..."
        noOptionsMessage={(_) => "Type to search..."}
        {...defaultProps}
        onChange={onChange}
      />
    );
  },

  Money: (props: NFormGenerator.MoneyProps) => {
    const {
      value: propValue,
      max,
      min,
      defaultValue = props.value ?? props.defaultValue,
      ...inputProps
    } = props;

    const [value, setValue] = useState(() => {
      const val = Number(defaultValue);
      return isNaN(val) ? 0 : val;
    });

    const title = "Only numeric characters are allowed here.";

    useEffect(() => {
      if (isNaN(Number(propValue))) return;
      onChangeValue(String(propValue));
    }, [propValue]);

    const onChangeValue = (value: string) => {
      const next = Number(value.replaceAll(",", ""));
      if (isNaN(next)) return;
      setValue(next);
    };

    const toCommaSeperated = (value: number) => value.toLocaleString("en-IN");

    return (
      <>
        <input
          type="text"
          pattern="[0-9]+"
          value={value}
          name={props.name}
          hidden
          onChange={() => {}}
          disabled={props.disabled}
        />
        <input
          {...inputProps}
          className={`border-b border-b-gray-light outline-none focus:border-b-primary ${
            inputProps.readOnly ? "text-gray-dark bg-gray-lightest" : ""
          }`}
          title={title}
          type="text"
          value={toCommaSeperated(value)}
          onChange={(e) => onChangeValue(e.target.value)}
          name={`__${props.name}`}
        />
      </>
    );
  },

  Boolean: (props: any) => {
    const { blank, name, required, readOnly, disabled } = props;

    const defaultValue = (() => {
      if (props.defaultValue === undefined && blank) return null;
      if (props.defaultValue === undefined) return false;
      return props.defaultValue;
    })();

    const [value, setValue] = useState<null | boolean>(defaultValue);

    const stateValue = props.value === undefined ? value : props.value;

    const onChange = (next: null | boolean) => {
      props.onChange && props.onChange(next);
      props.value === undefined && setValue(next);
    };

    return (
      <div className="flex gap-4 mt-1">
        <input
          name={name}
          value={String(stateValue)}
          onChange={() => {}}
          hidden
        />
        {blank === true && (
          <div className="flex gap-1">
            <input
              disabled={readOnly || disabled}
              required={required}
              defaultChecked={stateValue === null}
              onChange={() => onChange(null)}
              id={`${name}-boolean-blank`}
              name={`__${name}-boolean`}
              type="radio"
            />
            <label htmlFor={`${name}-boolean-blank`} className="text-sm">
              N/A
            </label>
          </div>
        )}
        <div className="flex gap-1">
          <input
            disabled={readOnly || disabled}
            required={required}
            defaultChecked={stateValue === true}
            onChange={() => onChange(true)}
            id={`${name}-boolean-yes`}
            name={`__${name}-boolean`}
            type="radio"
          />
          <label htmlFor={`${name}-boolean-yes`} className="text-sm">
            {props.trueLabel ? props.trueLabel : "Yes"}
          </label>
        </div>
        <div className="flex gap-1">
          <input
            disabled={readOnly || disabled}
            required={required}
            defaultChecked={stateValue === false}
            onChange={() => onChange(false)}
            id={`${name}-boolean-no`}
            name={`__${name}-boolean`}
            type="radio"
          />
          <label htmlFor={`${name}-boolean-no`} className="text-sm">
            {props.falseLabel ? props.falseLabel : "No"}
          </label>
        </div>
      </div>
    );
  },

  Radio: (props: NFormGenerator.RadioProps) => {
    const { name, required, options, wrapperClassName, readOnly, disabled } =
      props;

    const [value, setValue] = useState<NFormGenerator.Option | null>(
      props.defaultValue
    );

    const stateValue = props.value === undefined ? value : props.value;

    const onChange = (next: NFormGenerator.Option | null) => {
      props.onChange && props.onChange(next);
      props.value === undefined && setValue(next);
    };

    return (
      <div className={`${wrapperClassName ?? "flex gap-2 mt-1 flex-col"}`}>
        <input
          name={name}
          value={String(stateValue?.value)}
          onChange={() => {}}
          hidden
        />
        {options.map(({ label, value }) => (
          <div className="flex gap-1">
            <input
              disabled={readOnly || disabled}
              required={required}
              defaultChecked={stateValue?.value === value}
              onChange={() => onChange({ label, value })}
              id={`${name}-${value}-radio`}
              name={`__${name}-radio`}
              type="radio"
            />
            <label htmlFor={`${name}-${value}-radio`} className="text-sm">
              {label}
            </label>
          </div>
        ))}
      </div>
    );
  },

  StarRating: (props: NFormGenerator.StarRatingProps) => {
    const { name, max, min, readOnly, disabled } = props;

    const [value, setValue] = useState(props.defaultValue ?? 0);

    const stateValue = props.value === undefined ? value : props.value;

    const onChange = (rating: number) => {
      const next = Math.min(
        Math.max(value === rating ? rating - 1 : rating, 0),
        max
      );
      props.onChange && props.onChange(next);
      props.value === undefined && setValue(next);
    };

    return (
      <div className={"relative flex gap-2 mt-1 flex-wrap"}>
        {new Array(max).fill(0).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="text-primary"
            disabled={readOnly || disabled}
          >
            {value < i + 1 ? <IoStarOutline /> : <IoStar />}
          </button>
        ))}
        <input
          name={name}
          min={min}
          max={max}
          value={stateValue}
          onChange={() => {}}
          type="number"
          className="opacity-0 select-none pointer-events-none absolute left-0"
        />
      </div>
    );
  },
};

const formatDateTime = (date?: any, isDateTime?: boolean) => {
  if (typeof date !== "string") return date;
  const [d, t] = date.split("T");
  let result = `${d}`;
  if (t && isDateTime) {
    const [h, m] = t.split(":");
    result += ` ${h}:${m}`;
  }
  return result;
};

function timeDifference(from: string, to: string) {
  const [fromHours, fromMinutes] = from.split(":");
  const [toHours, toMinutes] = to.split(":");

  const fromHoursInt = parseInt(fromHours, 10);
  const fromMinutesInt = parseInt(fromMinutes, 10);
  const toHoursInt = parseInt(toHours, 10);
  const toMinutesInt = parseInt(toMinutes, 10);

  let hours = toHoursInt - fromHoursInt;
  let minutes = toMinutesInt - fromMinutesInt;

  const isNan = isNaN(hours) || isNaN(minutes);

  if (isNan) return null;

  if (hours === 0 && minutes === 0) return { hours: 0, minutes: 0 };
  if (hours === 0 && minutes < 0)
    return { hours: 23, minutes: (minutes += 60) };
  if (hours === 0 && minutes > 0) return { hours: 0, minutes };

  if (hours < 0 && minutes > 0) return { hours: (hours += 24), minutes };
  if (hours < 0 && minutes < 0)
    return { hours: (hours += 23), minutes: (minutes += 60) };
  if (hours < 0 && minutes === 0) return { hours: (hours += 24), minutes };

  if (hours > 0 && minutes < 0)
    return { hours: hours - 1, minutes: (minutes += 60) };
  if (hours > 0 && minutes > 0) return { hours, minutes };
  if (hours > 0 && minutes === 0) return { hours, minutes };

  return null;
}

function useFormGeneratorEvents(
  onChange?: (current: Record<string, any>) => void
) {
  const [_, setCurrent] = useState({});

  const onFormChange = (
    formElement: HTMLFormElement | null,
    callback?: (any: Record<string, any>) => void
  ) => {
    if ((!onChange && !callback) || !formElement) return;
    const next = util.formToObject<any>(new FormData(formElement));
    setCurrent(next);
    if (onChange) onChange(next);
    if (callback) callback(next);
  };

  const onSelectInputChange = (name: string, value: any) => {
    if (!onChange) return;
    setCurrent((prev) => {
      const next = { ...prev, [name]: value.value };
      onChange(next);
      return next;
    });
  };

  return useMemo(
    () => ({
      onFormChange,
      onSelectInputChange,
    }),
    []
  );
}

namespace UseCreatableOptions {
  export interface Option {
    label: string;
    value: string;
  }

  export interface Group {
    label: string;
    options: Option[];
  }

  interface SingleGroup {
    label: string;
    option: Option;
  }

  export interface Config {
    options: (UseCreatableOptions.Option | UseCreatableOptions.Group)[];
    onCreate: (newValue: string) => Promise<Option | SingleGroup | null>;
    onChange?: (
      nextValue:
        | UseCreatableOptions.Option
        | UseCreatableOptions.Option[]
        | null
    ) => void;
    isMulti?: boolean;
    isGrouped?: boolean;
  }
}

export function useCreatableOptions(config: UseCreatableOptions.Config) {
  const { isMulti, isGrouped, onCreate } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOption] = useState(config.options);
  const [value, setValue] = useState<
    UseCreatableOptions.Option[] | NFormGenerator.Option | null
  >(isMulti ? [] : null);

  useEffect(() => {
    setOption(config.options);
  }, [JSON.stringify(config.options)]);

  const onCreateOption = async (newValue: string) => {
    setIsLoading(true);
    try {
      const newOption = await onCreate(newValue);
      if (!newOption) return;
      if (!isGrouped) {
        if (!("value" in newOption))
          throw new Error(
            "Expected interface UseCreatableOptions.Option. Received something else"
          );
        setValue((prev) => {
          const next = isMulti
            ? [...((prev as NFormGenerator.Option[]) ?? []), newOption]
            : newOption;
          if (config.onChange) config.onChange(next);
          return next;
        });
        setOption((prev) => [...prev, newOption]);
        return;
      }
      if (!("option" in newOption))
        throw new Error(
          "Expected interface UseCreatableOptions.SingleGroup. Received something else"
        );
      setValue((prev) => {
        const next = isMulti
          ? [...((prev as NFormGenerator.Option[]) ?? []), newOption.option]
          : newOption.option;
        if (config.onChange) config.onChange(next);
        return next;
      });
      setOption((prev: any) => {
        const next = [...prev] as UseCreatableOptions.Group[];
        const group = next.find((n) => n.label === newOption.label);
        if (group)
          return next.map((n) => {
            if (n.label === newOption.label)
              return { ...n, options: [...n.options, newOption.option] };
            return n;
          });
        return [
          ...prev,
          { label: newOption.label, options: [newOption.option] },
        ];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (
    nextValue: UseCreatableOptions.Option | UseCreatableOptions.Option[] | null
  ) => {
    setValue(nextValue);
    if (config.onChange) config.onChange(nextValue);
  };

  return {
    options,
    onCreateOption,
    isLoading,
    value: value as any,
    onChange,
    readOnly: isLoading,
    multiple: isMulti,
  };
}

export namespace NFormGenerator {
  export interface Option {
    label: string;
    value: any;
    __isNew__?: boolean;
  }

  export interface Group {
    label: string;
    options: Option[];
  }

  type CustomInputProps = {
    omit?: boolean;
    note?: string;
    noteClassName?: string;
    colSpan?: "col-span-2" | "col-span-3" | "col-span-4" | "col-span-full";
  };

  export type CommonInputProps = {
    label?: string;
    required?: boolean;
    requiredGroup?: string;
    defaultValue?: any;
    readOnly?: boolean;
    minLength?: number;
    maxLength?: number;
    value?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (e: { target: { value: string } }) => void;
    colSpan?: "col-span-2" | "col-span-3" | "col-span-4" | "col-span-full";
    className?: string;
    buttons?: { name?: string; Icon?: React.ReactNode; onClick: () => void }[];
  } & CustomInputProps;

  export type DocumentInputProps = {
    name: string;
    type: "BaseFileUpload" | "Document" | "PhotoCopy";
    multiple?: boolean;
    accept?: string;
    onDelete?: (id: string) => Promise<any>;
    isDeleting?: boolean;
    errorDeleting?: string | null;
    onDownloadFile?: (link: string, name: string) => void;
    link?:
      | { name: string; path: string; download?: string }
      | { name: string; path: string; download?: string }[];
  } & CommonInputProps;

  export type DateRangeProps = {
    key: string;
    type: "DateRange";
    toMax?: string;
    toMin?: string;
    fromMax?: string;
    fromMin?: string;
    fromDate: Omit<DateProps, "type">;
    toDate: Omit<DateProps, "type">;
    onChange?: ({ from, to }: { from: string; to: string }) => void;
  } & CustomInputProps;

  export type TimeRangeProps = {
    key: string;
    type: "TimeRange";
    fromTime: Omit<DateProps, "type">;
    toTime: Omit<DateProps, "type">;
    readOnly?: boolean;
    onChange?: ({ from, to }: { from: string; to: string }) => void;
  } & CustomInputProps;

  export type DateProps = {
    type: "Date";
    name: string;
    label?: string;
    required?: boolean;
    defaultValue?: any;
    min?: string;
    max?: string;
    noOfDaysFromToday?: boolean;
  } & CommonInputProps;

  export type DateTimeProps = {
    type: "DateTime";
    name: string;
    label?: string;
    required?: boolean;
    defaultValue?: any;
    min?: string;
    max?: string;
  } & CommonInputProps;

  export type TimeProps = {
    type: "Time";
    name: string;
    label?: string;
    required?: boolean;
    defaultValue?: any;
    min?: string;
    max?: string;
  } & CommonInputProps;

  export type MoneyProps = {
    type: "Money";
    name: string;
    value?: number;
    max?: number;
    min?: number;
  } & Omit<CommonInputProps, "value">;

  export type CustomProps = {
    type: "Custom";
    Component: (
      Props: Omit<
        CustomProps & {
          onSelectInputChange?: (name: string, value: any) => void;
        },
        "Component"
      > & { id: string }
    ) => React.ReactElement;
  } & CommonInputProps;

  export type CreatableProps = {
    type: "Creatable";
    name: string;
    defaultCount?: number;
    indexed?: boolean;
    indexPrefix?: string;
    defaultValue?: any[];
    readOnly?: boolean;
    creatableProps: NFormGenerator.InputProps & { name: string };
  } & Omit<CommonInputProps, "defaultValue">;

  export type NumberProps = {
    type: "Number";
    name: string;
    min?: number;
    max?: number;
  } & CommonInputProps;

  export type SelectProps = {
    type: "Select";
    name: string;
    multiple?: boolean;
    isClearable?: boolean;
    options: (Option | Group)[];
    value?: Option | null;
    maxMenuHeight?: number;
    onChange?: (
      newValue: Option | null,
      actionMeta: ActionMeta<unknown>
    ) => void;
    isOptionDisabled?: (option: unknown, selectValue: Option) => boolean;
  } & Omit<CommonInputProps, "value" | "onChange">;

  export type SelectCreatableProps = {
    type: "SelectCreatable";
    onCreateOption?: (inputValue: string) => void;
  } & Omit<SelectProps, "type">;

  export type AsyncSelectProps = {
    type: "AsyncSelect";
    loadOptions: (
      inputValue: string,
      callback: (result: SelectProps["options"]) => void
    ) => void;
    defaultOptions?: (Option | Group)[];
  } & Omit<SelectProps, "type" | "options">;

  export type AsyncSelectCreatableProps = {
    type: "AsyncSelectCreatable";
    onCreateOption?: (inputValue: string) => void;
    loadOptions: (
      inputValue: string,
      callback: (result: SelectProps["options"]) => void
    ) => void;
    defaultOptions?: (Option | Group)[];
  } & Omit<SelectProps, "type" | "options">;

  export type BooleanProps = {
    name: string;
    type: "Boolean";
    blank?: boolean;
    value?: boolean;
    trueLabel?: string;
    falseLabel?: string;
    onChange?: (value: boolean) => void;
  } & Omit<CommonInputProps, "value" | "onChange">;

  export type CheckboxProps = {
    type: "Checkbox";
    name: string;
    createable?: boolean;
    defaultValue?: string[];
    options?: (Option & { disabled?: boolean; required?: boolean })[];
  } & Omit<CommonInputProps, "value">;

  export type TextareaProps = {
    name: string;
    type: "Textarea";
    cols?: number;
    rows?: number;
  } & CommonInputProps;

  export type RadioProps = {
    name: string;
    type: "Radio";
    defaultValue?: NFormGenerator.Option;
    value?: NFormGenerator.Option;
    onChange?: (value: NFormGenerator.Option | null) => void;
    options: NFormGenerator.Option[];
    wrapperClassName?: string;
  } & Omit<CommonInputProps, "value" | "onChange">;

  export type StarRatingProps = {
    name: string;
    type: "StarRating";
    defaultValue?: number;
    value?: number;
    onChange?: (value: number) => void;
    max: number;
    min?: number;
  } & Omit<CommonInputProps, "value" | "onChange">;

  export type InputProps =
    | ({
        type:
          | "Hidden"
          | "Any"
          | "Password"
          | "Alpha"
          | "AlphaWithSpace"
          | "Numeric"
          | "AlphaWithSpaceAndNumbers"
          | "Decimal"
          | "Alphanumeric"
          | "PanNumber"
          | "Email"
          | "IFSC";
        name: string;
      } & CommonInputProps)
    | SelectProps
    | DocumentInputProps
    | DateRangeProps
    | DateProps
    | MoneyProps
    | TimeProps
    | TimeRangeProps
    | CustomProps
    | CreatableProps
    | NumberProps
    | SelectCreatableProps
    | AsyncSelectProps
    | AsyncSelectCreatableProps
    | BooleanProps
    | CheckboxProps
    | TextareaProps
    | DateTimeProps
    | RadioProps
    | StarRatingProps;

  export type Columns =
    | "grid-cols-1"
    | "grid-cols-2"
    | "grid-cols-3"
    | "grid-cols-4"
    | "grid-cols-5"
    | "grid-cols-6";

  export type Gap =
    | "none"
    | "gap-1"
    | "gap-2"
    | "gap-4"
    | "gap-6"
    | "gap-8"
    | "gap-9"
    | "gap-10"
    | "gap-11"
    | "gap-12";

  export type FormGeneratorControllerConfig = React.PropsWithChildren<{
    onChange?: (current: Record<string, any>) => void;
    onSubmit?: (formData: FormData) => void;
    onSubmitEvent?: (e: React.FormEvent<HTMLFormElement>) => void;
    heading?: string;
    submitText?: string;
    submitError?: string | null;
    readonly?: boolean;
    isSubmitting?: boolean;
    isSubmitDisabled?: boolean;
    hideSubmit?: boolean;
    extraButtons?: {
      name: string;
      className?: string;
      onClick: () => void;
      disabled?: boolean;
    }[];
    onExport?: (data: Record<string, any>) => void;
    gap?: Gap;
    formClassName?: string;
    buttonsWrapperClassName?: string;
  }>;

  export interface Config<GroupNames extends string = string> {
    title?: string;
    groupColumns?: Columns;
    columns?: Columns;
    isResponsive?: boolean;
    gap?: Gap;
    groupGap?: Gap;
    margin?: "m-2" | "m-4" | "m-6" | "m-8";
    labelStyle?: "title" | "subtitle";
    titleStyle?: "heading" | "subheading";
    onSubmit?: (formData: FormData) => void;
    onExport?: (data: Record<string, any>) => void;
    submitText?: string;
    isSubmitting?: boolean;
    isSubmitDisabled?: boolean;
    hideSubmit?: boolean;
    readonly?: boolean;
    submitError?: string | null;
    inputs: Record<GroupNames, NFormGenerator.InputProps[]>;
    expand?: boolean;
    maxColumnWidth?:
      | "max-w-[200px]"
      | "max-w-[300px]"
      | "max-w-[400px]"
      | "max-w-[500px]"
      | "max-w-[600px]"
      | "max-w-[700px]"
      | "max-w-[800px]"
      | "max-w-[900px]";
    maxFormWidth?:
      | "max-w-[200px]"
      | "max-w-[300px]"
      | "max-w-[400px]"
      | "max-w-[500px]"
      | "max-w-[600px]"
      | "max-w-[700px]"
      | "max-w-[800px]"
      | "max-w-[900px]";
    noHeaders?: boolean;
    extraButtons?: { name: string; className?: string; onClick: () => void }[];
    groupColSpan?: {
      [P in GroupNames]?: "col-span-2" | "col-span-3" | "col-span-4";
    };
    onChange?: (data: Record<string, any>) => void;
    hideColumn?: string[];
  }

  export type Options =
    | {
        label: string;
        value: string;
      }[]
    | {
        label: string;
        options: {
          value: string;
          label: string;
        }[];
      }[];

  export const Input = Field;
}

const getDefaultSelectProps = (props: any) => ({
  placeholder: "",
  maxMenuHeight: 200,
  styles: {
    control: (baseStyles: any) => ({
      ...baseStyles,
      ...props.style,
      boxShadow: "none",
      borderColor: "lightgray !important",
      minHeight: 0,
      borderRadius: 0,
      borderStyle: "none",
      borderBottomStyle: "solid",
    }),
    menu: (base: any) => ({ ...base, zIndex: 41, fontSize: "14px" }),
    valueContainer: (base: any) => ({ ...base, fontSize: "16px", padding: 2 }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: 0,
      paddingInline: 4,
    }),
    input: (base: any) => ({ ...base, margin: 0, padding: 0 }),
    singleValue: (base: any) => ({
      ...base,
      color: props.readOnly ? "darkslategray" : base.color,
    }),
    multiValue: (base: any) => ({
      ...base,
      color: props.readOnly ? "darkslategray" : base.color,
    }),
    option: (base: any, props: any) => ({
      ...base,
      padding: 4,
      backgroundColor: props.isSelected ? "#6CB5E6" : base.backgroundColor,
    }),
    placeholder: (base: any) => ({ ...base, fontSize: "12px" }),
    indicatorSeparator: (base: any) => ({ display: "none" }),
  },
  theme: (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "black",
    },
  }),
  isMulti: !!props.multiple,
  ...props,
  className: "!outline-none w-full",
  isDisabled: props.disabled || props.readOnly,
});

function prepareComponentProps(
  inputProps: any,
  type: NFormGenerator.InputProps["type"]
) {
  const next = { ...inputProps };
  if (
    type === "SelectCreatable" ||
    type === "Select" ||
    type === "AsyncSelect" ||
    type === "Custom" ||
    type === "Creatable" ||
    type === "AsyncSelectCreatable"
  )
    return next;
  delete (next as any)["onSelectInputChange"];
  return {
    ...next,
    defaultValue: next.defaultValue === null ? "" : next.defaultValue,
  };
}
