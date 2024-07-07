"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";


import CSVUploader from "./CSVUploader";

const page = () => {
  const handleClick = async () => {
    try {
      await deleteAllData();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Header />
      <div className="flex mt-10">
          <div className="w-1/2">
              <CSVUploader />
          </div>
          <div className="w-1/2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleClick()}
              >
                テーブルのデータをすべて削除する
              </button>
          </div>
      </div>
    </div>
  );
};

export default page;
