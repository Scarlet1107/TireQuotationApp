"use client";
import { ExtraOption, Result, TireData } from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  searchTires,
  getAllBrandNames,
} from "@/utils/supabaseFunctions";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
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

import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Main = () => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const { toast } = useToast();

  // 改名が必要。検索条件をまとめたものだから、もっと適当な名前があるはず。
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

  useEffect(() => {
    fetchPriceRates();
    fetchTireSizes();
    fetchAllBrandNames();
  }, []);

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

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const totalPrice =
        Math.ceil((tirePrice * numberOfTires * priceRate) / 10) * 10;
      return {
        brandName: tire.brandName,
        modelName: tire.modelName,
        intermediateCalculation: `${tirePrice} × ${numberOfTires} × ${priceRate}`,
        price: totalPrice,
      };
    });
    setResults(newResults);
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

  return (
    <div className="mt-8 flex w-full flex-col md:flex-row">
      <div className="ml-12 flex w-max flex-col space-y-8 md:w-full">
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

        <div className="flex flex-col space-y-4 md:space-x-8 lg:flex-row">
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
              <Checkbox id="terms1" defaultChecked />
              <Label className="text-sm font-medium">作業工賃</Label>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox id="terms2" defaultChecked />
              <Label className="text-sm font-medium">脱着料</Label>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox id="terms3" defaultChecked />
              <Label className="text-sm font-medium">廃タイヤ処分</Label>
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

        <div className="space-x-4">
          <Label className="text-xl">値引き額</Label>
          <Input className="w-min" />
        </div>

        <Button
          className="w-min transform bg-green-500 transition-all duration-100 hover:scale-95 hover:bg-green-600"
          onClick={handleEstimate}
        >
          この内容で見積もる！
        </Button>
      </div>
      <div className="flex w-full flex-col space-x-8 space-y-8">
        <p className="mt-12 flex justify-center text-3xl font-bold md:mt-0">
          見積もり結果
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {results.map((result, index) => (
            <Card
              key={index}
              className="transform transition-all duration-100 hover:scale-105"
            >
              <CardHeader>
                <CardTitle>会社名 : {result.brandName}</CardTitle>
                <CardDescription>モデル名 : {result.modelName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>途中計算式 : {result.intermediateCalculation}</p>
              </CardContent>
              <CardFooter>
                <p>
                  金額 : <span className="font-medium">{result.price}</span>円
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Main;
