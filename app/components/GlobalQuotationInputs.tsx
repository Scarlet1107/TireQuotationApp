import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CheckboxState, ExtraOption, PrintData } from "@/utils/interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { MAX_EXTRAOPTIONS } from "@/config/constants";
import PrintHistorySheet from "./PrintHistorySheet";
import { usePrintData } from "../printDataContext";

const GlobalQuotationInputs = () => {
  // クリックしたとき数値入力欄を自動選択
  const { printData, setPrintData } = usePrintData();
  const tireQuantityInputRef = useRef<HTMLInputElement>(null);
  const laborFeeInputRef = useRef<HTMLInputElement>(null);
  const removalFeeInputRef = useRef<HTMLInputElement>(null);
  const tireStorageFeeInputRef = useRef<HTMLInputElement>(null);
  const extraOptionPriceInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const extraOptionQuantityInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const selectTextOnClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.select(); // クリック時に全選択
    }
  };

  const handleCheckboxChange =
    (key: keyof CheckboxState) => (checked: boolean) => {
      setPrintData({
        ...printData,
        checkBoxState: {
          ...printData.checkBoxState,
          [key]: checked,
        },
      });
    };

  const deleteExtraOption = (id: string) => {
    setPrintData({
      ...printData,
      extraOptions: printData.extraOptions.filter(
        (option: { id: string }) => option.id !== id,
      ),
    });
  };

  const handleExtraOptionChange =
    (id: string, field: keyof ExtraOption) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue: string | number = e.target.value;

      // fieldが'price'または'quantity'の場合は整数型に変換
      if (field === "price" || field === "quantity") {
        newValue = parseInt(e.target.value, 10);
        // 文字を入力した場合は0を入力
        if (isNaN(newValue)) {
          newValue = 0; // もしくは適切な初期値を設定
        }
      }

      setPrintData({
        ...printData,
        extraOptions: printData.extraOptions.map((option: ExtraOption) =>
          option.id === id ? { ...option, [field]: newValue } : option,
        ),
      });
    };

  const addExtraOption = () => {
    if (printData.extraOptions.length >= MAX_EXTRAOPTIONS) return;
    setPrintData({
      ...printData,
      extraOptions: [
        ...printData.extraOptions,
        { id: uuidv4(), option: "", price: 100, quantity: 4 },
      ],
    });
  };

  return (
    <div className="flex w-max flex-col space-y-8">
      <div className="flex w-max flex-col space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
        <div className="flex flex-col">
          <Label className="mb-2">有効期限</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !printData.expiryDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {printData.expiryDate ? (
                  format(printData.expiryDate, "PPP", { locale: ja }) // 日本語ロケールを指定
                ) : (
                  <span>有効期限を選択</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={printData.expiryDate}
                onSelect={(date) => {
                  if (date) {
                    setPrintData({ ...printData, expiryDate: date });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="place-self-start sm:place-self-end">
          <PrintHistorySheet setPrintData={setPrintData} />
        </div>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-4">
        <div className="grid h-max w-max grid-cols-1 gap-4 sm:grid-cols-2">
          <Label>
            担当者
            <div className="mt-2 flex space-x-2">
              <Input
                type="string"
                className="w-min"
                value={printData.staffName}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    staffName: e.target.value,
                  })
                }
              />
            </div>
          </Label>
          <Label>
            お客様名
            <div className="mt-2 flex -space-x-8">
              <Input
                placeholder="タケウチ パーツ"
                type="string"
                className="w-min"
                value={printData.customerName}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    customerName: e.target.value,
                  })
                }
              />
              <span className="place-content-center text-xl">様</span>
            </div>
          </Label>
          <div className="flex">
            <Label>
              車種
              <div className="mt-2 flex space-x-2">
                <Input
                  type="string"
                  className="w-min"
                  value={printData.carModel}
                  onChange={(e) =>
                    setPrintData({ ...printData, carModel: e.target.value })
                  }
                />
              </div>
            </Label>
          </div>
          <div className="flex flex-col space-y-4 md:space-x-8 xl:flex-row">
            <div>
              <Label htmlFor="number">本数</Label>
              <Input
                id="number"
                type="number"
                ref={tireQuantityInputRef}
                onClick={() => selectTextOnClick(tireQuantityInputRef)}
                min={1}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    numberOfTires: Number(e.target.value),
                  })
                }
                value={printData.numberOfTires}
                className="w-min"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laborFee"
                checked={printData.checkBoxState.laborFee}
                onCheckedChange={handleCheckboxChange("laborFee")}
                className="place-self-center"
              />
              <Label
                className="text-centertext-sm font-medium"
                htmlFor="laborFee"
              >
                作業工賃
              </Label>
            </div>
            <div className="flex items-center">
              <Input
                className="h-8 w-20"
                value={printData.discountRate.laborFee}
                type="number"
                ref={laborFeeInputRef}
                onClick={() => selectTextOnClick(laborFeeInputRef)}
                min={0}
                max={100}
                step={50}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    discountRate: {
                      ...printData.discountRate,
                      laborFee: Number(e.target.value),
                    },
                  })
                }
              />
              <span>%割引</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removalFee"
                checked={printData.checkBoxState.removalFee}
                onCheckedChange={handleCheckboxChange("removalFee")}
              />
              <Label className="pr-4 text-sm font-medium" htmlFor="removalFee">
                脱着料
              </Label>
            </div>
            <div className="flex items-center">
              <Input
                className="h-8 w-20"
                value={printData.discountRate.removalFee}
                type="number"
                ref={removalFeeInputRef}
                onClick={() => selectTextOnClick(removalFeeInputRef)}
                min={0}
                max={100}
                step={50}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    discountRate: {
                      ...printData.discountRate,
                      removalFee: Number(e.target.value),
                    },
                  })
                }
              />
              <span>%割引</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tireStorageFee"
                checked={printData.checkBoxState.tireStorageFee}
                onCheckedChange={handleCheckboxChange("tireStorageFee")}
              />
              <Label className="text-sm font-medium" htmlFor="tireStorageFee">
                タイヤ預かり料
              </Label>
            </div>
            <div className="flex items-center">
              <Input
                className="h-8 w-20"
                value={printData.discountRate.tireStorageFee}
                type="number"
                min={0}
                max={100}
                step={50}
                ref={tireStorageFeeInputRef}
                onClick={() => selectTextOnClick(tireStorageFeeInputRef)}
                onChange={(e) =>
                  setPrintData({
                    ...printData,
                    discountRate: {
                      ...printData.discountRate,
                      tireStorageFee: Number(e.target.value),
                    },
                  })
                }
              />
              <span>%割引</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tireDisposalFee"
                checked={printData.checkBoxState.tireDisposalFee}
                onCheckedChange={handleCheckboxChange("tireDisposalFee")}
              />
              <Label className="text-sm font-medium" htmlFor="tireDisposalFee">
                廃タイヤ処分
              </Label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Label className="mr-2 text-lg">その他のオプション</Label>
        <Button className="text-xl" onClick={addExtraOption}>
          +
        </Button>
        <div className="mt-4">
          {printData.extraOptions.map((extraOption, index) => (
            <div key={extraOption.id}>
              <div className="mt-6 flex w-max flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                <div>
                  <Label>
                    項目<span className="font-bold">{index + 1}</span>
                  </Label>
                  <Input
                    name="option"
                    type="text"
                    onChange={handleExtraOptionChange(extraOption.id, "option")}
                    value={extraOption.option}
                    placeholder="オプション名"
                  />
                </div>
                <div>
                  <Label>金額</Label>
                  <Input
                    name="price"
                    type="number"
                    step={100}
                    ref={(el) => {
                      extraOptionPriceInputRefs.current[index] = el;
                    }}
                    onClick={() => {
                      const inputRef = extraOptionPriceInputRefs.current[index];
                      if (inputRef) {
                        selectTextOnClick({ current: inputRef });
                      }
                    }}
                    onChange={handleExtraOptionChange(extraOption.id, "price")}
                    value={extraOption.price}
                    placeholder="金額"
                  />
                </div>
                <div>
                  <Label>数量</Label>
                  <Input
                    name="quantity"
                    type="number"
                    ref={(el) => {
                      extraOptionQuantityInputRefs.current[index] = el;
                    }}
                    onClick={() => {
                      const inputRef =
                        extraOptionQuantityInputRefs.current[index];
                      if (inputRef) {
                        selectTextOnClick({ current: inputRef });
                      }
                    }}
                    min={1}
                    onChange={handleExtraOptionChange(
                      extraOption.id,
                      "quantity",
                    )}
                    value={extraOption.quantity}
                    placeholder="数量"
                  />
                </div>
                <Button
                  className="w-min place-self-end"
                  variant={"destructive"}
                  onClick={() => deleteExtraOption(extraOption.id)}
                >
                  消
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Label htmlFor="memo">商談メモ</Label>
          <Textarea
            id="memo"
            className="mt-1"
            value={printData.memo}
            onChange={(e) =>
              setPrintData({
                ...printData,
                memo: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalQuotationInputs;
