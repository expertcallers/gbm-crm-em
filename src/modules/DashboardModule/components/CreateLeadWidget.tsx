import React from "react";
import useModal from "../../../hooks/useModal";
import WidgetDescriptive from "../../../coremodules/WidgetDescriptive";
import LeadForm from "./LeadForm";

type Props = {
  className?: string;
};
const CreateLeadWidget: React.FC<Props> = ({ className }) => {
  const createLead = useModal({
    Component: LeadForm,
    maxWidth: "500px",
  });

  return (
    <>
      <WidgetDescriptive
        wrapperClassname={className}
        title="Create Lead"
        description="
        To create a lead, provide relevant personal and contact details in the system's interface, ensuring accuracy and completeness to facilitate effective communication and service delivery."
        buttons={[
          {
            text: "Create",
            onClick: () => createLead.show(),
          },
        ]}
      />
      {createLead.Modal}
    </>
  );
};

export default CreateLeadWidget;
