import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { useCustomerForm } from "../query/useCustomerForm";

export default function CustomerForm(props: any) {
  const request = useCustomerForm();

  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Create Customer",
      content: "Are you sure you want to create a customer?",
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
        title="Create Customer"
        noHeaders
        inputs={{
          "": [
            {
              name: "customer",
              type: "AlphaWithSpace",
            },
            {
              name: "phone_number",
              type: "Number",
            },
            {
              name: "email",
              type: "Email",
            },
            {
              name: "company",
              type: "AlphaWithSpace",
            },
          ],
        }}
      />
    </div>
  );
}
