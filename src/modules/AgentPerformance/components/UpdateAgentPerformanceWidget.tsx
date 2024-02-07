import React from "react";

import useModal from "../../../hooks/useModal";
import WidgetDescriptive from "../../../coremodules/WidgetDescriptive";
import UpdateAgentsPerformanceForm from "./UpdateAgentsPerformanceForm";

type Props = {
  className?: string;
};
const UpdateAgentPerformanceWidget: React.FC<Props> = ({ className }) => {
  const updateLead = useModal({
    Component: UpdateAgentsPerformanceForm,
    maxWidth: "500px",
  });

  return (
    <>
      <WidgetDescriptive
        wrapperClassname={className}
        title="Update agents performance"
        description="
        This process may include adjusting key performance indicators, providing constructive feedback, and implementing strategies to improve overall productivity and effectiveness of the agents."
        buttons={[
          {
            text: "Create",
            onClick: () => updateLead.show(),
          },
        ]}
      />
      {updateLead.Modal}
    </>
  );
};

export default UpdateAgentPerformanceWidget;
