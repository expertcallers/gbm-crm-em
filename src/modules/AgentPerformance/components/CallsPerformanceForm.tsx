import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useCallsPerformanceForm } from "../query/useCallsPerformanceForm";

export default function CallsPerformanceForm(props: any) {
  const request = useCallsPerformanceForm();

  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Update Calls performance",
      content: "Are you sure you want to update the agent's call performance?",
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
        title="Update agents calls performance"
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
              name: "Connected_calls",
              type: "Number",
            },
            {
              name: "Non_connect",
              type: "Number",
            },
            {
              name: "Total_Dialled_count",
              type: "Number",
            },
          ],
        }}
      />
    </div>
  );
}
