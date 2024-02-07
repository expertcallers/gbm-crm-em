import { useCallback } from "react";
import usePredefined from "../../../hooks/usePredefined";
import usePermission from "../../../hooks/usePermission";
import { ClearFilter, QueryExport, useQueryBuilder } from "../../../helper";
import useModal from "../../../hooks/useModal";
import { Datatable, useDatatable } from "@jjmyers/datatable";
import Button from "../../../coremodules/Button";
import PageLayout from "../../../coremodules/PageLayout";
import AutoHeight from "../../../coremodules/AutoHeight";
import EditLeadForm from "../components/EditLeadForm";
import { useGetAllLeads } from "../query/useGetAllLeads";

const AllLeads: React.FC = () => {
  const predefined = usePredefined();
  const permissions = usePermission();
  const [query, setFilter] = useQueryBuilder();
  const request = useGetAllLeads(query);

  const editLead = useModal({ Component: EditLeadForm });

  const { Datatable, ...controller } = useDatatable({
    data: request.data?.results,
    count: request.data?.count,
    onFilter: setFilter,
    initialSortOrder: { created_at: { orderIndex: 1, sortDirection: "desc" } },
    columns: [
      // {
      //   field: "created_by_name",
      //   columnName: "Created By",
      //   width: 250,
      //   renderCell: (val, col, row) => (
      //     <EmployeeDisplayName id={row.created_by_emp_id} name={val} />
      //   ),
      // },

      { field: "Employee" },
      { field: "date", datatype: "date" },
      { field: "leads_mined", datatype: "number", filterable: false },
      { field: "Leads created (ZOHO)", datatype: "number", filterable: false },
      { field: "Prospect created", datatype: "number", filterable: false },
      { field: "Nomination received", datatype: "number", filterable: false },
      { field: "Doc collected", datatype: "number", filterable: false },
      { field: "Shortlisted", datatype: "number", filterable: false },
      { field: "Negotation", datatype: "number", filterable: false },
      { field: "Invoice", datatype: "number", filterable: false },
      { field: "Sales", datatype: "number", filterable: false },
    ],
  });

  const RowOptionMenu = useCallback(
    (result: Datatable.RowOptionMenuProps<Asset>) => {
      const { row } = result;
      return (
        <>
          <Button
            text="Edit Asset"
            alignLeft
            borderLess
            onClick={() => editLead.show(row)}
            // hidden={!permissions.isAllowed("AssetManagement:EditAsset")}
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
            count={request.data?.count}
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
