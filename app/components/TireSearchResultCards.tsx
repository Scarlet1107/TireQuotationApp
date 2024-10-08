import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchResult } from "@/utils/interface";
import { toast } from "@/components/ui/use-toast";
import { usePrintData } from "../printDataContext";

interface TireSearchResultCardsProps {
  searchResults: SearchResult[];
  generateQuotationNumber: () => string;
}

const TireSearchResultCards = ({
  searchResults,
  generateQuotationNumber,
}: TireSearchResultCardsProps) => {
  const { printData, setPrintData } = usePrintData();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  const calculateExtraOptionsTotal = () => {
    return printData.extraOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0,
    );
  };

  // カードをクリックした際にprintDataにタイヤ情報を追加/削除する関数
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

  return (
    <div>
      {searchResults.length > 0 && (
        <p className="mt-8 flex justify-center p-2 text-2xl font-bold md:mt-0">
          検索結果
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {searchResults.map((result, index) => (
          <div key={index}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Card
                    className={`w-full transform cursor-pointer transition-all duration-100 hover:scale-105 ${
                      printData.ids.includes(result.id)
                        ? "border-4 border-red-400 bg-gray-100"
                        : ""
                    } select-none`} // ここで選択を無効化
                    onClick={() => toggleQuotationDataById(result.id)}
                  >
                    <CardHeader className="px-12">
                      <CardTitle className="text-xl 2xl:text-2xl">
                        {result.manufacturer}
                      </CardTitle>
                      <CardDescription className="">
                        {result.pattern}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <span className="mr-4">タイヤ:</span>
                        <span>
                          {formatPrice(
                            Math.ceil(
                              (result.tirePrice * result.priceRate) / 10,
                            ) *
                              10 *
                              result.numberOfTires,
                          )}
                          円
                        </span>
                      </div>
                      {result.wheel.isIncluded && (
                        <div className="flex justify-between">
                          <span>ホイール: </span>
                          <span>
                            {formatPrice(
                              result.wheel.price * result.wheel.quantity,
                            )}
                            円
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>工賃:</span>
                        <span>{formatPrice(result.totalServiceFee)}円</span>
                      </div>

                      {calculateExtraOptionsTotal() !== 0 && (
                        <div className="flex justify-between">
                          <span>オプション:</span>
                          <span>
                            {formatPrice(calculateExtraOptionsTotal())}円
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>小計:</span>
                        <span>{formatPrice(result.totalPrice)}円</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-stretch">
                      <div className="flex justify-between font-semibold">
                        <span>合計(税込み):</span>
                        <span> {formatPrice(result.totalPriceWithTax)}円</span>
                      </div>
                    </CardFooter>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <span>メーカー: </span>
                    <span>{result.manufacturer}</span>
                  </div>
                  <div>
                    <span>パターン: </span>
                    <span>{result.pattern}</span>
                  </div>
                  <div>
                    <span>タイヤ:</span>
                    <br />
                    {formatPrice(result.tirePrice)} × {result.priceRate} ×{" "}
                    {printData.numberOfTires} =
                    {formatPrice(
                      Math.ceil((result.tirePrice * result.priceRate) / 10) *
                        10 *
                        result.numberOfTires,
                    )}
                    円
                  </div>
                  <div className="mt-2">
                    <span>タイヤ{result.numberOfTires}本の利益: </span>
                    <span className="font-semibold">
                      {formatPrice(result.profit)}円
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TireSearchResultCards;
