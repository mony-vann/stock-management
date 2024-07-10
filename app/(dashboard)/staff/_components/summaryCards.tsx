import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

const SummaryCards = ({
  totalStaffs,
  activeStaffs,
  staffWithMostLates,
}: any) => {
  const sexCountTotal = totalStaffs.reduce(
    (count: any, staff: any) => {
      if (staff.sex === "male") {
        count.male += 1;
      } else if (staff.sex === "female") {
        count.female += 1;
      }
      return count;
    },
    { male: 0, female: 0 }
  );

  const roleCountActive = activeStaffs.reduce(
    (count: any, staff: any) => {
      if (staff.role === "Barista") {
        count.barista += 1;
      } else if (staff.role === "Cleaner") {
        count.cleaner += 1;
      }
      return count;
    },
    { barista: 0, cleaner: 0 }
  );

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-4">
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white rounded-3xl ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staffs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaffs.length} Staffs</div>
          <p className="text-xs text-muted-foreground">
            {sexCountTotal.male} male, {sexCountTotal.female} female
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Currently Clock-in Staffs
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStaffs.length} Staffs</div>
          <p className="text-xs text-muted-foreground">
            {roleCountActive.barista} Barista(s), {roleCountActive.cleaner}{" "}
            Cleaner(s)
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-100 via-blue-50 to-white rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Staff with most lates
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{staffWithMostLates.name}</div>
          <p className="text-xs text-muted-foreground">
            with {staffWithMostLates.lateCount} lates
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
