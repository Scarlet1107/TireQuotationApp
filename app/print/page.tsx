"use client";
import React from "react";
import PrintContent from "../printContent";
import { usePrintData } from "../printDataContext";

const Page = () => {
  const { printData } = usePrintData();

  const handlePrint = () => {
    // const originalTitle = document.title;
    // document.title = `${printData.customerName}様-${printData.quotationNumber}`;
    window.print();
    // document.title = originalTitle;
  };

  return (
    <div onClick={() => handlePrint()}>
      <PrintContent />
    </div>
  );
};
export default Page;
