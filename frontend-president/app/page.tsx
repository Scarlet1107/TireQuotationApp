"use client";
import React from "react";
import { useState } from "react";

export default function Home() {
  const [price, setPrice] = useState<number | undefined>(undefined);

  const calcPrice = () => {
    const randomPrice = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
    setPrice(randomPrice);
  };

  const handleApply = () => {
    alert("申し込みが完了しました！");
  };

  return (
    <main className="">
      <header className="bg-blue-500 p-4 flex justify-around mb-4">
        <div className="text-5xl font-medium">見積もりアプリ試作品</div>
      </header>

      <div className="flex h-screen justify-center">
        <div className="w-1/2 p-4 space-x-4">
          <h1 className="text-3xl flex justify-center p-2 font-bold">
            クルマの買い取り見積りはこちら！
          </h1>
          <div className="flex m-4">
            <p className="text-2xl mr-2">車種</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex m-4">
            <p className="text-2xl mr-2">走行距離</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex m-4">
            <p className="text-2xl mr-2">車検満了日</p>
            <select className="border mr-2 border-gray-300 rounded-md p-2">
              <option value="2021年">2021年</option>
              <option value="2022年">2022年</option>
              <option value="2023年">2023年</option>
              <option value="2024年">2024年</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2">
              <option value="1月">1月</option>
              <option value="2月">2月</option>
              <option value="3月">3月</option>
              <option value="4月">4月</option>
              <option value="5月">5月</option>
              <option value="6月">6月</option>
              <option value="7月">7月</option>
              <option value="8月">8月</option>
              <option value="9月">9月</option>
              <option value="10月">10月</option>
              <option value="11月">11月</option>
              <option value="12月">12月</option>
            </select>
          </div>

          <button
            className="bg-blue-500 text-white p-2 rounded-md m-8"
            onClick={() => calcPrice()}
          >
            見積もり開始！
          </button>
        </div>

        <div className="w-1/2">
          <p className="text-4xl">見積もり結果</p>
          <div>
            <input
              type="text"
              value={price}
              className="border border-gray-300 rounded-md p-2 w-1/6 mt-10"
            />
            <span className="text-2xl">円</span>
          </div>
          <button
            className="bg-green-500 text-white p-2 rounded-md m-8　ml-8 mt-12"
            onClick={() => handleApply()}
          >
            この内容で申し込む！
          </button>
        </div>
      </div>
    </main>
  );
}
