import React, { useCallback } from "react";
import usePermission from "../../../hooks/usePermission";
import { ClearFilter, QueryExport, useQueryBuilder } from "../../../helper";
import useModal from "../../../hooks/useModal";
import { Datatable, useDatatable } from "@jjmyers/datatable";
import Button from "../../../coremodules/Button";
import PageLayout from "../../../coremodules/PageLayout";
import AutoHeight from "../../../coremodules/AutoHeight";

import EditCustomerForm from "../components/EditCustomerForm";
import { useGetAllCustomers } from "../query/useGetAllCustomers";

const AllCustomers: React.FC = () => {
  const permissions = usePermission();
  const [query, setFilter] = useQueryBuilder();
  const request = useGetAllCustomers();
  const editcustomer = useModal({ Component: EditCustomerForm });

  const { Datatable, ...controller } = useDatatable({
    data: request.data ?? [],
    onFilter: setFilter,
    columns: [
      { field: "name", columnName: "Customer", filterable: false },
      { field: "contact", columnName: "Phone Number", filterable: false },
      { field: "email", columnName: "Email", filterable: false },
      { field: "company_name", columnName: "Company", filterable: false },
    ],
  });

  const RowOptionMenu = useCallback(
    (result: Datatable.RowOptionMenuProps<Customer>) => {
      const { row } = result;
      return (
        <>
          <Button
            text="Edit customer"
            alignLeft
            borderLess
            onClick={() => editcustomer.show(row)}
            theme="white"
          />
        </>
      );
    },
    [permissions]
  );

  const AppsPanel = useCallback(
    ({ OmitColumns }: Datatable.AppsPanelProps) => {
      return (
        <>
          <ClearFilter controller={controller} />
          <QueryExport
            fileName="All customers"
            query={query}
            count={request.data?.length}
            fetchData={request.makeRequest}
          />
          <span className="h-[1px] w-full bg-gray-lighter" />
          {OmitColumns}
        </>
      );
    },
    [request]
  );

  return (
    <PageLayout request={request}>
      <AutoHeight>
        <Datatable
          isFetching={request.isFetching || request.isPending}
          showOptionsOnRowClick
          AppsPanel={AppsPanel}
          RowOptionMenu={RowOptionMenu}
          columnNameFontSize={16}
          {...controller}
        />
      </AutoHeight>
      {editcustomer.Modal}
    </PageLayout>
  );
};

export default AllCustomers;
