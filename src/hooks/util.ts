import dayjs from "dayjs";
import { ToWords } from "to-words";
import { toast } from "react-toastify";
import female from "../assets/female.png";

const parseShortForm = (
  shortForms: [string | number, string][],
  value?: string | number,
  convertTo: "any" | "key" | "value" = "any"
): string => {
  if (typeof value === "undefined") return "-";
  try {
    const sVal = `${value}`;
    if (sVal.includes(","))
      return sVal
        .split(",")
        .map((s) => parseShortForm(shortForms, s))
        .join();
    for (let i = 0; i < shortForms.length; i++) {
      const [k, v] = shortForms[i];
      if (convertTo === "any") {
        if (`${k}` === sVal) return v;
        if (v.toLowerCase() === sVal.toLowerCase()) return `${k}`;
      }
      if (convertTo === "key") if (`${k}` === sVal) return v;
      if (convertTo === "value")
        if (v.toLowerCase() === sVal.toLowerCase()) return `${k}`;
    }
  } catch (error) {
    console.error("parseShortForm", error);
  }
  return "-";
};

const valueGetter = {
  date: (cell: any, field: string) =>
    cell.data && cell.data[field]
      ? new Date(cell.data[field]).toLocaleString()
      : "-",
};

const NO_PHOTO = require("../assets/female.png");

const handleFormEntry = (
  data: FormData,
  key: string,
  parser?: (value: string) => any
) => {
  const value = data.get(key);
  if (!value || (typeof value === "string" && value.length === 0))
    return data.delete(key);
  if (typeof value === "object" && value.size === 0) return data.delete(key);
  if (parser && typeof value === "string") return data.set(key, parser(value));
  data.set(key, value);
};

const booleanToYesNo = (value?: boolean) =>
  typeof value === "undefined" || value === null
    ? undefined
    : value
    ? "Yes"
    : "No";

const yesNoToBoolean = (value: FormDataEntryValue | null) =>
  String(
    {
      yes: 1,
      no: 0,
    }[typeof value === "string" ? value.toLowerCase() : ""]
  );

const debounce = <T>(callback: (...args: any[]) => T, delay = 1000) => {
  let time: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const toDateTime = (date?: string) =>
  !date
    ? "-"
    : new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
const toReadableDateTime = (date?: string) =>
  !date
    ? "-"
    : new Date(date).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });
const toReadableDate = (date?: string) =>
  !date
    ? "-"
    : new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

const toFullName = (data?: any) => {
  if (
    !data ||
    (data.first_name?.length === 0 &&
      data.middle_name?.length === 0 &&
      data.last_name?.length === 0)
  )
    return "-";
  return `${data.first_name ?? ""}${
    data.middle_name ? ` ${data.middle_name} ` : " "
  }${data.last_name ?? ""}`;
};

const groupManyByDay = <T>(
  arr: T[][],
  key: (keyof T)[],
  dateParser: (date: string) => string
) => {
  const result = arr;

  return result.reduce((groups, c, gi) => {
    for (let i = 0; i < c.length; i++) {
      const element = c[i];
      const day = dateParser(element[key[gi]] as string);
      groups[day] = [...(groups[day] ?? []), element];
    }
    return groups;
  }, {} as { [day: string]: any[] });
};

const formToObject = <T>(
  form: FormData,
  options?: { removeEmptyValues?: boolean }
) => {
  const data: T = {} as any;
  const entries = form.entries() as IterableIterator<[keyof T, T[keyof T]]>;
  for (const [key, value] of entries) {
    if (options?.removeEmptyValues && value === "") continue;
    data[key] = value;
  }
  return data;
};

const millisecondsFromNow = (date?: string, useAbs?: boolean) =>
  !date
    ? -1
    : useAbs
    ? Math.abs(+new Date(date) - +new Date())
    : +new Date(date) - +new Date();

const addStarIfRequired = (label: string, required?: boolean) =>
  required ? `*${label}` : label;

const select = {
  valueToObject: (value: any, predefined: [any, string][]) => {
    const found = predefined.find(([v]) => v === value);
    if (!found || !found[0] || !found[1]) return undefined;
    return { value: found[0], label: found[1] };
  },
  predefinedToObject: (
    predefined?: [any, string][],
    addEmptyValue?: boolean
  ) => {
    const result: { value: any; label: string }[] = [];
    if (!predefined) return result;
    if (addEmptyValue) result.push({ value: "", label: "-" });
    result.push(...predefined.map(([value, label]) => ({ value, label })));
    return result;
  },
  arrayToObject: (arr?: string[]) =>
    (arr ?? []).map((value) => ({ value, label: value })),
  filteredArrayToObject: (arr: string[], filter: string[]) =>
    arr
      .filter((a) => !filter.includes(a))
      .map((value) => ({ value, label: value })),
  singleValueToObject: (
    value?: string | null
  ):
    | { value: any; label: string }
    | { value: any; label: string }[]
    | undefined => {
    if (!value) return undefined;
    if (value.includes(",")) {
      const vals = value.split(",");
      const result = [];
      for (let i = 0; i < vals.length; i++) {
        const current = vals[i];
        if (current.includes("#")) {
          const [lab, val] = current.split("#");
          result.push({ value: val, label: lab });
          continue;
        }
        result.push({ value: current, label: current });
      }
      return result;
    }
    if (value.includes("#")) {
      const [lab, val] = value.split("#");
      return { value: val, label: lab };
    }
    return { value, label: value };
  },
};

const camelCaseToSpaceSeparated = (value: string) =>
  value.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

const moneyFormatToNumber = (value: string | FormDataEntryValue | null) => {
  if (!value) return null;
  const result = Number(value.toString().replaceAll(",", ""));
  return isNaN(result) ? null : result;
};

export namespace OrgainizationTree {
  export type TeamNode<Employee extends Record<string, any>> = {
    id: string;
    _teamName: string;
    children: EmployeeNode<Employee>[];
  };

  export type EmployeeNode<Employee extends Record<string, any>> = Employee & {
    id: string;
    children: TeamNode<Employee>[] | null;
  };

  export function createTeamNode<Employee extends Record<string, any>>(
    data: Employee[],
    teams: string[]
  ): TeamNode<Employee>[] {
    return teams.map((_teamName, i) => ({
      id: `${_teamName}-${i}`,
      _teamName,
      children: data.reduce((r, c, i) => {
        if (c.team !== _teamName) return r;
        return [...r, createEmployeeNode([...data], i)];
      }, [] as EmployeeNode<Employee>[]),
    }));
  }

  function createEmployeeNode<Employee extends Record<string, any>>(
    data: Employee[],
    index: number
  ): EmployeeNode<Employee> {
    const node = data[index];
    return {
      ...node,
      id: node?.emp_id,
      children: node?.my_team
        ? createTeamNode(data, node.my_team.split(";"))
        : null,
    };
  }

  export function create<Employee extends Record<string, any>>(
    data: Employee[],
    rootIndex: number
  ) {
    if (!data) return undefined;
    return createEmployeeNode([...data], rootIndex);
  }
}

function toWords(value: number) {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
      currencyOptions: {
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });
  return toWords.convert(value);
}

function calculateCountdown(datetime: string): [
  string,
  {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }
] {
  const milliseconds = dayjs(datetime).diff(dayjs(), "millisecond");

  const days = Math.max(Math.floor(milliseconds / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(
    Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    0
  );
  const minutes = Math.max(
    Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60)),
    0
  );
  const seconds = Math.max(Math.floor((milliseconds % (1000 * 60)) / 1000), 0);

  return [
    `${days}d ${hours}h ${minutes}m ${seconds}s`,
    { days, hours, minutes, seconds, milliseconds },
  ];
}

function timeDifference(
  start: string,
  end: string
): [
  string,
  {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }
] {
  const milliseconds = dayjs(end).diff(dayjs(start), "millisecond");

  const days = Math.max(Math.floor(milliseconds / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(
    Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    0
  );
  const minutes = Math.max(
    Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60)),
    0
  );
  const seconds = Math.max(Math.floor((milliseconds % (1000 * 60)) / 1000), 0);

  return [
    `${days}d ${hours}h ${minutes}m ${seconds}s`,
    { days, hours, minutes, seconds, milliseconds },
  ];
}

function formatPhoneNumber(value: string) {
  if (!value) return "-";
  return `+91 ${value}`;
}

function getImageByGender(gender?: string) {
  if (gender === "Male") return female;
  if (gender === "Female") return female;
  return female;
}

const toastError = (key: string) => (e: any) =>
  toast.error(e, { toastId: key, updateId: key });

const toastSuccess = (key: string) => (e: any) =>
  e?.message && toast.info(e.message, { toastId: key, updateId: key });

const handleError = (result: any) => {
  if ("error" in result) return Promise.reject(result.error);
  if ("details" in result) return Promise.reject(result.details);
  if ("detail" in result) return Promise.reject(result.detail);
  return Promise.reject("Something went wrong...");
};

const numberToMoney = (val: any) => {
  if (!val) return val;
  if (typeof val !== "number") {
    if (isNaN(Number(val))) return val;
    return Number(val).toLocaleString("en-IN");
  }
  return val.toLocaleString("en-IN");
};

const isEndOfMonth = () => {
  const today = dayjs();
  const isWithinLast5Days = today.isAfter(
    today.endOf("month").subtract(5, "day")
  );
  if (today.date() === 1) return true;
  return isWithinLast5Days;
};

export default {
  isEndOfMonth,
  handleError,
  toastError,
  toastSuccess,
  getImageByGender,
  formatPhoneNumber,
  formToObject,
  yesNoToBoolean,
  booleanToYesNo,
  handleFormEntry,
  parseShortForm,
  debounce,
  toFullName,
  toDateTime,
  toReadableDate,
  toReadableDateTime,
  groupManyByDay,
  millisecondsFromNow,
  addStarIfRequired,
  camelCaseToSpaceSeparated,
  moneyFormatToNumber,
  toWords,
  calculateCountdown,
  timeDifference,
  numberToMoney,
  valueGetter,
  NO_PHOTO,
  select,
};
