import BackButton from "./_components/backButton";
import StaffDetails from "./_components/staffDetails";
import {
  getAttendanceById,
  getEmployeeById,
  getPayrollById,
  getShifts,
} from "@/actions/employeeActions";

const StaffDetailPage = async ({
  params,
}: {
  params: { staff_id: string };
}) => {
  const payrolls = await getPayrollById(params.staff_id);
  const staff = await getEmployeeById(params.staff_id);
  const attendance = await getAttendanceById(params.staff_id);
  const shifts = await getShifts();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5 px-4 md:px-10">
      <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-14">
        <div className="flex items-start gap-x-2">
          <BackButton />
          <div>
            <h1 className="text-2xl mt-2 md:mt-0 font-semibold leading-none tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {staff && staff.name} Details
            </h1>
            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content hidden md:block">
              This is an overview of {staff && staff.name}'s attendance and
              payroll.
            </p>
          </div>
        </div>
        <StaffDetails
          payrolls={payrolls}
          staff={staff}
          shifts={shifts}
          attendance={attendance}
        />
      </div>
    </div>
  );
};

export default StaffDetailPage;
