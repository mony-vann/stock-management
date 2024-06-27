import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex items-center mx-10 mt-10">
        <div className="pl-14">
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your staff.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="p-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:gap-4 md:grid-cols-3 xl:grid-cols-5 px-6">
          <div className="md:col-span-2 xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Table className="h-[350px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2 h-[350px] overflow-y-scroll">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between gap-x-2 mb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20 rounded-md" />
                      </div>
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
