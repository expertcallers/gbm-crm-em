import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useGetAllCustomers } from "../../AgentPerformance/query/useGetAllCustomers";


import { useLeadForm } from "../query/useLeadForm";

export default function LeadForm(props: any) {
  const request = useLeadForm();
  const customers = useGetAllCustomers();
  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Create Lead",
      content: "Are you sure you want to create a lead?",
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
        isSubmitting={request.isPending}
        submitError={request.error}
        title="Create Lead"
        noHeaders
        inputs={{
          "": [
            {
              name: "customer_id",
              label: "Customer",
              type: "Select",
              options:
                customers.data?.map((v) => ({ value: v.id, label: v.name })) ??
                [],
            },
            {
              name: "status",
              type: "Select",
              options: [
                { value: "conatacted", label: "contacted" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
