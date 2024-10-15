import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceFee, Wheel } from "@/utils/interface";
import { Separator } from "@/components/ui/separator";
import WheelInputCollapsible from "./WheelInputCollapsible";
import { DEFAULT_WHEEL } from "@/config/constants";
import { usePrintData } from "../printDataContext";

interface PrintDataSheetProps {
  generateQuotationNumber: () => string;
}

const PrintDataEditor = ({ generateQuotationNumber }: PrintDataSheetProps) => {
  const { printData, setPrintData } = usePrintData();
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");
  const [tireSize, setTireSize] = useState<string>("");
  const [tirePrice, setTirePrice] = useState<number>(0);

  const [serviceFee, setServiceFee] = useState<ServiceFee>(() => ({
    rank: "Z", //手打ち入力されたタイヤのランクはZ
    laborFee: 0,
    removalFee: 0,
    tireStorageFee: 0,
    tireDisposalFee: 0,
  }));

  const setEditData = (index: number) => {
    const { tires, serviceFees, wheels } = printData;
    setManufacturer(tires[index].manufacturer);
    setPattern(tires[index].pattern);
    setTireSize(tires[index].tireSize);
    setTirePrice(tires[index].tirePrice);
    setServiceFee(serviceFees[index]);
    setWheel(wheels[index]);
  };

  const applyPrintDataChanges = (index: number) => {
    const newTires = [...printData.tires];
    newTires[index] = {
      manufacturer,
      pattern,
      tireSize,
      tirePrice,
      priceRate: printData.tires[index].priceRate,
    };

    const newServiceFees = [...printData.serviceFees];
    newServiceFees[index] = serviceFee;

    const newWheels = [...printData.wheels];
    newWheels[index] = wheel;

    setPrintData({
      ...printData,
      tires: newTires,
      serviceFees: newServiceFees,
      wheels: newWheels,
      quotationNumber: generateQuotationNumber(),
    });
  };

  const deletePrintData = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // ダイアログが表示されるのを防ぐ

    if (printData.ids[index] === 0) {
      if (
        !window.confirm(
          "このタイヤは手動で追加したタイヤです。データベースに存在しません。本当に削除しますか？",
        )
      ) {
        return;
      }
    }

    const newTires = printData.tires.filter((_, i) => i !== index);
    const newServiceFees = printData.serviceFees.filter((_, i) => i !== index);
    const newWheels = printData.wheels.filter((_, i) => i !== index);
    const newIds = printData.ids.filter((_, i) => i !== index);
    setPrintData({
      ...printData,
      tires: newTires,
      serviceFees: newServiceFees,
      wheels: newWheels,
      ids: newIds,
      quotationNumber: generateQuotationNumber(),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          id="editButton"
          disabled={printData.tires.length === 0}
          className="relative"
        >
          編集
          {printData.ids.length >= 0 && (
            <span
              className={`absolute -right-3 -top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-gray-800 text-center font-bold text-black ${
                printData.ids.length === 1
                  ? "bg-gray-200"
                  : printData.ids.length === 2
                    ? "bg-gray-300"
                    : printData.ids.length === 3
                      ? "bg-gray-400"
                      : "bg-white"
              }`}
            >
              {printData.ids.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-[180vh] w-full max-w-xs overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">見積内容の編集</SheetTitle>
          {/* SheetDescriptionを設定しないと警告が出るため空で配置 */}
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col space-y-6">
          {printData.tires.map((tire, index) => (
            <AlertDialog key={index}>
              <AlertDialogTrigger onClick={() => setEditData(index)} asChild>
                <Card className="cursor-pointer hover:bg-gray-100">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <Button
                        variant="destructive"
                        className="order-1 mb-4 w-max place-self-end md:order-2 md:mb-0"
                        onClick={(e) => deletePrintData(index, e)}
                      >
                        削除
                      </Button>
                      <CardTitle className="order-2 text-left md:order-1">
                        メーカー: {tire.manufacturer}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-left">
                      パターン: {tire.pattern}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-left">
                    <p>タイヤサイズ: {tire.tireSize}</p>
                  </CardContent>
                </Card>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-h-[90vh] w-full max-w-xs overflow-y-auto sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>編集</AlertDialogTitle>
                  <AlertDialogDescription>
                    タイヤの情報を編集できます。
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <Separator />
                <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="manufacturer">メーカー</Label>
                    <Input
                      id="manufacturer"
                      type="text"
                      onChange={(e) => setManufacturer(e.target.value)}
                      value={manufacturer}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pattern">パターン</Label>
                    <Input
                      id="pattern"
                      type="text"
                      onChange={(e) => setPattern(e.target.value)}
                      value={pattern}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tireSize">タイヤサイズ</Label>
                    <Input
                      id="tireSize"
                      type="text"
                      onChange={(e) => setTireSize(e.target.value)}
                      value={tireSize}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tirePrice">タイヤ価格</Label>
                    <Input
                      id="tirePrice"
                      type="number"
                      step={1000}
                      min={0}
                      onChange={(e) => setTirePrice(Number(e.target.value))}
                      value={tirePrice}
                      className="w-min"
                    />
                  </div>
                  {/* 混乱を避けるために掛け率を表示 */}
                  <div>
                    <Label htmlFor="priceRate">掛け率</Label>
                    <Input
                      id="priceRate"
                      type="number"
                      value={tire.priceRate}
                      className="w-min"
                      disabled
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="laborFee">作業工賃</Label>
                    <Input
                      id="laborFee"
                      type="number"
                      step={100}
                      min={0}
                      onChange={(e) =>
                        setServiceFee({
                          ...serviceFee,
                          laborFee: Number(e.target.value),
                        })
                      }
                      value={serviceFee.laborFee}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="removalFee">脱着工賃</Label>
                    <Input
                      id="removalFee"
                      type="number"
                      step={100}
                      min={0}
                      onChange={(e) =>
                        setServiceFee({
                          ...serviceFee,
                          removalFee: Number(e.target.value),
                        })
                      }
                      value={serviceFee.removalFee}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tireStorageFee">タイヤ預かり料</Label>
                    <Input
                      id="tireStorageFee"
                      type="number"
                      step={100}
                      min={0}
                      onChange={(e) =>
                        setServiceFee({
                          ...serviceFee,
                          tireStorageFee: Number(e.target.value),
                        })
                      }
                      value={serviceFee.tireStorageFee}
                      className="w-min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tireDisposalFee">廃タイヤ処分費用</Label>
                    <Input
                      id="tireDisposalFee"
                      type="number"
                      step={100}
                      min={0}
                      onChange={(e) =>
                        setServiceFee({
                          ...serviceFee,
                          tireDisposalFee: Number(e.target.value),
                        })
                      }
                      value={serviceFee.tireDisposalFee}
                      className="w-min"
                    />
                  </div>
                </div>
                <Separator />
                <WheelInputCollapsible wheel={wheel} setWheel={setWheel} />

                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => applyPrintDataChanges(index)}
                  >
                    確定
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PrintDataEditor;
