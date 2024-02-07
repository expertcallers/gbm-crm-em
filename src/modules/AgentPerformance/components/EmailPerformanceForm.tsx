import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useEmailPerformanceForm } from "../query/useEmailPerformanceForm";

export default function EmailPerformanceForm(props: any) {
  const request = useEmailPerformanceForm();

  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Update email performance",
      content: "Are you sure you want to update the agent's email performance?",
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
        title="Update agents email performance"
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
              name: "Unique_email",
              type: "Number",
            },
            {
              name: "Follow_up",
              type: "Number",
            },
            {
              name: "Agent_Replies",
              type: "Number",
            },
            {
              name: "Client_response_received",
              type: "Number",
            },
            {
              name: "Total_Emails",
              type: "Number",
            },
          ],
        }}
      />
    </div>
  );
}
