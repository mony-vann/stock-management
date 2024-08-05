import { getReports } from "@/actions/reportActions";
import ReportTable from "./_components/reportTable";

const ReportPage = async () => {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear().toString();
  const reports = await getReports(currentMonth, currentYear);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-5 md:pl-20">
      <ReportTable reports={reports} />
    </div>
  );
};

export default ReportPage;
