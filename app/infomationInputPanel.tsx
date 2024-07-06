"use Client";
import {
  getAllTireInformation,
  getAllTireSize,
  getCustomerTypePriceRate,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const InfomationInputPanel = () => {
  const [CustomerTypePriceRate, setCustomerTypePriceRate] = useState<
    null | any[]
  >(null);
  const [tireSize, setTireSize] = useState<any>([]);
  const [customerType, setCustomerType] = useState<string>("");

  useEffect(() => {
    const getRate = async () => {
      const rates = await getCustomerTypePriceRate();
      setCustomerTypePriceRate(rates.data);
      console.log("rates.data = ", rates.data);
    };
    getRate();
  }, []);

  useEffect(() => {
    const getTireSize = async () => {
      const size = await getAllTireSize();
      const uniqueSizesSet = new Set();
      if (size.data === null) return;
      size.data.forEach((item) => {
        uniqueSizesSet.add(item.size);
      });
      const uniqueSizes = Array.from(uniqueSizesSet);
      setTireSize(uniqueSizes);
      console.log("tireInfo = ", uniqueSizes);
    };
    getTireSize();
  }, []);

  const handleCustomerChange = (e: any) => {
    console.log("customerType = ", e.target.value);
    setCustomerType(e.target.value);
  };

  const handleClick = () => {
    priceRate = CustomerTypePriceRate.percent;
    console.log("clicked");
  };

  return (
    <div className="w-1/2 flex flex-col justify-center space-x-8 space-y-8 place-items-center mt-4">
      <div className="space-x-4">
        <label className="text-xl">お客さんを選択</label>
        <select onChange={(e) => handleCustomerChange(e)} className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          {CustomerTypePriceRate &&
            CustomerTypePriceRate.map((item) => (
              <option
                key={item.target}
                value={item.target}
                
              >
                {item.target}
              </option>
            ))}
        </select>
      </div>
      <div className="space-x-4">
        <label htmlFor="tireSize" className="text-xl">
          タイヤサイズを選択
        </label>
        <select className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          {tireSize.map((size: string) => (
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
          className="p-2 w-1/3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        className=" bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleClick()}
      >
        この内容で見積もる！
      </button>
    </div>
  );
};

export default InfomationInputPanel;
