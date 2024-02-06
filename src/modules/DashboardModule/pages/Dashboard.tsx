import { FullscreenInnerLayoutButton } from "../../../coremodules/InnerLayout";
import CreateCustomerWidget from "../components/CreateCustomerWidget";

const DATE = new Date().toDateString();

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col m-4 gap-2 h-full">
      <div className="flex items-center mb-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Dashboard Overview</h1>
          <p className="text-gray font-bold text-sm">{DATE}</p>
        </div>
        <FullscreenInnerLayoutButton className="mb-auto mt-[2px] transition hover:text-primary text-gray-dark" />
      </div>
      <div className="flex flex-col xl:flex-row gap-4 h-full">
        <div className="flex-[2]">
          <div className="auto-grid">
          <CreateCustomerWidget/>
          </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
