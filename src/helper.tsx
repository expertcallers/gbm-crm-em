import { useEffect, useRef, useState } from "react";
import { Datatable } from "@jjmyers/datatable";
import FormGenerator from "./coremodules/FormGenerator";
import useFetch from "./hooks/useFetch";
import Button from "./coremodules/Button";
import useDownloadJSON from "./hooks/useDownloadJSON";
import useModalController from "./hooks/useModalController";

const TIMEZONE_OFFSET = getTimezoneOffsetString();

type Operations =
  | Datatable.UseOperationFilter.RangeFilterOperations
  | Datatable.UseOperationFilter.BooleanFilterOperations
  | Datatable.UseOperationFilter.TextFilterOperations;

export function useQueryBuilder(options?: {
  initialFilter?: Partial<Datatable.Filter<any>>;
  booleanSetFilters?: Record<string, { isTrue: string; isFalse: string }>;
}): [query: string, setFilter: (filter: Datatable.Filter<any>) => void] {
  const [query, setQuery] = useState("");

  function createOperationField(field: string, operation: Operations) {
    const op: Record<Operations, string> = {
      "Greater than": `${field}__gt`,
      "Greater than or equal": `${field}__gte`,
      "Less than": `${field}__lt`,
      "Less than or equal": `${field}__lte`,
      "Not equal": `${field}__ne`,
      Equal: field,
      "Is blank": `${field}__isnull`,
      "Not blank": `${field}__isnull`,
      "Starts with": `${field}__istartswith`,
      "Ends with": `${field}__iendswith`,
      Contains: `${field}__icontains`,
      In: `${field}__in`,
      "Is false": field,
      "Is true": field,
    };
    return op[operation];
  }

  function handleFilterByField(operation: Operations, value?: string) {
    if (
      !["Is blank", "Is false", "Is true", "Not blank"].includes(operation) &&
      !value
    )
      return null;
    const filterValue =
      operation === "Is blank"
        ? true
        : operation === "Not blank"
        ? false
        : operation === "Is false"
        ? false
        : operation === "Is true"
        ? true
        : value;

    return filterValue;
  }

  useEffect(() => {
    options?.initialFilter && setFilter(options.initialFilter as any);
  }, []);

  function handleOperationValue(
    operation: Datatable.AllOperations,
    value: any
  ) {
    if (typeof value === "string") {
      if (operation === "In") return value.split(",");
      if (!!value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/))
        return `${value}${TIMEZONE_OFFSET}`;
    }
    return value;
  }

  const setFilter = (filter: Datatable.Filter<any>) => {
    const searchParams = new URLSearchParams();

    const page = filter.page?.currentPage;
    const page_size = filter.page?.currentRowsPerPage;

    if (page) searchParams.append("page", page.toString());
    if (page_size) searchParams.append("page_size", page_size.toString());

    const sortOrder: any = filter.sortOrder ?? {};
    const sortedData = Object.keys(sortOrder).sort(
      (a, b) => sortOrder[a].orderIndex - sortOrder[b].orderIndex
    );
    const sort = sortedData.map((key) => sortOrder[key].sortDirection);
    const sort_field = sortedData;

    if (
      sort.length > 0 &&
      sort_field.length > 0 &&
      sort_field.length === sort.length
    ) {
      searchParams.append("sort", JSON.stringify(sort));
      searchParams.append("sort_field", JSON.stringify(sort_field));
    }

    const search: { search: string | null; search_fields: string[] } = {
      search: null,
      search_fields: [],
    };

    const filter_by: Record<string, any> = {};
    const and_fields: Record<string, any> = {};
    const or_fields: Record<string, any> = {};

    const setFilters = Object.entries(filter.setFilter ?? {});

    for (let i = 0; i < setFilters.length; i++) {
      const [field, selected] = setFilters[i];
      if (selected && selected.isAll) continue;
      if (options?.booleanSetFilters && options.booleanSetFilters[field]) {
        if (selected?.include?.length === 0) continue;
        const value = options.booleanSetFilters[field];
        const isTrue = selected?.include
          ?.map((s) => s.toLocaleLowerCase())
          ?.includes(value.isTrue.toLocaleLowerCase());
        const operation = isTrue ? "Is true" : "Is false";
        filter_by[createOperationField(field, operation)] =
          handleOperationValue(operation, isTrue);
        continue;
      }
      if (selected) filter_by[`${field}__in`] = selected.include;
    }

    const filters = Object.entries(filter.operationFilter ?? {});

    for (let i = 0; i < filters.length; i++) {
      const [field, ops] = filters[i];
      const { operation, and, or, value } =
        ops as Datatable.UseOperationFilter.OperationValue<Operations>;

      const filterValue = handleFilterByField(operation, value);
      if (typeof filterValue !== "undefined" && filterValue !== null)
        filter_by[createOperationField(field, operation)] =
          handleOperationValue(operation, filterValue);

      if (and) {
        const andValue = handleFilterByField(and.operation, and.value);
        if (typeof andValue !== "undefined" && andValue !== null)
          and_fields[createOperationField(field, and.operation)] =
            handleOperationValue(and.operation, andValue);
      }

      if (or) {
        const orValue = handleFilterByField(or.operation, or.value);
        if (typeof orValue !== "undefined" && orValue !== null)
          or_fields[createOperationField(field, or.operation)] =
            handleOperationValue(or.operation, orValue);
      }
    }

    searchParams.set("search", JSON.stringify(search.search));
    searchParams.set("search", JSON.stringify(search.search));
    searchParams.set("search_fields", JSON.stringify(search.search_fields));
    searchParams.set("filter_by", JSON.stringify(filter_by));
    searchParams.set("and_fields", JSON.stringify(and_fields));
    searchParams.set("or_fields", JSON.stringify(or_fields));

    if (!search.search) searchParams.delete("search");
    if (!search.search) searchParams.delete("search");
    if (search.search_fields.length === 0) searchParams.delete("search_fields");
    if (Object.keys(filter_by).length === 0) searchParams.delete("filter_by");
    if (Object.keys(and_fields).length === 0) searchParams.delete("and_fields");
    if (Object.keys(or_fields).length === 0) searchParams.delete("or_fields");

    setQuery(searchParams.toString());
  };

  const debounceSetFilter = useDebounce(setFilter, 500);

  return [query, debounceSetFilter];
}

interface QueryExportConfig {
  fileName: string;
  query: string;
  count?: number;
  fetchData: (
    fetch: ReturnType<typeof useFetch>,
    query: string
  ) => Promise<any>;
}

export function QueryExport(config: QueryExportConfig) {
  const { fileName, query, count, fetchData } = config;

  const { Modal, ...controller } = useModalController();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [maxPage, setMaxPage] = useState(Math.ceil((count ?? 0) / pageSize));
  const fetch = useFetch();
  const downloadJSON = useDownloadJSON();

  async function onDownloadExcel(formData: FormData) {
    setIsLoading(true);
    try {
      const page = Number(formData.get("page"));
      const page_size = Number(formData.get("page_size") ?? 2000);
      const searchParams = new URLSearchParams(query);
      searchParams.set("page_size", page_size.toString());
      searchParams.set("page", page.toString());
      const pageQuery = searchParams.toString();
      const response = await fetchData(fetch, pageQuery);
      downloadJSON.downloadAsExcel(response?.results ?? [], fileName);
    } catch (error: any) {
      setError(
        typeof error === "string"
          ? error
          : typeof error?.message === "string"
          ? error?.message
          : "Something went wrong."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function onPageSizeChange(e: any) {
    const nextPageSize = Number(e.target.value ?? 1000);
    const nextMaxPage = Math.ceil((count ?? 0) / nextPageSize);
    setPageSize(nextPageSize);

    if (nextMaxPage === Infinity) {
      setMaxPage(0);
      return;
    }
    setMaxPage(nextMaxPage);
  }

  return (
    <>
      <Button
        disabled={count === 0}
        text="Export"
        alignLeft
        borderLess
        onClick={controller.show}
        theme="white"
      />
      {/* @ts-ignore */}
      <Modal
        {...controller}
        dialogClassName="!h-fit min-w-[250px]"
        className="w-[250px]"
      >
        <FormGenerator
          submitText="Export"
          onSubmit={onDownloadExcel}
          isSubmitting={isLoading}
          submitError={error}
          inputs={{
            "Export Data": [
              {
                type: "Number",
                name: "page",
                note: `Max page ${maxPage}`,
                max: maxPage,
                noteClassName: "!text-rose",
                value: page.toString(),
                onChange: (e) => setPage(Number(e.target.value ?? 1)),
                min: 1,
              },
              {
                type: "Number",
                name: "page_size",
                onChange: onPageSizeChange,
                value: pageSize.toString(),
                min: 1,
                max: 2000,
                label: "No. of Records",
              },
            ],
          }}
        />
      </Modal>
    </>
  );
}

type CallbackFunction<T> = (value: T) => void;

function useDebounce<T>(
  callback: CallbackFunction<T>,
  delay: number
): CallbackFunction<T> {
  const firstCall = useRef(true);
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    if (value && firstCall.current) {
      firstCall.current = false;
      callback(value as T);
      return;
    }

    const timer = setTimeout(() => {
      value && callback(value as T);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [callback, value, delay]);

  return setValue;
}

export const ClearFilter = (props: any) => {
  const { controller } = props;

  return (
    <>
      <Button
        text="Reset Filter"
        alignLeft
        borderLess
        onClick={() => controller.reset(true)}
        theme="white"
      />
      <Button
        text="Clear Filter"
        alignLeft
        borderLess
        onClick={() => controller.reset()}
        theme="white"
      />
    </>
  );
};

function getTimezoneOffsetString() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes < 0 ? "+" : "-";

  const formattedOffset = `${offsetSign}${offsetHours
    .toString()
    .padStart(2, "0")}:${offsetMinutesRemainder.toString().padStart(2, "0")}`;

  return formattedOffset;
}
