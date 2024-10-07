"use client";
import React from "react";
import { ServiceFee, DiscountRate } from "@/utils/interface";
import {
  QUALIFIED_INVOICE_ISSUER_REGISTRATION_NUMBER,
  TAX_RATE,
} from "@/config/constants";
import Image from "next/image";
import { usePrintData } from "../printDataContext";

const PrintContent = React.forwardRef<HTMLDivElement>((props, ref) => {
  PrintContent.displayName = "PrintContent";
  const { printData } = usePrintData();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  const applyDiscount = (price: number, discountRate: number) => {
    return price * (1 - discountRate / 100);
  };

  // 見積もりの合計金額を計算する関数（税抜き）
  const calculateTotalPrice = (
    tire: any,
    fee: ServiceFee,
    discountRate: DiscountRate,
  ) => {
    let total =
      Math.ceil((tire.tirePrice * tire.priceRate) / 10) *
      10 *
      printData.numberOfTires; //タイヤの価格
    if (printData.checkBoxState.laborFee)
      total += applyDiscount(
        fee.laborFee * printData.numberOfTires,
        discountRate.laborFee,
      );
    if (printData.checkBoxState.removalFee)
      total += applyDiscount(
        fee.removalFee * printData.numberOfTires,
        discountRate.removalFee,
      );
    if (printData.checkBoxState.tireStorageFee)
      total += applyDiscount(fee.tireStorageFee, discountRate.tireStorageFee);
    if (printData.checkBoxState.tireDisposalFee)
      total += fee.tireDisposalFee * printData.numberOfTires;
    return total;
  };

  const calculateExtraOptionsTotal = () => {
    return printData.extraOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0,
    );
  };

  const extraOptionsTotal = calculateExtraOptionsTotal();

  const wheelTotals = printData.wheels.map((wheel) => {
    if (!wheel.isIncluded) return 0;
    else return wheel.price * wheel.quantity;
  });

  // 割引率が100%, 0%, それ以外の場合で表示を変える関数。tireStorageFee(タイヤ預かり料)は
  const renderDiscountedPrice = (
    price: number,
    discountRate: number,
    feeType: "laborFee" | "tireDisposalFee" | "tireStorageFee", // removalFeeは割引率に依存しないので、ここには含めない
  ) => {
    // tireStorageFeeならタイヤの本数を掛けない
    const multipliedFee =
      feeType === "tireStorageFee" ? price : price * printData.numberOfTires;

    if (discountRate === 100) {
      return (
        <div>
          <span className="mr-2 line-through decoration-double decoration-2">
            {feeType !== "tireStorageFee" && (
              <>
                {formatPrice(price)} × {printData.numberOfTires}本<br />¥
              </>
            )}
            {formatPrice(multipliedFee)}
          </span>
          <span>→</span>
          <span className="ml-2 font-semibold">無料！</span>
        </div>
      );
    } else if (discountRate > 0) {
      const discountedPrice = applyDiscount(multipliedFee, discountRate);
      return (
        <div>
          <span className="mr-2 line-through decoration-double decoration-2">
            {feeType !== "tireStorageFee" && (
              <>
                {formatPrice(price)} × {printData.numberOfTires}本<br />¥
              </>
            )}
            {formatPrice(multipliedFee)}
          </span>
          <span className="font-semibold">¥{formatPrice(discountedPrice)}</span>
          <span className="ml-2 text-xs">({discountRate}%割引)</span>
        </div>
      );
    } else {
      return (
        <div>
          <span>
            {feeType !== "tireStorageFee" && (
              <>
                {formatPrice(price)} × {printData.numberOfTires}本<br />
              </>
            )}
          </span>
          <span className="font-semibold">¥{formatPrice(multipliedFee)}</span>
        </div>
      );
    }
  };

  return (
    <div ref={ref} className="m-8 font-sans print:leading-tight">
      <h1 className="mb-8 text-center text-4xl font-bold">タイヤ見積書</h1>

      <div className="mb-4">
        <div className="grid grid-cols-2">
          <div className="flex flex-col space-y-2">
            <p className="text-left text-2xl">
              お客様名:{" "}
              <span className="text-2xl font-semibold">
                {printData.customerName}
              </span>
            </p>
            <p className="text-left text-2xl">
              車種: <span className="font-semibold">{printData.carModel}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p>
              発行日:{" "}
              <span className="font-semibold">
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p>
              有効期限:{" "}
              <span className="font-semibold">
                {new Date(printData.expiryDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p>見積番号: {printData.quotationNumber}</p>
            <p>
              担当者:{" "}
              <span className="font-semibold">{printData.staffName}</span>
            </p>
          </div>
        </div>
      </div>

      <table className="mb-4 w-full border-collapse border border-gray-800 print:text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-1">項目</th>
            {printData.tires.map((tire, index) => (
              <th key={index} className="border border-gray-800 p-1">
                {tire.manufacturer} {tire.pattern}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-800 p-1 font-semibold">
              タイヤサイズ
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-1">
                {tire.tireSize}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-800 p-1 font-semibold">
              タイヤ価格
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-1">
                <div>
                  {formatPrice(
                    Math.ceil((tire.tirePrice * tire.priceRate) / 10) * 10,
                  )}{" "}
                  × {printData.numberOfTires}本
                </div>
                <div className="font-semibold">
                  ¥
                  {formatPrice(
                    Math.ceil((tire.tirePrice * tire.priceRate) / 10) *
                      10 *
                      printData.numberOfTires,
                  )}
                </div>
              </td>
            ))}
          </tr>
          {printData.checkBoxState.laborFee && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                作業工賃（入替・バランス）
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-1">
                  {renderDiscountedPrice(
                    fee.laborFee,
                    printData.discountRate.laborFee,
                    "laborFee",
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.removalFee && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                脱着工賃
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-1">
                  {renderDiscountedPrice(
                    fee.removalFee,
                    printData.discountRate.removalFee,
                    "tireDisposalFee",
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.tireDisposalFee && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                廃タイヤ処分
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td
                  key={index}
                  className="border border-gray-800 p-1 font-semibold"
                >
                  {formatPrice(fee.tireDisposalFee)} × {printData.numberOfTires}
                  本<br />¥
                  {formatPrice(fee.tireDisposalFee * printData.numberOfTires)}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.tireStorageFee && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                タイヤ預かり料
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-1">
                  {renderDiscountedPrice(
                    fee.tireStorageFee,
                    printData.discountRate.tireStorageFee,
                    "tireStorageFee",
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.wheels.length !== 0 && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                ホイール
              </td>
              {/* ここでホイールの設定をする。Edit here later and delete this comment after finish */}
              {printData.tires.map((_, index) => {
                return printData.wheels[index].isIncluded ? (
                  <td key={index} className="border border-gray-800 p-1">
                    <p>
                      {printData.wheels[index].name} (
                      {printData.wheels[index].size})
                    </p>
                    <div className="font-semibold">
                      ¥{formatPrice(wheelTotals[index])}
                    </div>
                  </td>
                ) : (
                  <td key={index} className="border border-gray-800 p-1">
                    <p>なし</p>
                  </td>
                );
              })}
            </tr>
          )}

          {extraOptionsTotal > 0 && (
            <tr>
              <td className="border border-gray-800 p-1 font-semibold">
                その他オプション
              </td>
              {printData.tires.map((_, index) => (
                <td
                  key={index}
                  className="border border-gray-800 p-1 font-semibold"
                >
                  ¥{formatPrice(extraOptionsTotal)}
                </td>
              ))}
            </tr>
          )}
          <tr>
            <td className="border border-gray-800 p-1 font-semibold">
              消費税（10%）
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-1">
                <div className="font-semibold">
                  ¥
                  {formatPrice(
                    (calculateTotalPrice(
                      tire,
                      printData.serviceFees[index],
                      printData.discountRate,
                    ) +
                      extraOptionsTotal +
                      wheelTotals[index]) *
                      (TAX_RATE - 1.0),
                  )}
                </div>
              </td>
            ))}
          </tr>
          <tr className="bg-gray-200">
            <td className="border border-gray-800 p-1 font-semibold">
              合計金額（税込）
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-1 font-bold">
                ¥
                {formatPrice(
                  (calculateTotalPrice(
                    tire,
                    printData.serviceFees[index],
                    printData.discountRate,
                  ) +
                    extraOptionsTotal +
                    wheelTotals[index]) *
                    TAX_RATE,
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {extraOptionsTotal > 0 && (
        <div className="avoid-page-break mb-4">
          <h2 className="mb-2 text-xl font-semibold print:text-lg">
            その他のオプション内訳
          </h2>
          <table className="w-full border-collapse border border-gray-800 print:text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-1">オプション</th>
                <th className="border border-gray-800 p-1">価格</th>
                <th className="border border-gray-800 p-1">数量</th>
                <th className="border border-gray-800 p-1">小計</th>
              </tr>
            </thead>
            <tbody>
              {printData.extraOptions.map((option, index) => (
                <tr key={index}>
                  <td className="border border-gray-800 p-1">
                    {option.option}
                  </td>
                  <td className="border border-gray-800 p-1">
                    ¥{formatPrice(option.price)}
                  </td>
                  <td className="border border-gray-800 p-1">
                    {option.quantity}
                  </td>
                  <td className="border border-gray-800 p-1">
                    ¥{formatPrice(option.price * option.quantity)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td
                  colSpan={3}
                  className="border border-gray-800 p-1 text-right"
                >
                  合計
                </td>
                <td className="border border-gray-800 p-1">
                  ¥{formatPrice(extraOptionsTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col items-end">
        <Image src="/TakeuchiPartLogo.jpg" alt="ロゴ" width={300} height={88} />
        <span className="">{QUALIFIED_INVOICE_ISSUER_REGISTRATION_NUMBER}</span>
      </div>
    </div>
  );
});

export default PrintContent;
