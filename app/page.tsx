"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintData, SearchResult } from "@/utils/interface";
import {
  uploadPrintData,
  getPrintDataHistory,
} from "@/utils/supabaseFunctions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import PrintContent from "@/app/components/printContent";
import PrintDataEditor from "./components/PrintDataEditor";
import ResetButton from "./components/ResetButton";
import GlobalQuotationInputs from "./components/GlobalQuotationInputs";
import TireSearchForm from "./components/TireSearchForm";
import TireSearchResultCards from "./components/TireSearchResultCards";
import ManualTireInput from "./components/ManualTireInput";
import Header from "./components/Header";
import { usePrintData } from "./printDataContext";
import { useRouter } from "next/navigation";
import { isMobile as detectMobile } from "react-device-detect"; // スマホからのアクセスかどうかを判定するためのライブラリ

const Main = () => {
  const { toast } = useToast();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { printData, setPrintData } = usePrintData();

  const componentRef = useRef(null);
  const isMounted = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // ページ読み込み時LocalStorageからデータを読み込む
  useEffect(() => {
    if (!isMounted.current) {
      const savedData = loadPrintData();
      if (savedData) {
        setPrintData(savedData);
      }
      isMounted.current = true;
    }
    setIsMobile(detectMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPrintData = (): PrintData | null => {
    const storedData = localStorage.getItem("printData");
    return storedData ? JSON.parse(storedData) : null;
  };

  // printData が変更されたときに localStorage に保存
  useEffect(() => {
    if (isMounted.current) {
      savePrintData(printData);
    }
  }, [printData]);

  const savePrintData = (printData: PrintData) => {
    localStorage.setItem("printData", JSON.stringify(printData));
  };

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

  const validateGlobalInputs = () => {
    if (printData.staffName === "") {
      toast({
        title: "担当者を入力してください",
      });
      return false;
    }
    if (printData.ids.length === 0) {
      toast({
        title: "タイヤを選択してください",
      });
      return false;
    }
    if (printData.customerName === "") {
      toast({
        title: "お客様名を入力してください",
      });
      return false;
    }
    if (printData.carModel === "") {
      toast({
        title: "車種を入力してください",
      });
      return false;
    }
    filterExtraOptions();
    return true;
  };

  // 空のオプションを取り除く関数
  const filterExtraOptions = () => {
    const filteredExtraOptions = printData.extraOptions.filter(
      (option) => option.option !== null && option.option !== "",
    );
    setPrintData({
      ...printData,
      extraOptions: filteredExtraOptions,
    });
  };

  // 履歴に保存する関数
  const savePrintDataToHistory = async () => {
    // すでに同じ見積もりを複数回保存しないようにする
    const printDataHistory = await getPrintDataHistory();
    if (
      printDataHistory[0].quotationNumber !== printData.quotationNumber ||
      printDataHistory.length === 0
    ) {
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
  };

  const handleMobilePrintButtonClick = () => {
    const isValid = validateGlobalInputs();
    if (isValid) {
      savePrintDataToHistory();
      router.push("/print"); // バリデーションが成功したときのみページ遷移
    }
  };

  const handlePrintButtonClick = async () => {
    // 必須情報が入力されているか確認
    if (validateGlobalInputs() === false) return;

    savePrintDataToHistory();
    if (componentRef.current) handlePrint();
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: printData.customerName + "様-" + printData.quotationNumber,
  });
  return (
    <main className="w-screen print:hidden">
      <Header />
      <div className="mb-12 mt-8 flex w-screen flex-col justify-center px-4 md:px-8 xl:flex-row xl:px-12">
        <div className="order-2 w-max xl:order-1">
          <GlobalQuotationInputs />
          <Separator className="hidden md:flex" />
          {/* デフォルトではタブを切り替えるたびにコンポーネントが再レンダリングされてしまうため、TabsContentのclassNameにて表示/非表示の切り替えを行っている。 */}
          <Tabs
            defaultValue="search-tires"
            className="mt-8 w-max rounded md:w-max md:p-4 xl:border-2"
          >
            <TabsList>
              <TabsTrigger value="search-tires" className="px-4">
                タイヤを検索
              </TabsTrigger>
              <TabsTrigger value="manual-entry" className="px-4">
                手打ち入力
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="search-tires"
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <TireSearchForm setSearchResults={setSearchResults} />
              <TireSearchResultCards
                searchResults={searchResults}
                generateQuotationNumber={generateQuotationNumber}
              />
            </TabsContent>
            <TabsContent
              value="manual-entry"
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <ManualTireInput
                generateQuotationNumber={generateQuotationNumber}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="order-1 flex w-full flex-col space-x-8 space-y-8 xl:order-2">
          <div className="mb-6 flex flex-row justify-start space-x-4 md:space-x-6 xl:mb-0 xl:justify-end xl:space-x-8">
            <PrintDataEditor
              generateQuotationNumber={generateQuotationNumber}
            />
            <ResetButton setSearchResult={setSearchResults} />
            {/* モバイルとPCで印刷のロジックを変えている。「印刷」の文字を統一しないとサーバーサイドのレンダリングとクライアントサイドのレンダリング結果に違いが出てエラーになるので注意 */}
            {isMobile ? (
              <Button
                className={`flex ${
                  printData.ids.length === 0
                    ? "bg-green-300 hover:bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => handleMobilePrintButtonClick()}
              >
                スマホ用印刷ボタン
              </Button>
            ) : (
              <Button
                className="w-min transform bg-green-500 font-bold transition-all duration-100 hover:scale-95 hover:bg-green-600"
                onClick={() => handlePrintButtonClick()}
              >
                印刷
              </Button>
            )}
          </div>
          <div className="hidden justify-center xl:flex">
            <div className="">
              <PrintContent ref={componentRef} />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </main>
  );
};

export default Main;
