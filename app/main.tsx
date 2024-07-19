"use Client";
import { extraOption, Result, TireData } from "@/utils/interface";
import {
  getAllTireInformation,
  getAllTireSize,
  getCustomerTypePriceRate,
  getAllTiresBySize,
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

const Main = () => {
  const [CustomerTypePriceRate, setCustomerTypePriceRate] = useState<
    null | any[]
  >(null);
  const [tireSizeOptions, setTireSizeOptions] = useState<any>([]);
  const [customerType, setCustomerType] = useState<string>("");
  const [selectedData, setSelectedData] = useState<TireData>({
    priceRate: 0,
    theNumberOfTire: 1,
    tireSize: "",
  });
  const [extraOptions, setExtraOptions] = useState<extraOption[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  // お客さんのタイプのよる価格の掛け率を取得
  useEffect(() => {
    const getRate = async () => {
      const rates = await getCustomerTypePriceRate();
      setCustomerTypePriceRate(rates.data);
      console.log("rates.data = ", rates.data);
    };
    getRate();
  }, []);

  // タイヤサイズの情報を取得
  useEffect(() => {
    const getTireSize = async () => {
      const size = await getAllTireSize();
      const uniqueSizesSet = new Set();
      if (size.data === null) return;
      size.data.forEach((item) => {
        uniqueSizesSet.add(item.size);
      });
      const uniqueSizes = Array.from(uniqueSizesSet);
      setTireSizeOptions(uniqueSizes);
    };
    getTireSize();
  }, []);

  // プロップスの受け取り方に問題あり。
  const handleCustomerChange = (e: any) => {
    console.log("CustomerType = ", e);
    setCustomerType(e);
    selectedData.priceRate = e / 100;
    console.log("selectedData = ", selectedData);
  };

  const handleTireSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedData({
      ...selectedData,
      tireSize: e.target.value,
    });
  };

  const handleTheNumberOfTiresChange = (e: any) => {
    setSelectedData({
      ...selectedData,
      theNumberOfTire: e.target.value,
    });
  };

  const handleButtonClick = async () => {
    console.log("button clicked");
    if (
      selectedData.tireSize === "" ||
      selectedData.priceRate === 0 ||
      selectedData.theNumberOfTire === 0
    ) {
      console.log("必要な情報が入力されていません。");
      return;
    }
    const res = await getAllTiresBySize(selectedData.tireSize);
    if (res.data === null) {
      alert("タイヤの情報が見つかりませんでした。");
      return;
    } else {
      console.log("res.data = ", res.data);
      // const tirePrice = res.data[0].price;
      // const totalPrice =
      //   tirePrice * selectedData.theNumberOfTire * selectedData.priceRate;
      // console.log("totalPrice = ", totalPrice);
      setResults([]);
      res.data.forEach((tire: any, index) => {
        const tirePrice = res.data[index].price;
        const totalPrice =
          Math.ceil(
            (tirePrice *
              selectedData.theNumberOfTire *
              selectedData.priceRate) /
              10
          ) * 10;

        setResults((results) => [
          ...results,
          {
            brandName: tire.brandName,
            modelName: tire.modelName,
            intermediateCalculation: `${tirePrice} × ${selectedData.theNumberOfTire} × ${selectedData.priceRate}`,
            price: totalPrice,
          },
        ]);
      });
    }
  };

  const addExtraOption = () => {
    if (extraOptions.length >= 5) return;

    setExtraOptions([
      ...extraOptions,
      {
        id: uuidv4(),
        option: "",
        price: 0,
        quantity: 4,
      },
    ]);
  };

  const deleteExtraOption = (id: string) => {
    const newOptions = extraOptions.filter((option) => option.id !== id);
    setExtraOptions(newOptions);
  };

  const handleExtraOptionChange = (id: string, field: keyof extraOption) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setExtraOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === id ? { ...option, [field]: newValue } : option
        )
      );
    };
  };

  return (
    <div className="mt-8 flex">
      {/* 左側の部分 */}
      <div className="w-1/2 flex flex-col space-y-8 ml-12">
        <div className="space-x-4">
          <label className="text-xl">お客さんを選択</label>
          <select
            onChange={(e) => handleCustomerChange(e.target.value)}
            value={customerType}
            className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value=""></option>
            {/* ここで表示する文字列とvalue値が異なるので注意 */}
            {CustomerTypePriceRate &&
              CustomerTypePriceRate.map((rate) => (
                <option key={uuidv4()} value={rate.percent}>
                  {rate.target}
                </option>
              ))}
          </select>
        </div>
        <div className="space-x-4">
          <label htmlFor="tireSize" className="text-xl">
            タイヤサイズを選択
          </label>
          <select
            className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedData.tireSize}
            onChange={(e) => handleTireSizeChange(e)}
          >
            <option value=""></option>
            {tireSizeOptions.map((size: string) => (
              <option key={uuidv4()} value={String(size)}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-4">
          <label htmlFor="options" className="text-xl">
            メーカーを選択
          </label>
          <select className="place-self-center mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value=""></option>
            <option value="1">メーカー１</option>
            <option value="2">メーカー２</option>
            <option value="3">メーカー３</option>
          </select>
        </div>

        <div className="space-x-4">
          <Label className="text-xl">数量</Label>
          <Input
            onChange={(e) => handleTheNumberOfTiresChange(e)}
            defaultValue={selectedData.theNumberOfTire}
            className="w-1/5"
          />
        </div>

        <div className="flex justify-around">
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" className="" />
            <div className="grid gap-1.5 leading-none">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                工賃
              </Label>
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                脱着工賃
              </Label>
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                タイヤ処分料
              </Label>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Label>その他のオプション</Label>
          <Button onClick={() => addExtraOption()}>+</Button>
          {extraOptions.map((extraOption, index) => (
            <div key={extraOption.id} className="flex space-x-4 mt-4">
              <p className="px-4">{index + 1}</p>
              <Label>項目</Label>
              <Input
                name="option"
                onChange={handleExtraOptionChange(extraOption.id, `option`)}
                value={extraOption.option}
                placeholder="オプション名"
              />
              <Label>金額</Label>
              <Input
                name="price"
                onChange={handleExtraOptionChange(extraOption.id, `price`)}
                value={extraOption.price}
                placeholder="金額"
              />
              <Label>数量</Label>
              <Input
                name="quantity"
                onChange={handleExtraOptionChange(extraOption.id, `quantity`)}
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
          className=" bg-green-500 hover:bg-green-600 w-1/5"
          onClick={() => handleButtonClick()}
        >
          この内容で見積もる！
        </Button>
      </div>
      {/* 右側部分 */}
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

        {/* <Button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.print()}
        >
          印刷する
        </Button> */}
      </div>
    </div>
  );
};

export default Main;
