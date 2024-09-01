import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AlertButton from "./AlertButton";
import UploadButton from "./UploadButton";
import ExportButton from "./ExportButton";

interface Props {
  handleClick: (tableName: string) => void;
}

const TableManage: React.FC<Props> = ({ handleClick }) => {
  return (
    <div className="flex">
      <Card>
        <CardHeader>
          <CardTitle>tirePrice</CardTitle>
          <CardDescription>A表</CardDescription>
        </CardHeader>

        <CardContent>
          <UploadButton tableName="tirePrice"> tirePrice </UploadButton>
          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("tirePrice")}
          >
            tirePriceの消去
          </AlertButton>
          <ExportButton>tirePrice</ExportButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ServiceFees</CardTitle>
          <CardDescription>対A表</CardDescription>
        </CardHeader>

        <CardContent>
          <UploadButton tableName="ServiceFees"> ServiceFees</UploadButton>
          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("ServiceFees")}
          >
            ServiceFeesの消去
          </AlertButton>
          <ExportButton>ServiceFees</ExportButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CustomerTypePriceRate</CardTitle>
          <CardDescription>販売者に対するレート</CardDescription>
        </CardHeader>

        <CardContent>
          <UploadButton tableName="CustomerTypePriceRate">
            {" "}
            CustomerTypePriceRate
          </UploadButton>
          <AlertButton
            message="現在のデータを消去しても良いですか？"
            onPush={() => handleClick("CustomerTypePriceRate")}
          >
            CustomerTypePriceRateの消去
          </AlertButton>
          <ExportButton>CustomerTypePriceRate</ExportButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableManage;
