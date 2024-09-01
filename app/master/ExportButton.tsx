import React from "react";
import { exportCSV } from "./exportCSV";

interface ExportProps {
  children: string;
}

const ExportButton: React.FC<ExportProps> = ({ children }) => {
  const handleExport = async () => {
    try {
      await exportCSV(children);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };
  return (
    <button
      onClick={handleExport}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      {children} テンプレート取得
    </button>
  );
};

export default ExportButton;
