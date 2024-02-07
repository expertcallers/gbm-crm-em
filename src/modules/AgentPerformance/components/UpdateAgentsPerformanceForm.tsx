import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useUpdateAgentsPerformanceForm } from "../query/useUpdateAgentsPerformanceForm";

export default function UpdateAgentsPerformanceForm(props: any) {
  const request = useUpdateAgentsPerformanceForm();

  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Update agent performance",
      content: "Are you sure you want to update the agent's performance?",
      buttons: [
        { text: "Cancel" },
        {
          text: "Continue",
          onClick: async () => {
            await request.mutateAsync(formData);
            props.close();
          },
        },
      ],
    });
  };

  return (
    <div className="w-full">
      <FormGenerator
        onSubmit={onSubmit}
        columns="grid-cols-2"
        isSubmitting={request.isPending}
        submitError={request.error}
        title="Update agents performance"
        noHeaders
        inputs={{
          "": [
            {
              name: "emp_ids",
              label: "Employee",
              type: "Select",
              options: [
                { value: "1", label: "suma" },
                { value: "2", label: "josh" },
              ],
            },
            {
              name: "date",
              type: "Date",
            },
            {
              name: "leads_mined",
              type: "Number",
            },
            {
              name: "leads_zoho",
              value: "Leads created (ZOHO)",
              type: "Number",
            },
            {
              name: "Prospect_created",
              value: "Prospect created",
              type: "Number",
            },
            {
              name: "Nomination_received",
              value: "Nomination received",
              type: "Number",
            },
            {
              name: "Doc_collected",
              value: "Doc collected",
              type: "Number",
            },
            {
              name: "Shortlisted",
              value: "Shortlisted",
              type: "Number",
            },
            {
              name: "Negotation",
              value: "Negotation",
              type: "Number",
            },
            {
              name: "Invoice",
              value: "Invoice",
              type: "Number",
            },
            {
              name: "Sales",
              value: "Sales",
              type: "Number",
            },
          ],
        }}
      />
    </div>
  );
}
