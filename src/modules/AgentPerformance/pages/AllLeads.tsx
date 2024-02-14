import React, { useCallback } from "react";
import usePermission from "../../../hooks/usePermission";
import { ClearFilter, QueryExport, useQueryBuilder } from "../../../helper";
import useModal from "../../../hooks/useModal";
import { Datatable, useDatatable } from "@jjmyers/datatable";
import Button from "../../../coremodules/Button";
import PageLayout from "../../../coremodules/PageLayout";
import AutoHeight from "../../../coremodules/AutoHeight";
import { useGetAllLeads } from "../query/useGetAllLeads";
import Status from "../components/Status";
import EditLead from "../components/EditLead";

const AllLeads: React.FC = () => {
  const permissions = usePermission();
  const [query, setFilter] = useQueryBuilder();
  const request = useGetAllLeads(query);
  const editLead = useModal({ Component: EditLead });

  const { Datatable, ...controller } = useDatatable({
    data: request.data ?? [],
    onFilter: setFilter,
    initialSortOrder: { created_at: { orderIndex: 1, sortDirection: "desc" } },
    columns: [
      { field: "customer_name", columnName: "Customer", filterable: false },
      { field: "customer_email", columnName: "Email", filterable: false },
      {
        field: "customer_contact",
        columnName: "Phone Number",
        filterable: false,
      },
      {
        field: "status",
        columnName: "Status",
        filterable: false,
        renderCell: (val) => <Status status={val} />,
      },
      { field: "created_at", datatype: "datetime" },
    ],
  });

  const RowOptionMenu = useCallback(
    (result: Datatable.RowOptionMenuProps<Lead>) => {
      const { row } = result;
      return (
        <>
          <Button
            text="Edit Lead"
            alignLeft
            borderLess
            onClick={() => editLead.show(row)}
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
            fileName="All Leads"
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
      {editLead.Modal}
    </PageLayout>
  );
};

export default AllLeads;
