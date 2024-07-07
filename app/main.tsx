"use Client";
import { Result, TireData } from "@/utils/interface";
import {
  getAllTireInformation,
  getAllTireSize,
  getCustomerTypePriceRate,
  getAllTiresBySize,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Main = () => {
  const [CustomerTypePriceRate, setCustomerTypePriceRate] = useState<
    null | any[]
  >(null);
  const [tireSizeOptions, setTireSizeOptions] = useState<any>([]);
  const [customerType, setCustomerType] = useState<string>("");

  const [selectedData, setSelectedData] = useState<TireData>({
    priceRate: 0,
    theNumberOfTire: 1,
    tireSize: "",
  });

  const [results, setResults] = useState<Result[]>([]);

  // お客さんのタイプのよる価格の掛け率を取得
  useEffect(() => {
    const getRate = async () => {
      const rates = await getCustomerTypePriceRate();
      setCustomerTypePriceRate(rates.data);
      console.log("rates.data = ", rates.data);
    };
    getRate();
  }, []);

  // タイヤサイズの情報を取得
  useEffect(() => {
    const getTireSize = async () => {
      const size = await getAllTireSize();
      const uniqueSizesSet = new Set();
      if (size.data === null) return;
      size.data.forEach((item) => {
        uniqueSizesSet.add(item.size);
      });
      const uniqueSizes = Array.from(uniqueSizesSet);
      setTireSizeOptions(uniqueSizes);
      console.log("tireInfo = ", uniqueSizes);
    };
    getTireSize();
  }, []);

  // setStateが非同期だから、ここでconsole.logを行う
  useEffect(() => {
    console.log("selectedData = ", selectedData);
  }, [selectedData]);

  // プロップスの受け取り方に問題あり。
  const handleCustomerChange = (e: any) => {
    console.log("CustomerType = ", e);
    setCustomerType(e);
    selectedData.priceRate = e / 100;
    console.log("selectedData = ", selectedData);
  };

  const handleTireSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedData({
      ...selectedData,
      tireSize: e.target.value,
    });
  };

  const handleTheNumberOfTiresChange = (e: any) => {
    setSelectedData({
      ...selectedData,
      theNumberOfTire: e.target.value,
    });
  };

  const handleButtonClick = async () => {
    console.log("button clicked");
    if(selectedData.tireSize === "" || selectedData.priceRate === 0 || selectedData.theNumberOfTire === 0) {
      console.log("必要な情報が入力されていません。")
      return;
    }
    const res = await getAllTiresBySize(selectedData.tireSize);
    if (res.data === null) {
      alert("タイヤの情報が見つかりませんでした。");
      return;
    } else {
      console.log("res.data = ", res.data);
      // const tirePrice = res.data[0].price;
      // const totalPrice =
      //   tirePrice * selectedData.theNumberOfTire * selectedData.priceRate;
      // console.log("totalPrice = ", totalPrice);
      setResults([]);
      res.data.forEach((tire: any, index) => {
        const tirePrice = res.data[index].price;
        const totalPrice =
          tirePrice * selectedData.theNumberOfTire * selectedData.priceRate;
        setResults((results) => [
          ...results,
          {
            brandName: tire.brandName,
            modelName: tire.modelName,
            intermediateCalculation: `${tirePrice} * ${selectedData.theNumberOfTire} * ${selectedData.priceRate}`,
            price: totalPrice,
          },
        ]);
      });
    }
  };

  return (
    <div className="mt-8 flex">
      {/* 左側の部分 */}
      <div className="w-1/2 flex flex-col justify-center space-x-8 space-y-8 place-items-center">
        <div className="space-x-4">
          <label className="text-xl">お客さんを選択</label>
          <select
            onChange={(e) => handleCustomerChange(e.target.value)}
            value={customerType}
            className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value=""></option>
            {/* ここで表示する文字列とvalue値が異なるので注意 */}
            {CustomerTypePriceRate &&
              CustomerTypePriceRate.map((rate) => (
                <option key={uuidv4()} value={rate.percent}>
                  {rate.target}
                </option>
              ))}
          </select>
        </div>
        <div className="space-x-4">
          <label htmlFor="tireSize" className="text-xl">
            タイヤサイズを選択
          </label>
          <select
            className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedData.tireSize}
            onChange={(e) => handleTireSizeChange(e)}
          >
            <option value=""></option>
            {tireSizeOptions.map((size: string) => (
              <option key={uuidv4()} value={String(size)}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="space-x-4">
          <label className="text-xl">数量</label>
          <input
            type="text"
            onChange={(e) => handleTheNumberOfTiresChange(e)}
            defaultValue={selectedData.theNumberOfTire}
            className="p-2 w-1/3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          className=" bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleButtonClick()}
        >
          この内容で見積もる！
        </button>
      </div>
      {/* 右側部分 */}
      <div className="w-1/2 flex flex-col justify-center space-x-8 space-y-8 place-items-center">
        <p className="text-2xl">見積もり結果</p>
        {results.map((result, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-xl font-medium">
              検索結果<span className="text-xl p-2">{index + 1}</span>
            </p>
            <span>会社名 : {result.brandName}</span>
            <span>モデル名 : {result.modelName}</span>
            <span>途中計算式 : {result.intermediateCalculation}</span>
            <span className="font-medium">金額 : {result.price}円</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
