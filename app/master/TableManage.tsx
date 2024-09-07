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
          <UploadButton tableName="tirePrice" />
          <AlertButton onPush={() => handleClick("tirePrice")}>
            tirePrice
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
          <UploadButton tableName="ServiceFees" />
          <AlertButton onPush={() => handleClick("ServiceFees")}>
            ServiceFees
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
          <UploadButton tableName="CustomerTypePriceRate" />
          <AlertButton onPush={() => handleClick("CustomerTypePriceRate")}>
            CustomerTypePriceRate
          </AlertButton>
          <ExportButton>CustomerTypePriceRate</ExportButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableManage;
