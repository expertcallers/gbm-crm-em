import React from "react";
import useModal from "../../../hooks/useModal";
import WidgetDescriptive from "../../../coremodules/WidgetDescriptive";
import EmailPerformanceForm from "./EmailPerformanceForm";

type Props = {
  className?: string;
};
const EmailPerformanceWidget: React.FC<Props> = ({ className }) => {
  const email = useModal({
    Component: EmailPerformanceForm,
    maxWidth: "500px",
  });

  return (
    <>
      <WidgetDescriptive
        wrapperClassname={className}
        title="Update Email performance"
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

export default EmailPerformanceWidget;
