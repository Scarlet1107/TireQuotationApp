"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";
import ManualComponent from "./mannual";
import TableManage from "./TableManage";

const page = () => {
  const handleClick = async (tableName: string) => {
    try {
      await deleteAllData(tableName);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="overflow-y-auto">
      <Header />

      <div className="mt-10 flex place-content-center">
        <div>
          <TableManage handleClick={handleClick} />
        </div>
      </div>
      <ManualComponent />
    </div>
  );
};

export default page;
