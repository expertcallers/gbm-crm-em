import PageLayout from "../../../coremodules/PageLayout";
import CallsPerformanceWidget from "../components/CallsPerformanceWidget";
import EmailPerformanceWidget from "../components/EmailPerformanceWidget";
import UpdateAgentPerformanceWidget from "../components/UpdateAgentPerformanceWidget";

export default function Overview() {
  return (
    <PageLayout>
      <div className="auto-grid m-4">
        <UpdateAgentPerformanceWidget className="widget-wrapper" />
        <EmailPerformanceWidget className="widget-wrapper" />
        <CallsPerformanceWidget className="widget-wrapper" />
      </div>
    </PageLayout>
  );
}
