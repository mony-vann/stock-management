import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CircleOff,
  Clock3,
  Clock4,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

const SummaryCards = ({
  totalStaffs,
  activeStaffs,
  staffWithMostLates,
  staffWithMostEarlyLeaves,
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
    <div className="grid gap-4 md:grid-cols-5 md:gap-4">
      <div className="space-y-4">
        <Card className="rounded-3xl flex items-center p-5 gap-x-5">
          <Button disabled className="rounded-xl w-16 h-16 bg-[#0565ff40]">
            <Users className="h-10 w-10 text-[#0565FF]" />
          </Button>
          <div>
            <p className="text-sm font-medium">Total Staffs</p>
            <div className="flex items-center gap-x-3">
              <div className="text-3xl font-bold flex items-center gap-x-5">
                {totalStaffs.length}
              </div>
              <div className="font-light text-xs hidden md:block lg:hidden xl:block">
                <p className="leading-3">
                  {sexCountTotal.male} male, {sexCountTotal.female} female
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl flex items-center p-5 gap-x-5">
          <Button disabled className="rounded-xl w-16 h-16 bg-[#0565ff40]">
            <Clock4 className="h-10 w-10  text-[#0565ff]" />
          </Button>
          <div>
            <p className="text-sm font-medium">Most Late Check-in</p>
            <div className="items-center gap-x-3">
              <div className="text-xl font-bold flex items-center gap-x-5">
                {staffWithMostLates?.name || "No staff"}
              </div>
              <div className="font-light text-xs hidden md:block lg:hidden xl:block">
                <p className="leading-3">
                  with {staffWithMostLates?.lateCount || 0} lates
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="rounded-3xl flex items-start p-5 gap-x-5">
          <Button disabled className="rounded-xl w-16 h-16 bg-[#0565ff40]">
            <Activity className="h-10 w-10 text-[#0565ff]" />
          </Button>
          <div>
            <p className="text-sm font-medium">Currently Clock-in</p>
            <div className="flex items-center gap-x-3">
              <div className="text-3xl font-bold flex items-center gap-x-5">
                {activeStaffs.length}
              </div>
              <div className="font-light text-xs hidden md:block lg:hidden xl:block">
                <p className="leading-3">
                  {roleCountActive.barista} Barista(s)
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl flex items-start p-5 gap-x-5 ">
          <Button disabled className="rounded-xl w-16 h-16 bg-[#0565ff40]">
            <Clock3 className="h-10 w-10 text-[#0565ff]" />
          </Button>
          <div>
            <p className="text-sm font-medium">Most Early Check-out</p>
            <div className="items-center gap-x-3">
              <div className="text-xl font-bold flex items-center gap-x-5">
                {staffWithMostEarlyLeaves?.name || "No staff"}
              </div>
              <div className="font-light text-xs hidden md:block lg:hidden xl:block">
                <p className="leading-3">
                  with {staffWithMostEarlyLeaves?.earlyLeaveCount || 0} earlys
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SummaryCards;
