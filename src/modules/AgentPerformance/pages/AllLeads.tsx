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
  const { data, isLoading, isError } = request;

  const editLead = useModal({ Component: EditLeadForm });

  const { Datatable, ...controller } = useDatatable({
    data:request.data,
    count: request.data?.count,
    onFilter: setFilter,

    columns: [
      { field: "name" },
      { field: "contact" },
      { field: "email" },
      { field: "company_name" },
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
