import React from "react";
import { SearchResult } from "@/utils/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface Props {
  result: SearchResult;
}

const PrintContent = React.forwardRef<HTMLDivElement, Props>(
  function ComponentToPrint(props, ref) {
    const { result } = props;
    const today = format(new Date(), "yyyy年MM月dd日", { locale: ja });
    const deadLine = format(
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      "yyyy年MM月dd日",
      { locale: ja },
    );

    const formatNumber = (num: number) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
      <div ref={ref} className="m-8">
        <Card className="border-2 border-gray-300">
          <CardHeader className="border-b-2 border-gray-300 bg-gray-100 text-center">
            <CardTitle className="text-3xl font-bold">
              スタッドレスタイヤ御見積書
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 flex justify-between">
              <div>
                <p className="font-bold">お客様名: ________________様</p>
                <p>車種: ________________</p>
              </div>
              <div className="text-right">
                <p>見積日: {today}</p>
                <p>有効期限: {deadLine}</p>
              </div>
            </div>

            <p className="mb-6 text-lg">
              お見積もりありがとうございます。以下の内容でお見積もりを作成いたしました。
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">項目</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    タイヤ （{result.manufacturer} {result.pattern}）
                    <br />
                    <span className="text-sm text-gray-600">
                      {result.numberOfTires}本 ×{" "}
                      {formatNumber(
                        Math.ceil((result.tirePrice * result.priceRate) / 1) *
                          1,
                      )}
                      円
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(
                      Math.ceil(
                        (result.tirePrice *
                          result.numberOfTires *
                          result.priceRate) /
                          10,
                      ) * 10,
                    )}
                    円
                  </TableCell>
                </TableRow>
                {result.serviceFee.laborFee !== 0 && (
                  <TableRow>
                    <TableCell>作業工賃（入替・バランス）</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(result.serviceFee.laborFee)}円
                    </TableCell>
                  </TableRow>
                )}
                {result.serviceFee.removalFee !== 0 && (
                  <TableRow>
                    <TableCell>脱着工賃</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(result.serviceFee.removalFee)}円
                    </TableCell>
                  </TableRow>
                )}

                {result.serviceFee.tireStorageFee !== 0 && (
                  <TableRow>
                    <TableCell>タイヤ預かり料</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(result.serviceFee.tireStorageFee)}円
                    </TableCell>
                  </TableRow>
                )}

                {result.serviceFee.tireDisposalFee !== 0 && (
                  <TableRow>
                    <TableCell>廃タイヤ処分</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(result.serviceFee.tireDisposalFee)}円
                    </TableCell>
                  </TableRow>
                )}
                {result.extraOptions.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      {option.option}
                      <br />
                      <span className="text-sm text-gray-600">
                        {formatNumber(option.price)}円 × {option.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(option.price * option.quantity)}円
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 text-right">
              <p className="text-xl font-bold">
                合計金額: {formatNumber(result.totalPrice)}円 （税抜）
              </p>
            </div>

            <div className="mt-8 text-sm">
              <p>※ この見積もりの有効期限は発行日より10日間です。</p>
              <p>
                ※ タイヤの在庫状況により、納期が変更になる場合がございます。
              </p>
              <p>
                ※ ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

export default PrintContent;
