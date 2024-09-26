"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { PrintData } from "@/utils/interface";
import { DEFAULT_PRINTDATA } from "@/config/constants";

// デフォルトのPrintData型のデータ
const printData: PrintData = DEFAULT_PRINTDATA;

// Contextを作成
const PrintDataContext = createContext({
  printData: printData,
  setPrintData: (data: PrintData) => {},
});

// Context Providerを定義
export const PrintDataProvider = ({ children }: { children: ReactNode }) => {
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);

  return (
    <PrintDataContext.Provider value={{ printData, setPrintData }}>
      {children}
    </PrintDataContext.Provider>
  );
};

// PrintDataを使用するカスタムフック
export const usePrintData = () => useContext(PrintDataContext);
