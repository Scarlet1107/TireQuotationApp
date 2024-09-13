"use client";
import {
  DEFAULT_EXPIRY_DATE,
  TAX_RATE,
  DEFAULT_DISCOUNT_RATE,
  DEFAULT_CHECKED_STATUS,
  CUSTOMER_TYPE,
  DEFAULT_PRINTDATA,
  DEFAULT_WHEEL,
  MAX_EXTRAOPTIONS,
} from "@/config/constants";
import {
  CheckboxState,
  DiscoundRate,
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
  getPrintDataHistory,
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
import ReactToPrint, { useReactToPrint } from "react-to-print";
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
import { Result } from "postcss";
import Image from "next/image";
import { ja } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Main = () => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [manufacturer, setmanufacturer] = useState<string[]>([]);
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);
  const { toast } = useToast();
  const [checkedStates, setCheckedStates] = useState<CheckboxState>(
    DEFAULT_CHECKED_STATUS,
  );
  const [selectedData, setSelectedData] = useState<SelectData>({
    target: "",
    numberOfTires: 4,
    manufacturer: "all",
    tireSize: "",
  });
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [printData, setPrintData] = useState<PrintData>(DEFAULT_PRINTDATA);
  const [discountRate, setDiscountRate] = useState<DiscoundRate>(
    DEFAULT_DISCOUNT_RATE,
  );
  const [totalExtraOptionPrice, setTotalExtraOptionPrice] = useState(0);
  const [printHistory, setPrintHistory] = useState<PrintData[]>([]);

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

  const fetchPrintHistory = async () => {
    const res = await getPrintDataHistory();
    console.log(res);
    setPrintHistory(res as PrintData[]);

    //試しに最新のデータをセット
    // const data = res[0];
    // setPrintData({
    //   ...printData,
    //   ids: data.ids,
    //   tires: data.tires,
    //   serviceFees: data.service_fees,
    //   customerName: data.customer_name,
    //   staffName: data.staff_name,
    //   carModel: data.car_model,
    //   expiryDate: data.expiry_date,
    //   quotationNumber: data.quotation_number,
    //   numberOfTires: data.number_of_tires,
    //   checkBoxState: data.check_box_state,
    //   discountRate: data.discount_rate,
    //   wheels: data.wheels,
    //   extraOptions: data.extra_options,
    // });
    // setExtraOptions(data.extra_options);
  };

  useEffect(() => {
    fetchPriceRates();
    fetchTireSizes();
    fetchAllmanufacturer();
    fetchServiceFees();
    fetchPrintHistory();
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

    // 見積もりナンバーを生成&その他変数をprintDataにセット
    setPrintData({
      ...printData,
      numberOfTires: numberOfTires,
      checkBoxState: checkedStates,
      discountRate: discountRate,
      extraOptions: extraOptions,
      quotationNumber: generateQuotationNumber(),
    });

    // その他のオプションの合計金額を計算
    setTotalExtraOptionPrice(
      extraOptions.reduce(
        (total, option) => total + option.price * option.quantity,
        0,
      ),
    );

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const serviceFee = calculateLaborCost(tire.laborCostRank);
      const totalServiceFee = calculateTotalServiceFee(serviceFee);
      const filteredOptions = extraOptions.filter(
        (extraOption) => extraOption.option !== "",
      );
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
        extraOptions: filteredOptions,
        discountRate: discountRate,
      };
    });
    console.log(newResults);
    // ここでSearchResult型に入れるのでインターフェイスと同じ形にする
    setSearchResults(newResults);
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
    if (extraOptions.length >= MAX_EXTRAOPTIONS) return;
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
    const ids = [...printData.ids];
    const tires = [...printData.tires];
    const serviceFees = [...printData.serviceFees];
    const wheels = [...printData.wheels];
    console.log("toggle関数内のwheels = ", wheels);

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

  const resetSelect = () => {
    if (printData.ids.length === 0) return;
    if (window.confirm("選択したタイヤをリセットしますか？")) {
      const reset = () => {
        setPrintData({ ...printData, ids: [], serviceFees: [], tires: [] });
      };
      reset();
      toast({
        title: "リセットしました",
      });
    }
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
                step={50}
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
                step={50}
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
                step={50}
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
          className="w-min transform bg-green-500 hover:bg-green-600"
          onClick={handleEstimate}
        >
          この内容で見積り！
        </Button>
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <div className="mr-8 flex justify-end space-x-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-min transform bg-blue-500 hover:bg-blue-600">
                履歴を表示
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>履歴を管理</SheetTitle>
              </SheetHeader>
              <SheetDescription asChild>
                <SheetClose>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>見積り番号</TableHead>
                        <TableHead>お客さん</TableHead>
                        <TableHead>担当スタッフ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printHistory.map((history, index) => (
                        <TableRow
                          key={index}
                          onClick={() => setPrintData(printHistory[index])}
                        >
                          <TableCell className="font-medium">
                            {history.quotationNumber}
                          </TableCell>
                          <TableCell>{history.customerName}</TableCell>
                          <TableCell>{history.staffName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </SheetClose>
              </SheetDescription>
              <SheetFooter>
                ここにページネーション実装できるかも？
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button
            className="relative w-max place-self-end font-medium"
            variant={"destructive"}
            onClick={() => resetSelect()}
            id="resetButton"
          >
            リセット
            {printData.ids.length >= 0 ? (
              <Label
                htmlFor="resetButton"
                className={`absolute -right-3 -top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-red-600 text-center font-bold text-black ${
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
          </Button>
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
                  {/* <p>id : {result.id}</p> */}
                  {/* <p>工賃ランク：{result.serviceFee.rank}</p> */}
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
