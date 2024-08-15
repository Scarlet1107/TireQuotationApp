"use client";
import {
  DEFAULT_EXPIRY_DATE,
  TAX_RATE,
  DEFAULT_DISCOUNT_RATE,
  DEFAULT_CHECKED_STATUS,
  CUSTOMER_TYPE,
} from "@/config/constants";
import {
  CheckboxState,
  DiscoundRate,
  ExtraOption,
  PrintData,
  SearchResult,
  ServiceFee,
  TireData,
  Wheel,
} from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  searchTires,
  getAllmanufacturer,
  getServiceFees,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ReactToPrint from "react-to-print";
import PrintContent from "./printContent";
import { set } from "date-fns";

import {
  AlarmCheck,
  Calendar as CalendarIcon,
  ChevronsDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const Main = () => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [manufacturer, setmanufacturer] = useState<string[]>([]);
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);
  const [wheel, setWheel] = useState<Wheel>({
    isIncluded: false,
    name: "",
    size: "",
    quantity: 4,
    price: 1000,
  });
  const { toast } = useToast();
  const [checkedStates, setCheckedStates] = useState<CheckboxState>(
    DEFAULT_CHECKED_STATUS,
  );

  const [selectedData, setSelectedData] = useState<TireData>({
    target: "",
    numberOfTires: 4,
    manufacturer: "all",
    tireSize: "",
  });
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [printData, setPrintData] = useState<PrintData>({
    customerName: "",
    carModel: "",
    expiryDate: new Date(Date.now() + DEFAULT_EXPIRY_DATE),
    ids: [],
  });

  const [discountRate, setDiscountRate] = useState<DiscoundRate>(
    DEFAULT_DISCOUNT_RATE,
  );

  const fetchPriceRates = async () => {
    const rates = await getCustomerTypePriceRates();
    console.log("priceRates = ", rates.data);
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
      setCheckedStates((prevState) => ({
        ...prevState,
        [key]: checked,
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

  const [componentRefs, setComponentRefs] = useState<
    React.RefObject<HTMLDivElement>[]
  >([]);

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
        if (checkedStates.laborFee) totalCost.laborFee = fee.laborFee;
        if (checkedStates.removalFee) totalCost.removalFee = fee.removalFee;
        if (checkedStates.tireStorageFee)
          totalCost.tireStorageFee = fee.tireStorageFee;
        if (checkedStates.tireDisposalFee)
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

    const res = await searchTires(tireSize, manufacturer);
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

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const serviceFee = calculateLaborCost(tire.laborCostRank);
      const totalServiceFee = calculateTotalServiceFee(serviceFee);
      const filteredOptions = extraOptions.filter(
        (extraOption) => extraOption.option !== "",
      );
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
          filteredOptions.reduce(
            (acc, option) => acc + option.price * option.quantity,
            0,
          ),
      );

      const totalPriceWithTax = Math.floor(totalPrice * TAX_RATE);

      return {
        id: tire.id,
        manufacturer: tire.manufacturer,
        pattern: tire.pattern,
        tireSize: tire.tireSize,
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
        extraOptions: filteredOptions,
        discountRate: discountRate,
      };
    });
    console.log(newResults);
    // ここでSearchResult型に入れるのでインターフェイスと同じ形にする
    setSearchResults(newResults);
    setComponentRefs(newResults.map(() => React.createRef<HTMLDivElement>()));
  };

  const calculateTotalServiceFee = (serviceFee: any) => {
    let total = 0;
    if (checkedStates.laborFee)
      total += (serviceFee.laborFee * (100 - discountRate.laborFee)) / 100;
    if (checkedStates.removalFee)
      total += (serviceFee.removalFee * (100 - discountRate.removalFee)) / 100;
    if (checkedStates.tireStorageFee)
      total +=
        (serviceFee.tireStorageFee * (100 - discountRate.tireStorageFee)) / 100;
    if (checkedStates.tireDisposalFee) total += serviceFee.tireDisposalFee;
    return total;
  };

  const addExtraOption = () => {
    if (extraOptions.length >= 5) return;
    setExtraOptions([
      ...extraOptions,
      { id: uuidv4(), option: "", price: 100, quantity: 4 },
    ]);
  };

  const deleteExtraOption = (id: string) => {
    setExtraOptions(extraOptions.filter((option) => option.id !== id));
  };

  const handleExtraOptionChange =
    (id: string, field: keyof ExtraOption) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setExtraOptions(
        extraOptions.map((option) =>
          option.id === id ? { ...option, [field]: newValue } : option,
        ),
      );
    };

  const toggleQuotationDataById = (id: number) => {
    const ids = printData.ids;

    // 既にidが存在するかどうか確認
    const idIndex = ids.indexOf(id);

    if (idIndex !== -1) {
      // idが存在する場合、削除する
      ids.splice(idIndex, 1);
    } else {
      // idが存在しない場合、追加する
      if (ids.length >= 3) {
        // もしidsが上限に達している場合は、警告を出して終了
        toast({
          title: "最大3つまでしか選択できません",
        });
        return;
      }
      ids.push(id);
    }

    console.log(ids);

    // 更新されたidsを反映
    setPrintData({ ...printData, ids: ids });
  };

  const resetSelect = () => {
    if (printData.ids.length === 0) return;
    if (window.confirm("選択したタイヤをリセットしますか？")) {
      const reset = () => {
        setPrintData({ ...printData, ids: [] });
      };
      reset();
      toast({
        title: "リセットしました",
      });
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
                format(printData.expiryDate, "PPP")
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
                    setPrintData({ ...printData, customerName: e.target.value })
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
                checked={checkedStates.laborFee}
                onCheckedChange={handleCheckboxChange("laborFee")}
              />
              <Label className="pr-4 text-sm font-medium" htmlFor="laborFee">
                作業工賃
              </Label>
              <Input
                className="h-8 w-20"
                value={discountRate.laborFee}
                type="number"
                min={0}
                max={100}
                step={10}
                onChange={(e) =>
                  setDiscountRate({
                    ...discountRate,
                    laborFee: Number(e.target.value),
                  })
                }
              />
              <span>%割引</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removalFee"
                checked={checkedStates.removalFee}
                onCheckedChange={handleCheckboxChange("removalFee")}
              />
              <Label className="pr-4 text-sm font-medium" htmlFor="removalFee">
                脱着料
              </Label>
              <Input
                className="h-8 w-20"
                value={discountRate.removalFee}
                type="number"
                min={0}
                max={100}
                step={10}
                onChange={(e) =>
                  setDiscountRate({
                    ...discountRate,
                    removalFee: Number(e.target.value),
                  })
                }
              />
              <span>%割引</span>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tireStorageFee"
                checked={checkedStates.tireStorageFee}
                onCheckedChange={handleCheckboxChange("tireStorageFee")}
              />
              <Label className="text-sm font-medium" htmlFor="tireStorageFee">
                タイヤ預かり料
              </Label>
              <Input
                className="h-8 w-20"
                value={discountRate.tireStorageFee}
                type="number"
                min={0}
                max={100}
                step={10}
                onChange={(e) =>
                  setDiscountRate({
                    ...discountRate,
                    tireStorageFee: Number(e.target.value),
                  })
                }
              />
              <span>%割引</span>
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox
                id="tireDisposalFee"
                checked={checkedStates.tireDisposalFee}
                onCheckedChange={handleCheckboxChange("tireDisposalFee")}
              />
              <Label className="text-sm font-medium" htmlFor="tireDisposalFee">
                廃タイヤ処分
              </Label>
            </div>
          </div>
        </div>

        <Collapsible
          open={wheel.isIncluded}
          onOpenChange={() =>
            setWheel({ ...wheel, isIncluded: !wheel.isIncluded })
          }
        >
          <CollapsibleTrigger asChild>
            <div className="flex w-max items-center space-x-2">
              <Label>ホイール</Label>
              {wheel.isIncluded ? (
                <Checkbox checked={true} />
              ) : (
                <Checkbox checked={false} />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex w-max space-x-4">
                <Input
                  name="option"
                  type="text"
                  onChange={(e) => setWheel({ ...wheel, name: e.target.value })}
                  value={wheel.name}
                  placeholder="ホイール名"
                />
                <Input
                  name="option"
                  type="text"
                  onChange={(e) => setWheel({ ...wheel, size: e.target.value })}
                  value={wheel.size}
                  placeholder="ホイールサイズ"
                />
              </div>
              <div className="flex items-center">
                <div className="flex items-end">
                  <Input
                    name="price"
                    type="number"
                    step={100}
                    onChange={(e) =>
                      setWheel({ ...wheel, price: Number(e.target.value) })
                    }
                    value={wheel.price}
                    placeholder="金額"
                  />
                  <span className="text-xl">円</span>
                </div>
                <span className="mx-2 text-xl">✕</span>
                <div className="flex items-end">
                  <Input
                    name="quantity"
                    type="number"
                    min={1}
                    onChange={(e) =>
                      setWheel({ ...wheel, quantity: Number(e.target.value) })
                    }
                    value={wheel.quantity}
                    placeholder="数量"
                  />
                  <span className="text-xl">個</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div>
          <Label className="mr-2 text-lg">その他のオプション</Label>
          <Button className="text-xl" onClick={addExtraOption}>
            +
          </Button>
          <div className="mt-4">
            {extraOptions.map((extraOption, index) => (
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
          className="w-min transform bg-green-500 font-bold transition-all duration-100 hover:scale-95 hover:bg-green-600"
          onClick={handleEstimate}
        >
          この内容で見積もる！
        </Button>
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <div className="relative">
          <Button
            className="absolute right-8 top-2 mr-8 w-max place-self-end font-medium"
            variant={"destructive"}
            onClick={() => resetSelect()}
            id="resetButton"
          >
            リセット
          </Button>
          {printData.ids.length > 0 ? (
            <Label
              htmlFor="resetButton"
              className={`absolute right-12 top-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-red-600 text-center font-bold text-black ${
                printData.ids.length === 1
                  ? "bg-white"
                  : printData.ids.length === 2
                    ? "bg-orange-100"
                    : printData.ids.length === 3
                      ? "bg-red-300"
                      : "bg-white"
              }`}
            >
              {printData.ids.length}
            </Label>
          ) : null}
        </div>{" "}
        <p className="mt-12 flex justify-center text-3xl font-bold md:mt-0">
          見積もり結果
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
                  <p>id : {result.id}</p>
                  <p>工賃ランク：{result.serviceFee.rank}</p>
                  <p>
                    タイヤ :{result.tirePrice} × {result.priceRate} ×{" "}
                    {result.numberOfTires}{" "}
                  </p>
                  {result.wheel.isIncluded ? (
                    <p>
                      ホイール: {result.wheel.price * result.wheel.quantity}
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
                        工賃 :{" "}
                        {(result.serviceFee.laborFee *
                          (100 - result.discountRate.laborFee)) /
                          100 +
                          (result.serviceFee.removalFee *
                            (100 - result.discountRate.removalFee)) /
                            100 +
                          result.serviceFee.tireDisposalFee +
                          (result.serviceFee.tireStorageFee *
                            (100 - result.discountRate.tireStorageFee)) /
                            100}
                        円
                      </span>
                    ) : (
                      ""
                    )}{" "}
                  </p>

                  {result.extraOptions.length > 0 && (
                    <div>
                      <ul>
                        {result.extraOptions.map((option) => (
                          <li key={option.id}>
                            {option.option} : {option.price} × {option.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col">
                    <p>
                      合計（税抜き）：{" "}
                      <span className="font-bold">{result.totalPrice}</span>円
                      <p>(税込み{result.totalPriceWithTax}円)</p>
                    </p>
                    <p>
                      タイヤ利益：{result.profit}
                      <span>円</span>
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Main;
