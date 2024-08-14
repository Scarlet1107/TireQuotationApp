"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";
import AlertButton from "./AlertButton";

import CSVUploader from "./CSVUploader";

const page = () => {
  const deleteData = async () => {
    try {
      await deleteAllData();
    } catch (error) {
      console.error(error);
    }
  };
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
      <div className="mt-10 flex">
        <div className="w-1/2">
          <CSVUploader />
        </div>
        <div className="w-1/2">
          <button
            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            onClick={() => handleClick()}
          >
            テーブルのデータをすべて削除する
          </button>
          <AlertButton></AlertButton>
        </div>
      </div>
    </div>
  );
};

export default page;
