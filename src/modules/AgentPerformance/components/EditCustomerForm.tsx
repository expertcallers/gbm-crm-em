import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { UseModal } from "../../../hooks/useModal";
import { useEditCustomerForm } from "../query/useEditCustomerForm";

export default function EditCustomerForm(
  props: UseModal.ModalComponentProps<any>
) {
  const request = useEditCustomerForm();
  const onSubmit = async (formData: FormData,) => {
    alert({
      title: "Edit Customer",
      content: "Are you sure you want to edit customer?",
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
        title="Edit Customer"
        noHeaders
        inputs={{
          "": [
            {
              name: "name",
              type: "AlphaWithSpace",
            },
            {
              name: "contact",
              type: "Number",
              defaultValue: props.contact,
              readOnly: true,
            },
            {
              name: "email",
              type: "Email",
              defaultValue: props.email,
              readOnly: true,
            },
            {
              name: "company_name",
              type: "AlphaWithSpace",
            },
          ],
        }}
      />
    </div>
  );
}
