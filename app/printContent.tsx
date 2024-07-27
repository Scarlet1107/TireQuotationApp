import React from "react";
import { Result } from "@/utils/interface";

interface Props {
  result: Result;
}

const PrintContent = React.forwardRef<HTMLDivElement, Props>(
  function ComponentToPrint(props, ref) {
    const { result } = props;

    return (
      <div ref={ref} className="mt-4 flex justify-center">
        <div>
          <h1 className="flex justify-center text-2xl">
            スタッドレスタイヤ御見積書
          </h1>
          <p className="mt-6 flex justify-center p-4 text-xl">
            お見積もりありがとうございます。以下の内容でお見積もりを作成いたしました。
          </p>
          <h1>会社名 : {result.brandName}</h1>
          <p>モデル名 : {result.modelName}</p>
          <p>
            タイヤホイール :
            {Math.ceil(
              (result.tirePrice * result.numberOfTires * result.priceRate) / 10,
            ) * 10}
            円
          </p>
          <p>
            {" "}
            {result.serviceFee.laborFee !== 0 ? (
              <span>作業工賃 : {result.serviceFee.laborFee}円</span>
            ) : (
              ""
            )}{" "}
          </p>
          <p>
            {result.serviceFee.removalFee !== 0 ? (
              <span>脱着工賃 : {result.serviceFee.removalFee}円</span>
            ) : (
              ""
            )}{" "}
          </p>
          <p>
            {result.serviceFee.tireDisposalFee !== 0 ? (
              <span>廃タイヤ処分 : {result.serviceFee.tireDisposalFee}円</span>
            ) : (
              ""
            )}{" "}
          </p>
          {result.extraOptions.length > 0 && (
            <div>
              <ul>
                {result.extraOptions.map((option) => (
                  <li key={option.id}>
                    {option.option} : {option.price} × {option.quantity} ={" "}
                    {option.price * option.quantity}円
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p>金額 : {result.totalPrice}円</p>
        </div>
      </div>
    );
  },
);

export default PrintContent;
