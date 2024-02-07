import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useLeadForm } from "../query/useLeadForm";

export default function LeadForm(props: any) {
  const request = useLeadForm();

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
              name: "customer",
              type: "AlphaWithSpace",
            },

            {
              name: "status",
              type: "Select",
              options: [
                { value: "selected", label: "Selected" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
