"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";
import AlertButton from "./AlertButton";
import CSVUploader from "./CSVUploader";

const page = () => {
  const handleClick = async (tableName: string) => {
    try {
      await deleteAllData(tableName);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Header />

      <div className="mt-10 flex">
        <div className="w-2/3">
          <CSVUploader />
        </div>
        <div className="w-1/3">
          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("tirePrice")}
          >
            tirePriceの消去
          </AlertButton>

          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("ServiceFees")}
          >
            ServiceFeesの消去
          </AlertButton>

          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("CustomerTypePriceRate")}
          >
            CustomerTypePriceRateの消去
          </AlertButton>
        </div>
      </div>
    </div>
  );
};

export default page;
