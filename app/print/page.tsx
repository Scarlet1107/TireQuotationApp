"use client";
import React, { useEffect } from "react";
import PrintContent from "../components/PrintContent";
import { usePrintData } from "../printDataContext";

// スマホで印刷ボタンを押した際に印刷ダイアログを表示するためのページ
// この画面がそのまま印刷される
const Page = () => {

  const { printData } = usePrintData();

  // スマホでの印刷時にファイル名がdocument.titleになるので設定
  useEffect(() => {
    document.title = `${printData.customerName}様-${printData.quotationNumber}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 一部ブラウザ（Google）でエラーが出る
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${printData.customerName}様-${printData.quotationNumber}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div onClick={() => handlePrint()}>
      <PrintContent />
    </div>
  );
};
export default Page;
