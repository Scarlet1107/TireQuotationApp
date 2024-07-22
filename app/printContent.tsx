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
          <p className="mt-6 flex justify-center text-xl p-4">
            お見積もりありがとうございます。以下の内容でお見積もりを作成いたしました。
          </p>
          <h1>会社名 : {result.brandName}</h1>
          <p>モデル名 : {result.modelName}</p>
          <p>途中計算式 : {result.intermediateCalculation}</p>
          <p>金額 : {result.price}円</p>
        </div>
      </div>
    );
  },
);

export default  PrintContent;
