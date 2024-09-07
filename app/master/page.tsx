"use client";
import React from "react";
import Header from "@/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";
import ManualComponent from "./mannual";
import TableManage from "./TableManage";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Page = () => {
  const { toast } = useToast();
  const handleClick = async (tableName: string) => {
    try {
      await deleteAllData(tableName);
      toast({
        title: "成功",
        description: `${tableName}のデータが正常に削除されました`,
        variant: "default",
      });
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
      <Toaster />
    </div>
  );
};

export default Page;
