"use client";
import {
  TAX_RATE,
  CUSTOMER_TYPE,
  DEFAULT_PRINTDATA,
  DEFAULT_WHEEL,
  MAX_EXTRAOPTIONS,
  DEFAULT_TIRE_SEARCH_FILTERS,
} from "@/config/constants";
import {
  CheckboxState,
  ExtraOption,
  PrintData,
  SearchResult,
  ServiceFee,
  SelectData,
  Wheel,
} from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  searchTires,
  getAllmanufacturer,
  getServiceFees,
  uploadPrintData,
  getPrintDataHistory,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

import { useToast } from "@/components/ui/use-toast";

import { useReactToPrint } from "react-to-print";

import PrintContent from "./printContent";

import PrintDataEditor from "./components/PrintDataEditor";
import ResetButton from "./components/ResetButton";
import GlobalQuotationInputs from "./components/GlobalQuotationInputs";
import TireSearchForm from "./components/TireSearchForm";
import TireSearchResultCards from "./components/TireSearchResultCards";
import ManualTireInput from "./components/ManualTireInput";

const Main = () => {
  const { toast } = useToast();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);

  const componentRef = useRef(null);

  // 見積もりナンバーを日時から生成する関数
  const generateQuotationNumber = (): string => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const quotationNumber = `${year}${month}${day}${hours}${minutes}`;
    return quotationNumber;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: printData.customerName + "様-" + printData.quotationNumber,
  });

  const handlePrintButtonClick = async () => {
    if (printData.ids.length === 0) {
      toast({
        title: "タイヤを選択してください",
      });
      return;
    }
    if (printData.customerName === "") {
      toast({
        title: "お客様名を入力してください",
      });
      return;
    }
    if (printData.carModel === "") {
      toast({
        title: "車種を入力してください",
      });
      return;
    }

    // 空のオプションを取り除く
    const filteredExtraOptions = printData.extraOptions.filter(
      (option) => option.option !== null && option.option !== "",
    );
    setPrintData((prevData) => ({
      ...prevData,
      extraOptions: filteredExtraOptions,
    }));

    // すでに同じ見積もりを複数回保存しないようにする
    const printDataHistory = await getPrintDataHistory();
    if (printDataHistory[0].quotationNumber !== printData.quotationNumber) {
      try {
        await uploadPrintData(printData);
      } catch (error) {
        console.error("Failed to save print data to print_logs:", error);
      }
    } else {
      toast({
        title:
          "すでに同じ見積もりが保存されていたため、履歴を保存しませんでした",
      });
    }
    if (componentRef.current) handlePrint();
  };

  return (
    <div className="ml-12 mt-8 flex w-full flex-col md:flex-row">
      <div className="w-full">
        <GlobalQuotationInputs
          printData={printData}
          setPrintData={setPrintData}
        />
        <Tabs defaultValue="search-tires" className="w-full border-2 rounded p-4">
          <TabsList>
            <TabsTrigger value="search-tires" className="px-4">
              タイヤを検索
            </TabsTrigger>
            <TabsTrigger value="manual-entry" className="px-4">
              手打ち入力
            </TabsTrigger>
          </TabsList>
          <TabsContent value="search-tires">
            <TireSearchForm
              printData={printData}
              setPrintData={setPrintData}
              setSearchResults={setSearchResults}
            />
            <TireSearchResultCards
              printData={printData}
              searchResults={searchResults}
              setPrintData={setPrintData}
              generateQuotationNumber={generateQuotationNumber}
            />
          </TabsContent>
          <TabsContent value="manual-entry">
            <ManualTireInput
              printData={printData}
              setPrintData={setPrintData}
              generateQuotationNumber={generateQuotationNumber}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <div className="mr-8 flex flex-col justify-end space-x-8 md:flex-row">
          <PrintDataEditor
            printData={printData}
            setPrintData={setPrintData}
            generateQuotationNumber={generateQuotationNumber}
          />

          <ResetButton
            setPrintData={setPrintData}
            printDataLength={printData.ids.length}
          />

          <Button
            className="w-min transform bg-green-500 font-bold transition-all duration-100 hover:scale-95 hover:bg-green-600"
            onClick={() => handlePrintButtonClick()}
          >
            選択した内容をプリント
          </Button>
          {/* なにこの空のdivタグ？ */}
          <div></div>
        </div>

        <div className="hidden justify-center">
          <div className="w-3/4">
            <PrintContent ref={componentRef} printData={printData} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Main;
