import React from "react";
import { exportCSV } from "./exportCSV";

interface ExportProps {
  tableName: string;
}

const ExportButton: React.FC<ExportProps> = ({ tableName }) => {
  const handleExport = async () => {
    try {
      await exportCSV(tableName);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };
  return (
    <button
      onClick={handleExport}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      CSVエクスポート
    </button>
  );
};

export default ExportButton;
