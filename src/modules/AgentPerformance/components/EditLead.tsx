import { alert } from "../../../coremodules/AlertContainer";
import FormGenerator from "../../../coremodules/FormGenerator";
import { UseModal } from "../../../hooks/useModal";
import { useEditLead } from "../query/useEditLead";


export default function EditLead(props: UseModal.ModalComponentProps<any>) {
  const request = useEditLead();
  const onSubmit = async (formData: FormData) => {
    alert({
      title: "Edit Lead",
      content: "Are you sure you want to edit Lead?",
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
              name: "customer_name",
              type: "AlphaWithSpace",
              defaultValue: props.customer_name,
              readOnly: true,
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
