"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import { deleteAllData } from "@/utils/supabaseFunctions";
import ManualComponent from "./mannual";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import AlertButton from "./AlertButton";
import UploadButton from "./UploadButton";
import ExportButton from "./ExportButton";
import DataExist from "./DataExist";
import HandlePrintLog from "./HandlerPrintLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const [tireExist, setTireExist] = useState<boolean | null>(null);
  const [serviceExist, setServiceExist] = useState<boolean | null>(null);
  const [customerExist, setCustomerExist] = useState<boolean | null>(null);

  const { toast } = useToast();

  const [trigger, setTrigger] = useState(0);

  const handleChange = () => {
    setTrigger((prev) => prev + 1);
  };
  const handleClick = async (tableName: string, exchange: boolean) => {
    try {
      await deleteAllData(tableName);
      if (exchange) {
        toast({
          title: "成功",
          description: `${tableName}のデータが正常に削除されました`,
          variant: "default",
        });
      }
      handleChange();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="overflow-y-auto">
      <Header />

      <div className="mt-10 flex place-content-center">
        <div>
          <div className="flex justify-between">
            <Card className="m-4">
              <CardHeader>
                <CardTitle>tirePrice</CardTitle>
                <CardDescription>A表</CardDescription>

                <DataExist
                  tableName="tirePrice"
                  trigger={trigger}
                  exist={tireExist}
                  setExist={setTireExist}
                />
              </CardHeader>

              <CardContent>
                <UploadButton
                  tableName="tirePrice"
                  handleChange={() => handleChange()}
                  handleClick={() => handleClick("tirePrice", false)}
                  exist={tireExist}
                />

                <AlertButton onPush={() => handleClick("tirePrice", true)}>
                  tirePrice
                </AlertButton>
                <ExportButton>tirePrice</ExportButton>
              </CardContent>
            </Card>

            <Card className="m-4">
              <CardHeader>
                <CardTitle>ServiceFees</CardTitle>
                <CardDescription>対A表</CardDescription>
                <DataExist
                  tableName="ServiceFees"
                  trigger={trigger}
                  exist={serviceExist}
                  setExist={setServiceExist}
                />
              </CardHeader>

              <CardContent>
                <UploadButton
                  tableName="ServiceFees"
                  handleChange={() => handleChange()}
                  handleClick={() => handleClick("ServiceFees", false)}
                  exist={serviceExist}
                />
                <AlertButton onPush={() => handleClick("ServiceFees", true)}>
                  ServiceFees
                </AlertButton>
                <ExportButton>ServiceFees</ExportButton>
              </CardContent>
            </Card>

            <Card className="m-4">
              <CardHeader>
                <CardTitle>CustomerTypePriceRate</CardTitle>
                <CardDescription>販売者に対するレート</CardDescription>
                <DataExist
                  tableName="CustomerTypePriceRate"
                  trigger={trigger}
                  exist={customerExist}
                  setExist={setCustomerExist}
                />
              </CardHeader>

              <CardContent>
                <UploadButton
                  tableName="CustomerTypePriceRate"
                  handleChange={() => handleChange()}
                  handleClick={() =>
                    handleClick("CustomerTypePriceRate", false)
                  }
                  exist={customerExist}
                />
                <AlertButton
                  onPush={() => handleClick("CustomerTypePriceRate", true)}
                >
                  CustomerTypePriceRate
                </AlertButton>
                <ExportButton>CustomerTypePriceRate</ExportButton>
              </CardContent>
            </Card>

            <Card className="m-4">
              <CardHeader>
                <CardTitle>printLogs</CardTitle>
                <CardDescription>履歴テーブル</CardDescription>
              </CardHeader>
              <HandlePrintLog />
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ManualComponent />
      <Toaster />
    </div>
  );
};

export default Page;
