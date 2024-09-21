"use client";
import {
  TAX_RATE,
  CUSTOMER_TYPE,
  DEFAULT_PRINTDATA,
  DEFAULT_WHEEL,
  MAX_EXTRAOPTIONS,
} from "@/config/constants";
import {
  CheckboxState,
  ExtraOption,
  PrintData,
  SearchResult,
  ServiceFee,
  SelectData,
  Wheel,
} from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  searchTires,
  getAllmanufacturer,
  getServiceFees,
  uploadPrintData,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useReactToPrint } from "react-to-print";
import PrintContent from "./printContent";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import ManualTireInputDialog from "./components/ManualTireInputDialog";
import PrintHistorySheet from "./components/PrintHistorySheet";
import WheelInputCollapsible from "./components/WheelInputCollapsible";
import PrintDataSheet from "./components/PrintDataEditor";
import PrintDataEditor from "./components/PrintDataEditor";
import ResetButton from "./components/ResetButton";

const Main = () => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [manufacturer, setmanufacturer] = useState<string[]>([]);
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);
  const { toast } = useToast();
  const [selectedData, setSelectedData] = useState<SelectData>({
    target: "",
    numberOfTires: 4,
    manufacturer: "all",
    tireSize: "",
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);
  const [totalExtraOptionPrice, setTotalExtraOptionPrice] = useState(0);

  const fetchPriceRates = async () => {
    const rates = await getCustomerTypePriceRates();
    setPriceRates(rates.data as any[]);
  };
  const fetchTireSizes = async () => {
    const sizes = await getAllTireSizes();
    if (sizes.data) {
      const uniqueSizes = Array.from(
        new Set(sizes.data.map((item) => item.size)),
      );
      setTireSizes(uniqueSizes);
    }
  };

  const fetchAllmanufacturer = async () => {
    const names = await getAllmanufacturer();
    if (names.data) {
      const uniquemanufacturer = Array.from(
        new Set(names.data.map((item) => item.manufacturer)),
      );
      setmanufacturer(uniquemanufacturer);
    }
  };

  const fetchServiceFees = async () => {
    const res = await getServiceFees();
    setServiceFees(res as ServiceFee[]);
  };

  useEffect(() => {
    fetchPriceRates();
    fetchTireSizes();
    fetchAllmanufacturer();
    fetchServiceFees();
  }, []);

  const handleCheckboxChange =
    (key: keyof CheckboxState) => (checked: boolean) => {
      setPrintData((prev) => ({
        ...prev,
        checkBoxState: {
          ...prev.checkBoxState,
          [key]: checked,
        },
      }));
    };

  const handleCustomerTypeChange = (value: string) => {
    setSelectedData((prev) => ({ ...prev, target: value }));
  };

  const handleTireSizeChange = (size: string) => {
    setSelectedData((prev) => ({ ...prev, tireSize: size }));
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setSelectedData((prev) => ({ ...prev, manufacturer: manufacturer }));
  };

  const handleNumberOfTiresChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(e.target.value);
    setSelectedData((prev) => ({ ...prev, numberOfTires: value }));
  };

  const componentRef = useRef(null);

  // ここ冗長な書き方になってるので後々リファクタリングする
  // 名前がひどい
  const calculateLaborCost = (rank: string) => {
    let totalCost = {
      laborFee: 0,
      removalFee: 0,
      tireStorageFee: 0,
      tireDisposalFee: 0,
      total: 0,
    };

    serviceFees.find((fee) => {
      if (fee.rank === rank) {
        if (printData.checkBoxState.laborFee) totalCost.laborFee = fee.laborFee;
        if (printData.checkBoxState.removalFee)
          totalCost.removalFee = fee.removalFee;
        if (printData.checkBoxState.tireStorageFee)
          totalCost.tireStorageFee = fee.tireStorageFee;
        if (printData.checkBoxState.tireDisposalFee)
          totalCost.tireDisposalFee = fee.tireDisposalFee;
        totalCost.total =
          totalCost.laborFee +
          totalCost.removalFee +
          totalCost.tireStorageFee +
          totalCost.tireDisposalFee;
        return true;
      }
      return false;
    });

    return totalCost;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.floor(price));
  };

  // タイヤのパターンとお客さんのターゲットによって価格を検索する。割合で返す
  const searchMarkupRate = (pattern: string, target: string): number => {
    const rate = priceRates.find((item) => {
      return pattern === item.pattern;
    });

    if (!rate) {
      toast({
        variant: "destructive",
        title:
          "該当するパターンが見つかりません。テーブルデータが間違って入力されている可能性があります。",
      });
    }
    return rate[target] / 100;
  };

  // 計算がわかりにくいのでリファクタリングする
  const handleEstimate = async () => {
    const { tireSize, manufacturer, numberOfTires } = selectedData;

    if (!tireSize) {
      toast({
        variant: "destructive",
        title: "タイヤサイズが選択されていません。",
      });
      return;
    }

    // ここがうまく動いてるかチェック
    if (selectedData.target === "") {
      toast({
        variant: "destructive",
        title: "お客さんが選択されていません。",
      });
      return;
    }

    if (numberOfTires === 0) {
      toast({
        variant: "destructive",
        title: "タイヤの数量が選択されていません。",
      });
      return;
    }

    if (wheel.isIncluded && (wheel.name === "" || wheel.size === "")) {
      toast({
        variant: "destructive",
        title: "ホイールの名前とサイズを入力してください。",
      });
      return;
    }

    const res = await searchTires(tireSize, manufacturer); //データベースからタイヤ情報を検索
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      toast({
        variant: "destructive",
        title: "タイヤ情報が見つかりませんでした。",
      });
      return;
    }

    if (manufacturer === "all") {
      toast({
        title: "すべてのメーカーで検索しました",
      });
    }

    console.log(res.data);

    // ここで空のオプションを取り除く
    const filteredExtraOptions = printData.extraOptions.filter(
      (option) => option.option !== "",
    );

    // 見積もりナンバーを生成&その他変数をprintDataにセット
    setPrintData({
      ...printData,
      numberOfTires: numberOfTires,
      extraOptions: filteredExtraOptions,
      quotationNumber: generateQuotationNumber(),
    });

    // その他のオプションの合計金額を計算
    setTotalExtraOptionPrice(
      filteredExtraOptions.reduce(
        (total, option) => total + option.price * option.quantity,
        0,
      ),
    );

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const serviceFee = calculateLaborCost(tire.laborCostRank);
      const totalServiceFee = calculateTotalServiceFee(serviceFee);
      // ここでお客さんのターゲットによって価格を変える
      const priceRate: number = searchMarkupRate(
        tire.pattern,
        selectedData.target,
      );
      const sellingPrice = Math.ceil((tirePrice * Number(priceRate)) / 10) * 10;
      const profit = Math.ceil(
        (sellingPrice - tirePrice * searchMarkupRate(tire.pattern, "cost")) *
          numberOfTires,
      );
      const wheelPrice = wheel.isIncluded ? wheel.price * wheel.quantity : 0;

      const totalPrice = Math.floor(
        sellingPrice * numberOfTires +
          totalServiceFee +
          wheelPrice +
          filteredExtraOptions.reduce(
            (acc, option) => acc + option.price * option.quantity,
            0,
          ),
      );

      const totalPriceWithTax = Math.floor(totalPrice * TAX_RATE);

      return {
        id: tire.id,
        manufacturer: tire.manufacturer,
        pattern: tire.pattern,
        tireSize: selectedData.tireSize,
        tirePrice: tirePrice,
        numberOfTires: numberOfTires,
        priceRate: priceRate,
        profit: profit,
        wheel: wheel,
        serviceFee: {
          rank: tire.laborCostRank,
          laborFee: serviceFee.laborFee,
          removalFee: serviceFee.removalFee,
          tireStorageFee: serviceFee.tireStorageFee,
          tireDisposalFee: serviceFee.tireDisposalFee,
        },
        totalPrice: totalPrice,
        totalPriceWithTax: totalPriceWithTax,
        extraOptions: filteredExtraOptions,
        discountRate: printData.discountRate,
      };
    });
    console.log(newResults);
    // ここでSearchResult型に入れるのでインターフェイスと同じ形にする
    setSearchResults(newResults);
  };

  const calculateTotalServiceFee = (serviceFee: any) => {
    let total = 0;
    if (printData.checkBoxState.laborFee)
      total +=
        (serviceFee.laborFee * (100 - printData.discountRate.laborFee)) / 100;
    if (printData.checkBoxState.removalFee)
      total +=
        (serviceFee.removalFee * (100 - printData.discountRate.removalFee)) /
        100;
    if (printData.checkBoxState.tireStorageFee)
      total +=
        (serviceFee.tireStorageFee *
          (100 - printData.discountRate.tireStorageFee)) /
        100;
    if (printData.checkBoxState.tireDisposalFee)
      total += serviceFee.tireDisposalFee;
    return total;
  };

  const addExtraOption = () => {
    if (printData.extraOptions.length >= MAX_EXTRAOPTIONS) return;
    setPrintData((prevData) => ({
      ...prevData,
      extraOptions: [
        ...printData.extraOptions,
        { id: uuidv4(), option: "", price: 100, quantity: 4 },
      ],
    }));
  };

  const deleteExtraOption = (id: string) => {
    setPrintData((prevData) => ({
      ...prevData,
      extraOptions: prevData.extraOptions.filter((option) => option.id !== id),
    }));
  };

  const handleExtraOptionChange =
    (id: string, field: keyof ExtraOption) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setPrintData((prevData) => ({
        ...prevData,
        extraOptions: prevData.extraOptions.map((option) =>
          option.id === id ? { ...option, [field]: newValue } : option,
        ),
      }));
    };

  const toggleQuotationDataById = (id: number) => {
    const ids = [...printData.ids];
    const tires = [...printData.tires];
    const serviceFees = [...printData.serviceFees];
    const wheels = [...printData.wheels];

    const idIndex = ids.indexOf(id);

    if (idIndex !== -1) {
      ids.splice(idIndex, 1);
      tires.splice(idIndex, 1);
      serviceFees.splice(idIndex, 1);
      wheels.splice(idIndex, 1);
    } else {
      if (ids.length >= 3) {
        toast({
          title: "最大3つまでしか選択できません",
        });
        return;
      }

      ids.push(id);

      const dataToAdd = searchResults.find((result) => result.id === id);
      if (dataToAdd) {
        const tireToAdd = {
          manufacturer: dataToAdd.manufacturer,
          pattern: dataToAdd.pattern,
          tireSize: dataToAdd.tireSize,
          tirePrice: dataToAdd.tirePrice,
          priceRate: dataToAdd.priceRate,
        };
        tires.push(tireToAdd);
        serviceFees.push(dataToAdd.serviceFee);
        wheels.push(dataToAdd.wheel);
        console.log("tireToAdd = ", tireToAdd);
      }
    }

    setPrintData({ ...printData, ids, tires, serviceFees, wheels });
  };



  // 見積もりナンバーを日時から生成する関数
  const generateQuotationNumber = (): string => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const quotationNumber = `${year}${month}${day}${hours}${minutes}`;
    return quotationNumber;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: printData.customerName + "様-" + printData.quotationNumber,
  });

  const handlePrintButtonClick = async () => {
    if (printData.ids.length === 0) {
      toast({
        title: "タイヤを選択してください",
      });
      return;
    }
    if (printData.customerName === "") {
      toast({
        title: "お客様名を入力してください",
      });
      return;
    }
    if (printData.carModel === "") {
      toast({
        title: "車種を入力してください",
      });
      return;
    }
    if (componentRef.current) {
      handlePrint();

      // 履歴をSupabaseのprint_logsにアップロード
      try {
        await uploadPrintData(printData);
      } catch (error) {
        console.error("Failed to save print data to print_logs:", error);
      }
    }
  };

  return (
    <div className="mt-8 flex w-full flex-col md:flex-row">
      <div className="ml-12 flex w-max flex-col space-y-8">
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

        <div className="flex justify-around">
          <div className="flex">
            <Label>
              お客様名
              <div className="mt-2 flex space-x-2">
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
          </div>
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
        </div>

        <div className="flex flex-col space-y-3 xl:flex-row xl:space-x-4 xl:space-y-0">
          <Select onValueChange={(value) => handleCustomerTypeChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="お客さんを選択" />
            </SelectTrigger>
            <SelectContent>
              {CUSTOMER_TYPE.map((type, index) => (
                <SelectItem key={index} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(Value) => handleTireSizeChange(Value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="タイヤサイズを選択" />
            </SelectTrigger>
            <SelectContent>
              {tireSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(Value) => handleManufacturerChange(Value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="メーカーを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="all">
                すべて
              </SelectItem>
              {manufacturer.map((name, index) => (
                <SelectItem key={index} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-4 md:space-x-8 xl:flex-row">
          <div className="space-x-4">
            <Label htmlFor="number">数量</Label>
            <Input
              id="number"
              type="number"
              min={1}
              onChange={handleNumberOfTiresChange}
              value={selectedData.numberOfTires}
              className="w-min"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laborFee"
                checked={printData.checkBoxState.laborFee}
                onCheckedChange={handleCheckboxChange("laborFee")}
              />
              <Label className="pr-4 text-sm font-medium" htmlFor="laborFee">
                作業工賃
              </Label>
              <Input
                className="h-8 w-20"
                value={printData.discountRate.laborFee}
                type="number"
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
              <Input
                className="h-8 w-20"
                value={printData.discountRate.removalFee}
                type="number"
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
              <Input
                className="h-8 w-20"
                value={printData.discountRate.tireStorageFee}
                type="number"
                min={0}
                max={100}
                step={50}
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

            <div className="items-top flex space-x-2">
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
        <WheelInputCollapsible wheel={wheel} setWheel={setWheel} />
        <div>
          <Label className="mr-2 text-lg">その他のオプション</Label>
          <Button className="text-xl" onClick={addExtraOption}>
            +
          </Button>
          <div className="mt-4">
            {printData.extraOptions.map((extraOption, index) => (
              <div key={extraOption.id}>
                <div className="mt-6 flex flex-col space-y-2 lg:flex-row lg:space-x-4 lg:space-y-0">
                  <div>
                    <Label>
                      項目<span className="font-bold">{index + 1}</span>
                    </Label>
                    <Input
                      name="option"
                      type="text"
                      onChange={handleExtraOptionChange(
                        extraOption.id,
                        "option",
                      )}
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
                      onChange={handleExtraOptionChange(
                        extraOption.id,
                        "price",
                      )}
                      value={extraOption.price}
                      placeholder="金額"
                    />
                  </div>
                  <div>
                    <Label>数量</Label>
                    <Input
                      name="quantity"
                      type="number"
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
        </div>

        <Button
          className="w-min transform bg-green-500 hover:bg-green-600"
          onClick={handleEstimate}
        >
          この内容で見積り！
        </Button>
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <div className="mr-8 flex flex-col justify-end space-x-8 md:flex-row">
          <PrintHistorySheet setPrintData={setPrintData} />
          <ManualTireInputDialog
            printData={printData}
            setPrintData={setPrintData}
          />
          <PrintDataEditor printData={printData} setPrintData={setPrintData} />


         <ResetButton setPrintData={setPrintData} printDataLength={printData.ids.length}/>


          <Button
            className="w-min transform bg-green-500 font-bold transition-all duration-100 hover:scale-95 hover:bg-green-600"
            onClick={() => handlePrintButtonClick()}
          >
            選択した内容をプリント
          </Button>
          <div></div>
        </div>
        <p className="mt-8 flex justify-center text-3xl font-bold md:mt-0">
          見積り結果
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {searchResults.map((result, index) => (
            <div key={index}>
              <Card
                className={`transform cursor-pointer transition-all duration-100 hover:scale-105 ${
                  printData.ids.includes(result.id)
                    ? "border-4 border-red-400 bg-gray-100"
                    : ""
                } select-none`} // ここで選択を無効化
                onClick={() => toggleQuotationDataById(result.id)}
              >
                <CardHeader>
                  <CardTitle>メーカー : {result.manufacturer}</CardTitle>
                  <CardDescription>パターン : {result.pattern}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    タイヤ: {formatPrice(result.tirePrice)} × {result.priceRate}{" "}
                    × {result.numberOfTires} 円
                  </p>
                  {result.wheel.isIncluded ? (
                    <p>
                      ホイール({result.wheel.name}, {result.wheel.size}):{" "}
                      {formatPrice(result.wheel.price * result.wheel.quantity)}
                      円
                    </p>
                  ) : (
                    ""
                  )}
                  <p>
                    {" "}
                    {result.serviceFee.laborFee !== 0 ||
                    result.serviceFee.tireDisposalFee !== 0 ||
                    result.serviceFee.removalFee !== 0 ||
                    result.serviceFee.tireStorageFee !== 0 ? (
                      <span>
                        工賃:{" "}
                        {formatPrice(
                          (result.serviceFee.laborFee *
                            (100 - result.discountRate.laborFee)) /
                            100 +
                            (result.serviceFee.removalFee *
                              (100 - result.discountRate.removalFee)) /
                              100 +
                            result.serviceFee.tireDisposalFee +
                            (result.serviceFee.tireStorageFee *
                              (100 - result.discountRate.tireStorageFee)) /
                              100,
                        )}
                        円
                      </span>
                    ) : (
                      ""
                    )}{" "}
                  </p>
                  {totalExtraOptionPrice !== 0 ? (
                    <p>
                      その他のオプション合計:{" "}
                      {formatPrice(totalExtraOptionPrice)}円
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col">
                    <p>
                      合計（税抜）:{" "}
                      <span>{formatPrice(result.totalPrice)}</span>円
                    </p>
                    <p className="font-bold">
                      税込: {formatPrice(result.totalPriceWithTax)}円
                    </p>
                    <p className="mt-2">
                      タイヤ利益(税抜) : {formatPrice(result.profit)}円
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="w-3/4">
            <PrintContent ref={componentRef} printData={printData} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Main;
