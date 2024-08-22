import React from "react";
import { PrintData, ServiceFee, DiscoundRate } from "@/utils/interface";
import { TAX_RATE } from "@/config/constants";
import Image from "next/image";

interface Props {
  printData: PrintData;
}

const PrintContent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  PrintContent.displayName = "PrintContent";
  const { printData } = props;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  const applyDiscount = (price: number, discountRate: number) => {
    return price * (1 - discountRate / 100);
  };

  const calculateTotalPrice = (
    tire: any,
    fee: ServiceFee,
    discountRate: DiscoundRate,
  ) => {
    let total =
      Math.ceil((tire.tirePrice * tire.priceRate) / 10) *
      10 *
      printData.numberOfTires;
    if (printData.checkBoxState.laborFee)
      total += applyDiscount(fee.laborFee, discountRate.laborFee);
    if (printData.checkBoxState.removalFee)
      total += applyDiscount(fee.removalFee, discountRate.removalFee);
    if (printData.checkBoxState.tireStorageFee)
      total += applyDiscount(fee.tireStorageFee, discountRate.tireStorageFee);
    if (printData.checkBoxState.tireDisposalFee) total += fee.tireDisposalFee;
    return total;
  };

  const calculateExtraOptionsTotal = () => {
    return printData.extraOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0,
    );
  };

  const extraOptionsTotal = calculateExtraOptionsTotal();

  // if (printData.wheel.isIncluded) {
  const wheelTotal = printData.wheel.price * printData.wheel.quantity;
  // }

  const renderDiscountedPrice = (price: number, discountRate: number) => {
    if (discountRate === 100) {
      return (
        <div>
          <span className="mr-2 line-through decoration-double decoration-2">
            ¥{formatPrice(price)}
          </span>
          <span>→</span>
          <span className="ml-2 font-semibold">無料！</span>
        </div>
      );
    } else {
      const discountedPrice = applyDiscount(price, discountRate);
      return (
        <div>
          {discountRate > 0 && (
            <span className="mr-2 line-through decoration-double decoration-2">
              ¥{formatPrice(price)}
            </span>
          )}
          <span className="font-semibold">¥{formatPrice(discountedPrice)}</span>
          {discountRate > 0 && (
            <span className="ml-2 text-xs">({discountRate}%割引)</span>
          )}
        </div>
      );
    }
  };

  return (
    <div ref={ref} className="m-8 font-sans text-sm">
      <h1 className="mb-4 text-center text-2xl font-bold">御見積書</h1>

      <p className="mb-4 text-center text-xl">
        お見積りいただきありがとうございます。以下の内容でお見積りを作成いたしました。
      </p>

      <div className="mb-4">
        <div className="flex justify-between">
          <p>
            お客様名:{" "}
            <span className="font-semibold">{printData.customerName}</span>
          </p>
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
        </div>
        <div className="flex justify-between">
          <p>
            車種: <span className="font-semibold">{printData.carModel}</span>
          </p>
          <p>
            有効期限:{" "}
            <span className="font-semibold">
              {printData.expiryDate.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>

      <table className="mb-4 w-full border-collapse border border-gray-800">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-2">項目</th>
            {printData.tires.map((tire, index) => (
              <th key={index} className="border border-gray-800 p-2">
                {tire.manufacturer} {tire.pattern}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-800 p-2 font-semibold">
              タイヤサイズ
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-2">
                {tire.tireSize}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-800 p-2 font-semibold">
              タイヤ価格
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-2">
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
              <td className="border border-gray-800 p-2 font-semibold">
                作業工賃（入替・バランス）
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  {renderDiscountedPrice(
                    fee.laborFee,
                    printData.discountRate.laborFee,
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.removalFee && (
            <tr>
              <td className="border border-gray-800 p-2 font-semibold">
                脱着工賃
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  {renderDiscountedPrice(
                    fee.removalFee,
                    printData.discountRate.removalFee,
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.tireDisposalFee && (
            <tr>
              <td className="border border-gray-800 p-2 font-semibold">
                廃タイヤ処分
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  ¥{formatPrice(fee.tireDisposalFee)}
                </td>
              ))}
            </tr>
          )}
          {printData.checkBoxState.tireStorageFee && (
            <tr>
              <td className="border border-gray-800 p-2 font-semibold">
                タイヤ預かり料
              </td>
              {printData.serviceFees.map((fee, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  {renderDiscountedPrice(
                    fee.tireStorageFee,
                    printData.discountRate.tireStorageFee,
                  )}
                </td>
              ))}
            </tr>
          )}
          {printData.wheel.isIncluded && (
            <tr>
              <td className="border border-gray-800 p-2 font-semibold">
                ホイール
              </td>
              {printData.tires.map((_, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  <div className="font-semibold">
                    ¥{formatPrice(wheelTotal)}
                  </div>
                </td>
              ))}
            </tr>
          )}
          {extraOptionsTotal > 0 && (
            <tr>
              <td className="border border-gray-800 p-2 font-semibold">
                その他オプション
              </td>
              {printData.tires.map((_, index) => (
                <td key={index} className="border border-gray-800 p-2">
                  ¥{formatPrice(extraOptionsTotal)}
                </td>
              ))}
            </tr>
          )}
          <tr className="bg-gray-200">
            <td className="border border-gray-800 p-2 font-semibold">
              合計金額（税込）
            </td>
            {printData.tires.map((tire, index) => (
              <td key={index} className="border border-gray-800 p-2 font-bold">
                ¥
                {formatPrice(
                  (calculateTotalPrice(
                    tire,
                    printData.serviceFees[index],
                    printData.discountRate,
                  ) +
                    extraOptionsTotal +
                    (printData.wheel.isIncluded ? wheelTotal : 0)) *
                    TAX_RATE,
                )}
                <span className="mx-2">
                  (内税
                  <span className="mx-1">
                    ¥
                    {formatPrice(
                      (calculateTotalPrice(
                        tire,
                        printData.serviceFees[index],
                        printData.discountRate,
                      ) +
                        extraOptionsTotal +
                        (printData.wheel.isIncluded ? wheelTotal : 0)) *
                        (TAX_RATE - 1.0),
                    )}
                    )
                  </span>
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {printData.wheel.isIncluded && (
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">ホイール詳細</h2>
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">ホイール名</th>
                <th className="border border-gray-800 p-2">サイズ</th>
                <th className="border border-gray-800 p-2">価格</th>
                <th className="border border-gray-800 p-2">数量</th>
                <th className="border border-gray-800 p-2">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2">
                  {printData.wheel.name}
                </td>
                <td className="border border-gray-800 p-2">
                  {printData.wheel.size}
                </td>
                <td className="border border-gray-800 p-2">
                  ¥{formatPrice(printData.wheel.price)}
                </td>
                <td className="border border-gray-800 p-2">
                  {printData.wheel.quantity}本
                </td>
                <td className="border border-gray-800 p-2 font-semibold">
                  ¥{formatPrice(wheelTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {extraOptionsTotal > 0 && (
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">その他のオプション内訳</h2>
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">オプション</th>
                <th className="border border-gray-800 p-2">価格</th>
                <th className="border border-gray-800 p-2">数量</th>
                <th className="border border-gray-800 p-2">小計</th>
              </tr>
            </thead>
            <tbody>
              {printData.extraOptions.map((option, index) => (
                <tr key={index}>
                  <td className="border border-gray-800 p-2">
                    {option.option}
                  </td>
                  <td className="border border-gray-800 p-2">
                    ¥{formatPrice(option.price)}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {option.quantity}
                  </td>
                  <td className="border border-gray-800 p-2">
                    ¥{formatPrice(option.price * option.quantity)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td
                  colSpan={3}
                  className="border border-gray-800 p-2 text-right"
                >
                  合計
                </td>
                <td className="border border-gray-800 p-2">
                  ¥{formatPrice(extraOptionsTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end text-xs">
        <Image src="/TakeuchiPartLogo.jpg" alt="ロゴ" width={300} height={90} />
      </div>
    </div>
  );
});

export default PrintContent;
