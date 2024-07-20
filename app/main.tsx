"use client";
import { ExtraOption, Result, TireData } from "@/utils/interface";
import {
  getAllTireSizes,
  getCustomerTypePriceRates,
  getAllTiresBySize,
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Value } from "@radix-ui/react-select";

const Main = () => {
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);

  // 改名が必要。検索条件をまとめたものだから、もっと適当な名前があるはず。
  const [selectedData, setSelectedData] = useState<TireData>({
    priceRate: 0,
    numberOfTires: 1,
    brandName: "",
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
        new Set(sizes.data.map((item) => item.size))
      );
      setTireSizes(uniqueSizes);
    }
  };

  const fetchAllBrandNames = async () => {
    const names = await getAllBrandNames();
    if (names.data) {
      const uniqueBrandNames = Array.from(
        new Set(names.data.map((item) => item.brandName))
      );
      setBrandNames(uniqueBrandNames);
      console.log("uniqueBrandNames", uniqueBrandNames); //Delete later
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
    setSelectedData((prev) => ({...prev, brandName: brandName}))
  }

  const handleNumberOfTiresChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedData((prev) => ({ ...prev, numberOfTires: value }));
  };

  const handleEstimate = async () => {
    const { tireSize, priceRate, numberOfTires } = selectedData;
    if (!tireSize || priceRate === 0 || numberOfTires === 0) {
      console.log("必要な情報が入力されていません。");
      return;
    }

    const res = await getAllTiresBySize(tireSize);
    if (res.data === null) {
      alert("タイヤの情報が見つかりませんでした。");
      return;
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
          option.id === id ? { ...option, [field]: newValue } : option
        )
      );
    };

  return (
    <div className="mt-8 flex">
      <div className="w-1/2 flex flex-col space-y-8 ml-12">
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

        {/* <Select onValueChange={(Value) => handleBrandNameChange(Value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="メーカーを選択" />
          </SelectTrigger>
          <SelectContent>
            {brandNames.map(() => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <select className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value=""></option>
          <option value="1">メーカー１</option>
          <option value="2">メーカー２</option>
          <option value="3">メーカー３</option>
        </select>

        <div className="flex">
          <div className="space-x-4">
            <Label htmlFor="number" className="text-xl">
              数量
            </Label>
            <Input
              id="number"
              type="number"
              onChange={handleNumberOfTiresChange}
              value={selectedData.numberOfTires}
              className="w-1/2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-top space-x-2">
              <Checkbox id="terms1" />
              <Label className="text-sm font-medium">工賃</Label>
            </div>
            <div className="flex items-top space-x-2">
              <Checkbox id="terms2" />
              <Label className="text-sm font-medium">脱着工賃</Label>
            </div>
            <div className="flex items-top space-x-2">
              <Checkbox id="terms3" />
              <Label className="text-sm font-medium">タイヤ処分料</Label>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Label>その他のオプション</Label>
          <Button onClick={addExtraOption}>+</Button>
          {extraOptions.map((extraOption, index) => (
            <div key={extraOption.id} className="flex space-x-4 mt-4">
              <p className="px-4">{index + 1}</p>
              <Label>項目</Label>
              <Input
                name="option"
                type="text"
                onChange={handleExtraOptionChange(extraOption.id, "option")}
                value={extraOption.option}
                placeholder="オプション名"
              />
              <Label>金額</Label>
              <Input
                name="price"
                type="number"
                step={100}
                onChange={handleExtraOptionChange(extraOption.id, "price")}
                value={extraOption.price}
                placeholder="金額"
              />
              <Label>数量</Label>
              <Input
                name="quantity"
                type="number"
                onChange={handleExtraOptionChange(extraOption.id, "quantity")}
                value={extraOption.quantity}
                placeholder="数量"
              />
              <Button
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => deleteExtraOption(extraOption.id)}
              >
                消
              </Button>
            </div>
          ))}
        </div>

        <div className="space-x-4">
          <Label className="text-xl">値引き額</Label>
          <Input className="w-1/5" />
        </div>

        <Button
          className="bg-green-500 hover:bg-green-600 w-1/5"
          onClick={handleEstimate}
        >
          この内容で見積もる！
        </Button>
      </div>
      <div className="w-1/2 flex flex-col space-x-8 space-y-8">
        <p className="flex justify-center text-3xl font-bold">見積もり結果</p>
        <div className="grid grid-cols-2 gap-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>会社名 : {result.brandName}</CardTitle>
                <CardDescription>モデル名 : {result.modelName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>途中計算式 : {result.intermediateCalculation}</p>
                <p>金額 : {result.price}円</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
