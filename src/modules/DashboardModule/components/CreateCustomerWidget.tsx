import React from "react";
import CustomerForm from "./CustomerForm";
import useModal from "../../../hooks/useModal";
import WidgetDescriptive from "../../../coremodules/WidgetDescriptive";

type Props = {
  className?: string;
};
const CreateCustomerWidget: React.FC<Props> = ({ className }) => {
  const createCustomer = useModal({
    Component: CustomerForm,
    maxWidth: "500px",
  });

  return (
    <>
      <WidgetDescriptive
        wrapperClassname={className}
        title="Create Customer"
        description="
        To create a customer, provide relevant personal and contact details in the system's interface, ensuring accuracy and completeness to facilitate effective communication and service delivery."
        buttons={[
          {
            text: "Create",
            onClick: () => createCustomer.show(),
          },
        ]}
      />
      {createCustomer.Modal}
    </>
  );
};

export default CreateCustomerWidget;
