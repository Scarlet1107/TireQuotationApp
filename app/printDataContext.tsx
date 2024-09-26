// printDataをグローバル変数として定義するためのファイル。useContextを使用している。
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { PrintData } from "@/utils/interface";
import { DEFAULT_PRINTDATA } from "@/config/constants";

const printData: PrintData = DEFAULT_PRINTDATA;

const PrintDataContext = createContext({
  printData: printData,
  setPrintData: (data: PrintData) => {},
});

export const PrintDataProvider = ({ children }: { children: ReactNode }) => {
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);

  return (
    <PrintDataContext.Provider value={{ printData, setPrintData }}>
      {children}
    </PrintDataContext.Provider>
  );
};

export const usePrintData = () => useContext(PrintDataContext);
