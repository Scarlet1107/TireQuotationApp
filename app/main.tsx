"use client";
import {
  CheckboxState,
  ExtraOption,
  Result,
  ServiceFee,
  TireData,
} from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  searchTires,
  getAllBrandNames,
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

const Main = (props: any) => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);
  const { toast } = useToast();
  const [checkedStates, setCheckedStates] = useState<CheckboxState>({
    laborFee: true,
    removalFee: true,
    tireDisposalFee: true,
  });

  const [selectedData, setSelectedData] = useState<TireData>({
    priceRate: 0,
    numberOfTires: 4,
    brandName: "all",
    tireSize: "",
  });
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [results, setResults] = useState<Result[]>([]);

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

  const fetchAllBrandNames = async () => {
    const names = await getAllBrandNames();
    if (names.data) {
      const uniqueBrandNames = Array.from(
        new Set(names.data.map((item) => item.brandName)),
      );
      setBrandNames(uniqueBrandNames);
    }
  };

  const fetchServiceFees = async () => {
    const res = await getServiceFees();
    setServiceFees(res as ServiceFee[]);
    console.log("serviceFees = ", res);
  };

  useEffect(() => {
    fetchPriceRates();
    fetchTireSizes();
    fetchAllBrandNames();
    fetchServiceFees();
  }, []);

  const handleCheckboxChange =
    (key: keyof CheckboxState) => (checked: boolean) => {
      setCheckedStates((prevState) => ({
        ...prevState,
        [key]: checked,
      }));
    };

  useEffect(() => {
    console.log(checkedStates);
  }, [checkedStates]); //Delete later

  const handleCustomerTypeChange = (value: string) => {
    setSelectedData((prev) => ({ ...prev, priceRate: Number(value) / 100 }));
  };

  const handleTireSizeChange = (size: string) => {
    setSelectedData((prev) => ({ ...prev, tireSize: size }));
  };

  const handleBrandNameChange = (brandName: string) => {
    setSelectedData((prev) => ({ ...prev, brandName: brandName }));
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

  const calculateLaborCost = (rank: string) => {
    let totalCost = 0;
    const laborFee = serviceFees.find((fee) => fee.rank === rank)?.laborFee;
    return laborFee ? laborFee : 0;
  };

  const handleEstimate = async () => {
    const { tireSize, priceRate, brandName, numberOfTires } = selectedData;

    if (!tireSize) {
      toast({
        variant: "destructive",
        title: "タイヤサイズが選択されていません。",
      });
      return;
    }

    if (priceRate === 0) {
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

    const res = await searchTires(tireSize, brandName);
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      toast({
        variant: "destructive",
        title: "タイヤ情報が見つかりませんでした。",
      });
      return;
    }

    if (brandName === "all") {
      toast({
        title: "すべてのメーカーで検索しました",
      });
    }

    console.log(res.data);

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const totalPrice =
        Math.ceil((tirePrice * numberOfTires * priceRate) / 10) * 10;
      return {
        brandName: tire.brandName,
        modelName: tire.modelName,
        intermediateCalculation: `${tirePrice} × ${numberOfTires} × ${priceRate}`,
        laborCostRank: tire.laborCostRank,
        price: totalPrice,
      };
    });
    setResults(newResults);
    setComponentRefs(newResults.map(() => React.createRef<HTMLDivElement>()));
  };

  const addExtraOption = () => {
    if (extraOptions.length >= 9) return;
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

  return (
    <div className="mt-8 flex w-full flex-col md:flex-row">
      <div className="ml-12 flex w-max flex-col space-y-8">
        <div className="flex flex-col space-y-3 xl:flex-row xl:space-x-4 xl:space-y-0">
          <Select onValueChange={(Value) => handleCustomerTypeChange(Value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="お客さんを選択" />
            </SelectTrigger>
            <SelectContent>
              {priceRates &&
                priceRates.map((rate: any) => (
                  <SelectItem key={rate.target} value={rate.percent}>
                    {rate.target}
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
          <Select onValueChange={(Value) => handleBrandNameChange(Value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="メーカーを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="all">
                すべて
              </SelectItem>
              {brandNames.map((brandName) => (
                <SelectItem key={brandName} value={brandName}>
                  {brandName}
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
            <div className="items-top flex space-x-2">
              <Checkbox
                id="laborFee"
                checked={checkedStates.laborFee}
                onCheckedChange={handleCheckboxChange("laborFee")}
              />
              <Label className="text-sm font-medium" htmlFor="laborFee">
                作業工賃
              </Label>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="removalFee"
                checked={checkedStates.removalFee}
                onCheckedChange={handleCheckboxChange("removalFee")}
              />
              <Label className="text-sm font-medium" htmlFor="removalFee">
                脱着料
              </Label>
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

        <div>
          <Label className="mr-2 text-lg">その他のオプション</Label>
          <Button onClick={addExtraOption}>+</Button>
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
        <p className="mt-12 flex justify-center text-3xl font-bold md:mt-0">
          見積もり結果
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {results.map((result, index) => (
            <div key={index}>
              <ReactToPrint
                content={() => componentRefs[index].current}
                trigger={() => (
                  <Card className="transform cursor-pointer transition-all duration-100 hover:scale-105">
                    <CardHeader>
                      <CardTitle>会社名 : {result.brandName}</CardTitle>
                      <CardDescription>
                        モデル名 : {result.modelName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>途中計算式 : {result.intermediateCalculation}</p>
                      <p>工賃ランク：{result.laborCostRank}</p>
                    </CardContent>
                    <CardFooter>
                      <p>
                        金額 :{" "}
                        <span className="font-medium">{result.price}</span>円
                      </p>
                    </CardFooter>
                  </Card>
                )}
              />
              <div className="hidden">
                <PrintContent ref={componentRefs[index]} result={result} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Main;
