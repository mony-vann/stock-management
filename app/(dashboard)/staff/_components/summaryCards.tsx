import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

const SummaryCards = ({ totalStaffs, activeStaffs, recentLogs }: any) => {
  console.log(totalStaffs, activeStaffs, recentLogs);
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-4">
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staffs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaffs} Staffs</div>
          <p className="text-xs text-muted-foreground">2 males and 4 females</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Currently Clock-in Staffs
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStaffs} Staffs</div>
          <p className="text-xs text-muted-foreground">2 males</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Attendance Logs
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentLogs} Logs</div>
          <p className="text-xs text-muted-foreground">
            2 check-ins & 3 check-outs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
