"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";

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
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleClick()}
      >
        テーブルのデータをすべて削除する
      </button>
    </div>
  );
};

export default page;
