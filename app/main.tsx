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

import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useReactToPrint } from "react-to-print";
import PrintContent from "./printContent";

import ManualTireInputDialog from "./components/ManualTireInputDialog";
import PrintHistorySheet from "./components/PrintHistorySheet";
import WheelInputCollapsible from "./components/WheelInputCollapsible";
import PrintDataSheet from "./components/PrintDataEditor";
import PrintDataEditor from "./components/PrintDataEditor";
import ResetButton from "./components/ResetButton";
import GlobalQuotationInputs from "./components/GlobalQuotationInputs";
import TireSearchForm from "./components/TireSearchForm";

const Main = () => {
  const { toast } = useToast();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);

  const componentRef = useRef(null);

  const calculateExtraOptionsTotal = () => {
    return printData.extraOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0,
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  const toggleQuotationDataById = (id: number) => {
    const ids = [...printData.ids];
    const tires = [...printData.tires];
    const serviceFees = [...printData.serviceFees];
    const wheels = [...printData.wheels];

    const idIndex = ids.indexOf(id);

    if (idIndex !== -1) {
      ids.splice(idIndex, 1);
      tires.splice(idIndex, 1);
      serviceFees.splice(idIndex, 1);
      wheels.splice(idIndex, 1);
    } else {
      if (ids.length >= 3) {
        toast({
          title: "最大3つまでしか選択できません",
        });
        return;
      }

      ids.push(id);

      const dataToAdd = searchResults.find((result) => result.id === id);
      if (dataToAdd) {
        const tireToAdd = {
          manufacturer: dataToAdd.manufacturer,
          pattern: dataToAdd.pattern,
          tireSize: dataToAdd.tireSize,
          tirePrice: dataToAdd.tirePrice,
          priceRate: dataToAdd.priceRate,
        };
        tires.push(tireToAdd);
        serviceFees.push(dataToAdd.serviceFee);
        wheels.push(dataToAdd.wheel);
        console.log("tireToAdd = ", tireToAdd);
      }
    }

    setPrintData({
      ...printData,
      ids,
      tires,
      serviceFees,
      wheels,
      quotationNumber: generateQuotationNumber(), // 見積もりナンバーを更新
    });
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
    <div className="ml-8 mt-8 flex w-full flex-col md:flex-row">
      <div>
        <GlobalQuotationInputs
          printData={printData}
          setPrintData={setPrintData}
        />
        <TireSearchForm
          printData={printData}
          setPrintData={setPrintData}
          setSearchResults={setSearchResults}
        />
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <div className="mr-8 flex flex-col justify-end space-x-8 md:flex-row">
          <PrintHistorySheet setPrintData={setPrintData} />
          <ManualTireInputDialog
            printData={printData}
            setPrintData={setPrintData}
            generateQuotationNumber={generateQuotationNumber}
          />
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
          <div></div>
        </div>
        {/* 検索結果の表示 */}
        <p className="mt-8 flex justify-center text-3xl font-bold md:mt-0">
          見積り結果
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {searchResults.map((result, index) => (
            <div key={index}>
              <Card
                className={`transform cursor-pointer transition-all duration-100 hover:scale-105 ${
                  printData.ids.includes(result.id)
                    ? "border-4 border-red-400 bg-gray-100"
                    : ""
                } select-none`} // ここで選択を無効化
                onClick={() => toggleQuotationDataById(result.id)}
              >
                <CardHeader>
                  <CardTitle>メーカー : {result.manufacturer}</CardTitle>
                  <CardDescription>パターン : {result.pattern}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    タイヤ: {formatPrice(result.tirePrice)} × {result.priceRate}{" "}
                    × {result.numberOfTires} 円
                  </p>
                  {result.wheel.isIncluded ? (
                    <p>
                      ホイール({result.wheel.name}, {result.wheel.size}):{" "}
                      {formatPrice(result.wheel.price * result.wheel.quantity)}
                      円
                    </p>
                  ) : (
                    ""
                  )}
                  <p>
                    {" "}
                    {result.serviceFee.laborFee !== 0 ||
                    result.serviceFee.tireDisposalFee !== 0 ||
                    result.serviceFee.removalFee !== 0 ||
                    result.serviceFee.tireStorageFee !== 0 ? (
                      <span>
                        工賃:{" "}
                        {formatPrice(
                          (result.serviceFee.laborFee *
                            (100 - result.discountRate.laborFee)) /
                            100 +
                            (result.serviceFee.removalFee *
                              (100 - result.discountRate.removalFee)) /
                              100 +
                            result.serviceFee.tireDisposalFee +
                            (result.serviceFee.tireStorageFee *
                              (100 - result.discountRate.tireStorageFee)) /
                              100,
                        )}
                        円
                      </span>
                    ) : (
                      ""
                    )}{" "}
                  </p>
                  {calculateExtraOptionsTotal() !== 0 ? (
                    <p>
                      その他のオプション合計:{" "}
                      {formatPrice(calculateExtraOptionsTotal())}円
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col">
                    <p>
                      合計（税抜）:{" "}
                      <span>{formatPrice(result.totalPrice)}</span>円
                    </p>
                    <p className="font-bold">
                      税込: {formatPrice(result.totalPriceWithTax)}円
                    </p>
                    <p className="mt-2">
                      タイヤ利益(税抜) : {formatPrice(result.profit)}円
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
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
