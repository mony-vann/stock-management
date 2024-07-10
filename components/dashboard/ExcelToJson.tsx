import { forwardRef, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Import } from "lucide-react";
import { postDailyReport, postSaleData } from "@/actions/saleActions";

interface SaleData {
  invoiceNo: string;
  startDate: Date;
  stopDate: Date;
  cashier: string;
  tableNo: string;
  subTotal: number;
  vat: number;
  discount: number;
  grandTotal: number;
  free: number;
  balance: number;
  recDollar: number;
  riel: number;
  creditCard: number;
  revenue: number;
}

const ExcelToJson = forwardRef<HTMLDivElement, {}>((props, _ref) => {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const { toast } = useToast();

  const excelDateToJSDate = (serial: number) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  };

  const isExcelDate = (value: any) => {
    if (typeof value === "number" && !isNaN(value) && value > 0) {
      const date = excelDateToJSDate(value);
      return date.getFullYear() >= 1900 && date.getFullYear() <= 2100;
    }
    return false;
  };

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);

          const processedData: SaleData[] = json
            .slice(4, -5)
            .map((row: any) => ({
              invoiceNo: row["__EMPTY_1"] || "",
              startDate: isExcelDate(row["__EMPTY_2"])
                ? excelDateToJSDate(row["__EMPTY_2"])
                : new Date(row["__EMPTY_2"]),
              stopDate: isExcelDate(row["__EMPTY_5"])
                ? excelDateToJSDate(row["__EMPTY_5"])
                : new Date(row["__EMPTY_5"]),
              cashier: row["__EMPTY_9"] || "",
              tableNo: row["__EMPTY_10"] || "",
              subTotal: parseFloat(row["__EMPTY_11"]) || 0,
              vat: parseFloat(row["__EMPTY_12"]) || 0,
              discount: parseFloat(row["__EMPTY_13"]) || 0,
              grandTotal: parseFloat(row["__EMPTY_14"]) || 0,
              free: parseFloat(row["__EMPTY_15"]) || 0,
              balance: parseFloat(row["__EMPTY_16"]) || 0,
              recDollar: parseFloat(row["__EMPTY_17"]) || 0,
              riel: parseFloat(row["__EMPTY_18"]) || 0,
              creditCard: parseFloat(row["__EMPTY_20"]) || 0,
              revenue: parseFloat(row["__EMPTY_21"]) || 0,
            }));

          setSalesData(processedData);
          console.log("Sales data:", processedData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    // if (salesData.length > 0) {
    //   postSaleData(salesData)
    //     .then(async () => {
    //       const response = await postDailyReport(salesData[0].startDate)
    //         .then(() => {
    //           toast({
    //             title: "Data uploaded successfully",
    //             description: "Data has been uploaded successfully",
    //           });
    //         })
    //         .catch((error) => {
    //           console.error("Error uploading data:", error);
    //           // You can add some error feedback here
    //         });
    //     })
    //     .catch((error) => {
    //       console.error("Error uploading data:", error);
    //       toast({
    //         title: "Data already exists for the given date",
    //         description: "Please upload a different file",
    //       });
    //     });
    // }
  }, [salesData]);

  return (
    <div className="col-start-4">
      <Button
        className="w-9 h-9 rounded-lg p-0"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".xlsx, .xls";
          input.onchange = handleFileUpload;
          input.click();
        }}
      >
        <Import className="w-5 h-5" />
      </Button>
    </div>
  );
});

ExcelToJson.displayName = "ExcelToJson";

export default ExcelToJson;
