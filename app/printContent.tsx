import React, { useEffect, useState } from "react";
import { PrintData, ServiceFee } from "@/utils/interface";
import { searchTireByID } from "@/utils/supabaseFunctions";

interface Props {
  printData: PrintData;
}

const PrintContent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  PrintContent.displayName = "PrintContent";
  const { printData } = props;

  useEffect(() => {
    printData.ids.forEach(async (id) => {
      const tire = await searchTireByID(id);
      // const rank = tire.data.rank;
    });
  }, [printData]);

  return (
    <div ref={ref} className="m-8">
      <h1>This is print content</h1>

      <p className="mt-2 flex justify-center">ここにメーカーを表示</p>
      <div className="flex space-x-4">
        {printData.tires.map((tire, index) => (
          <p key={index} className="">{tire.manufacturer}</p>
        ))}
      </div>

      <p className="mt-2 flex justify-center">パターンを表示</p>
      <div className="flex space-x-4">
        {printData.tires.map((tire, index) => (
          <p key={index} className="">{tire.pattern}</p>
        ))}
      </div>

      <p className="mt-2 flex justify-center">タイヤサイズを表示</p>
      <div className="flex space-x-4">
        {printData.tires.map((tire, index) => (
          <p key={index} className="">{tire.tireSize}</p>
        ))}
      </div>

      <p className="mt-2 flex justify-center">タイヤの金額を表示（掛け率計算あと、１０の位で切り上げ）</p>
      <div className="flex space-x-4">
        {printData.tires.map((tire, index) => (
          <p key={index} className="">{Math.ceil(tire.tirePrice * tire.priceRate / 10) * 10}</p>
        ))}
      </div>

      <p className="mt-2 flex justify-center">工賃ランク</p>
      <div className="flex space-x-4">
        {printData.serviceFees.map((fee, index) => (
          <p key={index} className="">{fee.rank}</p>
        ))}
      </div>
      
      <p className="mt-2 flex justify-center">作業工賃</p>
      <div className="flex space-x-4">
        {printData.serviceFees.map((fee, index) => (
          <p key={index} className="">{fee.laborFee}</p>
        ))}
      </div>

      <p className="mt-2 flex justify-center">脱着工賃</p>
      <div className="flex space-x-4">
        {printData.serviceFees.map((fee, index) => (
          <p key={index} className="">{fee.removalFee}</p>
        ))}
      </div>

      <p>Customer Name: {printData.customerName}</p>
      <p>Car Model: {printData.carModel}</p>
      <p>Expiry Date: {printData.expiryDate.toString()}</p>
      <p>Number of Tires: {printData.numberOfTires}</p>
      <p>Wheel Name: {printData.wheel.name}</p>
      <p>Wheel Size: {printData.wheel.size}</p>
      <p>Wheel Quantity: {printData.wheel.quantity}</p>
      <p>Wheel Price: {printData.wheel.price}</p>
      <p>Extra Options:</p>
      {printData.extraOptions.map((option, index) => (
        <div key={index}>
          <p>Option: {option.option}</p>
          <p>Price: {option.price}</p>
          <p>Quantity: {option.quantity}</p>
        </div>
      ))}
      <p>Checkbox State:</p>
      <p>Labor Fee: {printData.checkBoxState.laborFee ? "True" : "False"}</p>
      <p>
        Removal Fee: {printData.checkBoxState.removalFee ? "True" : "False"}
      </p>
      <p>
        Tire Storage Fee:{" "}
        {printData.checkBoxState.tireStorageFee ? "True" : "False"}
      </p>
      <p>
        Tire Disposal Fee:{" "}
        {printData.checkBoxState.tireDisposalFee ? "True" : "False"}
      </p>
      <p>Discount Rate:</p>
      <p>Labor Fee: {printData.discountRate.laborFee}</p>
      <p>Removal Fee: {printData.discountRate.removalFee}</p>
      <p>Tire Storage Fee: {printData.discountRate.tireStorageFee}</p>
      <p>{printData.ids}</p>
    </div>
  );
});

export default PrintContent;
