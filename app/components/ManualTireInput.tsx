import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import WheelInputCollapsible from "./WheelInputCollapsible";
import { PrintData, ServiceFee, Wheel } from "@/utils/interface";
import { DEFAULT_WHEEL } from "@/config/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface ManualTireInputProps {
  printData: PrintData;
  setPrintData: (printData: PrintData) => void;
  generateQuotationNumber: () => string;
}

const ManualTireInput = ({
  printData,
  setPrintData,
  generateQuotationNumber,
}: ManualTireInputProps) => {
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");
  const [tireSize, setTireSize] = useState<string>("");
  const [tirePrice, setTirePrice] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<ServiceFee>(() => ({
    rank: "Z", // 特価価格タイヤのランクはZで固定
    laborFee: 0,
    removalFee: 0,
    tireStorageFee: 0,
    tireDisposalFee: 0,
  }));
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { toast } = useToast();

  // クリックしたとき数値入力欄を自動選択
  const tirePriceInputRef = useRef<HTMLInputElement>(null);
  const laborFeeInputRef = useRef<HTMLInputElement>(null);
  const removalFeeInputRef = useRef<HTMLInputElement>(null);
  const tireStorageFeeInputRef = useRef<HTMLInputElement>(null);
  const tireDisposalFeeInputRef = useRef<HTMLInputElement>(null);
  const selectTextOnClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.select(); // クリック時に全選択
    }
  };

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
    if (printData.ids.length >= 3) {
      toast({
        title: "最大３つまでしか追加できません",
        variant: "destructive",
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
      tirePrice,
      priceRate: 1, // 特化価格タイヤを想定しているため、掛け率は1で固定
    };

    setPrintData({
      ...printData,
      ids: [...printData.ids, 0],
      tires: [...printData.tires, newTire],
      serviceFees: [...printData.serviceFees, serviceFee],
      wheels: [...printData.wheels, wheel],
      quotationNumber: generateQuotationNumber(),
    });

    setIsConfirmed(false);
    setManufacturer("");
    setPattern("");
    setTireSize("");
    setTirePrice(0);
    setServiceFee({
      rank: "Z",
      laborFee: 0,
      removalFee: 0,
      tireStorageFee: 0,
      tireDisposalFee: 0,
    });
    setWheel(DEFAULT_WHEEL);
    toast({
      title: "追加が完了しました",
    });
  };

  return (
    <div className="w-screen pr-8 md:w-max">
      <h2 className="my-4 mr-20 flex flex-wrap">
        特化タイヤなどのデータベースに存在しないタイヤを手動で入力できます
      </h2>
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
            ref={tirePriceInputRef} // 追加: ref
            onClick={() => selectTextOnClick(tirePriceInputRef)} // 追加: onClick
          />
        </div>
      </div>

      <Separator className="my-4" />

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
            ref={laborFeeInputRef} // 追加: ref
            onClick={() => selectTextOnClick(laborFeeInputRef)} // 追加: onClick
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
            ref={removalFeeInputRef} // 追加: ref
            onClick={() => selectTextOnClick(removalFeeInputRef)} // 追加: onClick
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
            ref={tireStorageFeeInputRef} // 追加: ref
            onClick={() => selectTextOnClick(tireStorageFeeInputRef)} // 追加: onClick
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
            ref={tireDisposalFeeInputRef} // 追加: ref
            onClick={() => selectTextOnClick(tireDisposalFeeInputRef)} // 追加: onClick
          />
        </div>
      </div>
      <Separator className="my-4" />
      <WheelInputCollapsible wheel={wheel} setWheel={setWheel} />
      <Button className="my-4" onClick={() => addTireToprintData()}>
        この内容でタイヤを追加する
      </Button>
    </div>
  );
};

export default ManualTireInput;
