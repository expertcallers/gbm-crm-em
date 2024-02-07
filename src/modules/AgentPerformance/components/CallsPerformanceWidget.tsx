import React from "react";
import useModal from "../../../hooks/useModal";
import WidgetDescriptive from "../../../coremodules/WidgetDescriptive";
import EmailPerformanceForm from "./EmailPerformanceForm";
import CallsPerformanceForm from "./CallsPerformanceForm";

type Props = {
  className?: string;
};
const CallsPerformanceWidget: React.FC<Props> = ({ className }) => {
  const email = useModal({
    Component: CallsPerformanceForm,
    maxWidth: "500px",
  });

  return (
    <>
      <WidgetDescriptive
        wrapperClassname={className}
        title="Update Calls performance"
        description="
        This process may include adjusting key performance indicators, providing constructive feedback, and implementing strategies to improve overall productivity and effectiveness of the agents."
        buttons={[
          {
            text: "Create",
            onClick: () => email.show(),
          },
        ]}
      />
      {email.Modal}
    </>
  );
};

export default CallsPerformanceWidget;
