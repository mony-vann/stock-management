import React, { forwardRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import * as XLSX from "xlsx";
import {
  postBottleSaleData,
  postBottleSaleSummary,
} from "@/actions/bottleSaleActions";

import { useToast } from "@/components/ui/use-toast";
import { postDailyReport, postSaleData } from "@/actions/saleActions";

interface Bottle {
  itemCode: string;
  itemDescription: string;
  date: Date;
  quantity: number;
  unitPrice: number;
  cost: number;
  subTotal: number;
  tax: number;
  discount: number;
  free: number;
  extPrice: number;
  extCost: number;
  margin: number;
}

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

const BottleSalesToJson = forwardRef<HTMLDivElement, {}>((props, _ref) => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);

          if (file.name.toLowerCase().includes("bottle")) {
            const clean = cleanBottlesData(json);
            setBottles(clean);
          } else if (file.name.toLowerCase().includes("report")) {
            const processedData = cleanSalesData(json);
            setSalesData(processedData);
          } else {
            toast({
              title: "Unrecognized file",
              description:
                "Please upload a valid file (Sales Report or Bottle Sales)",
            });
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const cleanBottlesData = (jsonData: any[]) => {
    // Filter out irrelevant rows and map the remaining data
    const data = jsonData
      .filter((row: any) => row.__EMPTY_2 && row.__EMPTY_7 && row.__EMPTY_9) // Ensure necessary fields are present
      .map((row: any) => ({
        itemCode: row.__EMPTY_2.trim(),
        itemDescription: row.__EMPTY_3 ? row.__EMPTY_3.trim() : "",
        quantity: parseFloat(row.__EMPTY_7),
        unitPrice: parseFloat(row.__EMPTY_9),
        cost: parseFloat(row.__EMPTY_10),
        subTotal: parseFloat(row.__EMPTY_11),
        tax: parseFloat(row.__EMPTY_12),
        discount: parseFloat(row.__EMPTY_13),
        free: parseFloat(row.__EMPTY_15),
        extPrice: parseFloat(row.__EMPTY_16),
        extCost: parseFloat(row.__EMPTY_17),
        margin: parseFloat(row.__EMPTY_19),
      }));

    const dateFrom = jsonData[2].__EMPTY_1;
    const fromDate = dateFrom.split(" ")[5];
    const [day, month, year] = fromDate.split("-");

    // Create date string in ISO format
    const isoDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T00:00:00.000Z`;

    // Create Date object
    const date = new Date(isoDateString);

    const cleanedData = data.map((row) => ({
      ...row,
      date: date,
    }));

    return cleanedData;
  };

  const cleanSalesData = (jsonData: any[]) => {
    const data = jsonData.slice(4, -2).map((row: any) => ({
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

    console.log("Sales data:", data);

    return data;
  };

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

  useEffect(() => {
    if (bottles.length > 0) {
      postBottleSaleData(bottles)
        .then(async () => {
          await postBottleSaleSummary(bottles[0].date)
            .then(() => {
              toast({
                title: "Data uploaded successfully",
                description: "Data has been uploaded successfully",
              });
            })
            .catch((error) => {
              console.error("Error uploading bottle sales summary:", error);
            });
        })
        .catch((error) => {
          toast({
            title: "Data already exists for the given date",
            description: "Please upload a different file",
          });
        });
    }
  }, [bottles]);

  useEffect(() => {
    if (salesData.length > 0) {
      postSaleData(salesData)
        .then(async () => {
          await postDailyReport(salesData[0].startDate)
            .then(() => {
              toast({
                title: "Data uploaded successfully",
                description: "Data has been uploaded successfully",
              });
            })
            .catch((error) => {
              console.error("Error uploading data:", error);
              // You can add some error feedback here
            });
        })
        .catch((error) => {
          toast({
            title: "Data already exists for the given date",
            description: "Please upload a different file",
          });
        });
    }
  }, [salesData]);

  return (
    <div className="col-start-4">
      <Button
        variant={"outline"}
        className="w-9 h-9 rounded-lg p-0"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".xlsx, .xls";
          input.onchange = handleFileUpload;
          input.click();
        }}
      >
        <Import className="w-5 h-5 stroke-gray-500" />
      </Button>
    </div>
  );
});

BottleSalesToJson.displayName = "BottleSalesToJson";

export default BottleSalesToJson;
