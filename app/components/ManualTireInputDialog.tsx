import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import WheelInputCollapsible from "./WheelInputCollapsible";
import { PrintData, ServiceFee, Wheel } from "@/utils/interface";
import { DEFAULT_WHEEL } from "@/config/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast, useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ManualTireInputDialogProps {
  printData: PrintData;
  setPrintData: (printData: PrintData) => void;
}

const ManualTireInputDialog = ({
  printData,
  setPrintData,
}: ManualTireInputDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);

  const [manufacturer, setManufacturer] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");
  const [tireSize, setTireSize] = useState<string>("");
  const [numberOfTires, setNumberOfTires] = useState<number>(4);
  const [tirePrice, setTirePrice] = useState<number>(0);

  const [serviceFee, setServiceFee] = useState<ServiceFee>(() => ({
    rank: "Z",
    laborFee: 0,
    removalFee: 0,
    tireStorageFee: 0,
    tireDisposalFee: 0,
  }));
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { toast } = useToast();

  const addTireToprintData = () => {
    // バリデーションチェック
    if (
      manufacturer === "" ||
      pattern === "" ||
      tireSize === "" ||
      tirePrice === 0
    ) {
      toast({
        title: "メーカー、パターン、タイヤサイズ、タイヤ価格を入力してください",
      });
      return;
    }
    if (
      wheel.isIncluded &&
      (wheel.name === "" || wheel.size === "" || wheel.price === 0)
    ) {
      toast({
        title: "ホイール名、ホイールサイズ、ホイール価格を入力してください",
      });
      return;
    }

    if (!isConfirmed) {
      if (window.confirm("この内容でタイヤを追加しますか？")) {
        setIsConfirmed(true);
      } else {
        return;
      }
    }

    const newTire = {
      manufacturer,
      pattern,
      tireSize,
      numberOfTires,
      tirePrice,
      priceRate: 1, // 価格レートは1で固定
    };

    setPrintData({
      ...printData,
      ids: [...printData.ids, 0],
      tires: [...printData.tires, newTire],
      serviceFees: [...printData.serviceFees, serviceFee],
      wheels: [...printData.wheels, wheel],
    });

    setIsConfirmed(false);
    setManufacturer("");
    setPattern("");
    setTireSize("");
    setNumberOfTires(4);
    setTirePrice(0);
    setServiceFee({
      rank: "Z",
      laborFee: 0,
      removalFee: 0,
      tireStorageFee: 0,
      tireDisposalFee: 0,
    });
    setWheel(DEFAULT_WHEEL);
    setIsOpen(false);
    toast({
      title: "追加が完了しました",
    });
  };

  useEffect(() => {
    console.log("🚀 ~ addTireToprintData ~ printData=>", printData);
  }, [printData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>手打ち入力</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>手打ち入力</DialogTitle>
          <DialogDescription>
            特化タイヤなどのデータベースに存在しないタイヤを手動で入力できます
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-2 gap-y-4">
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
          {/* gridでのデザインを整えるために空のdivタグを追加 */}
          <div></div>
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
          <div>
            <Label htmlFor="numberOfTires">数量</Label>
            <Input
              id="numberOfTires"
              type="number"
              min={1}
              onChange={(e) => setNumberOfTires(Number(e.target.value))}
              value={numberOfTires}
              className="w-min"
            />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <Label htmlFor="laborFee">作業工賃</Label>
            <Input
              id="laborFee"
              type="number"
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
        <Button className="my-4" onClick={() => addTireToprintData()}>
          この内容でタイヤを追加する
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTireInputDialog;
