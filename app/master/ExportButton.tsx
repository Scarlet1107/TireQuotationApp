import React from "react";
import { exportCSV } from "./exportCSV";
import { Button } from "@/components/ui/button";

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
    <Button
      onClick={handleExport}
      className="flex w-full justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      テンプレート取得
    </Button>
  );
};

export default ExportButton;
