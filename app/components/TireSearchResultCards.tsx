import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrintData, SearchResult } from "@/utils/interface";
import { toast } from "@/components/ui/use-toast";

interface TireSearchResultCardsProps {
  printData: PrintData;
  searchResults: SearchResult[];
  setPrintData: (data: PrintData) => void;
  generateQuotationNumber: () => string;
}

const TireSearchResultCards = ({
  printData,
  searchResults,
  setPrintData,
  generateQuotationNumber,
}: TireSearchResultCardsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  const calculateExtraOptionsTotal = () => {
    return printData.extraOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0,
    );
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

  return (
    <div>
      <p className="mt-8 flex justify-center p-2 text-2xl font-bold md:mt-0">
        検索結果
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
                  タイヤ: {formatPrice(result.tirePrice)} × {result.priceRate} ×{" "}
                  {result.numberOfTires} 円
                </p>
                {result.wheel.isIncluded ? (
                  <p>
                    ホイール({result.wheel.name}, {result.wheel.size}):{" "}
                    {formatPrice(result.wheel.price * result.wheel.quantity)}円
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
                    合計（税抜）: <span>{formatPrice(result.totalPrice)}</span>
                    円
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
    </div>
  );
};

export default TireSearchResultCards;
