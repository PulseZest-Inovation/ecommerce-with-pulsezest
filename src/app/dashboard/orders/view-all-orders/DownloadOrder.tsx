// components/DownloadCSV.tsx
import { Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons"; // Import Excel Icon
import React from "react";
import * as XLSX from "xlsx"; // Import XLSX

interface DownloadCSVProps {
  data: any[]; // The data that will be exported as CSV
  filename: string; // The name of the CSV file
}

const ExportOderDetails: React.FC<DownloadCSVProps> = ({ data, filename }) => {
  const handleDownloadCSV = () => {
    // Convert data to a format suitable for CSV
    const dataToExport = data.map((item) => ({
      OrderID: item.orderId,
      CustomerName: item.fullName,
      Email: item.email,
      PhoneNumber: item.phoneNumber,
      Address: `${item.houseNumber}, ${item.apartment}, ${item.address}, ${item.city}, ${item.state}, ${item.country}`,
      OrderDate: new Date(item.createdAt.seconds * 1000).toLocaleDateString(),
      Status: item.status,
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Download the workbook as CSV
    XLSX.writeFile(wb, filename);
  };

  return (
    <Button onClick={handleDownloadCSV} className="ant-btn ant-btn-primary" icon={<FileExcelOutlined />}>
      Download CSV
    </Button>
  );
};

export default ExportOderDetails;
