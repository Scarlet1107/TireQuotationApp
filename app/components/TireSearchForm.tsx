import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CUSTOMER_TYPE,
  DEFAULT_TIRE_SEARCH_FILTERS,
  DEFAULT_WHEEL,
  TAX_RATE,
} from "@/config/constants";
import {
  SearchResult,
  SelectData,
  ServiceFee,
  Wheel,
} from "@/utils/interface";
import {
  getAllmanufacturer,
  getAllTireSizes,
  getCustomerTypePriceRates,
  getServiceFees,
  searchTires,
} from "@/utils/supabaseFunctions";
import { toast } from "@/components/ui/use-toast";
import WheelInputCollapsible from "./WheelInputCollapsible";
import { Button } from "@/components/ui/button";
import { usePrintData } from "../printDataContext";

interface TireSearchFormProps {
  setSearchResults: (results: SearchResult[]) => void;
}

const TireSearchForm = ({ setSearchResults }: TireSearchFormProps) => {
  const { printData } = usePrintData();
  const [tireSizes, setTireSizes] = useState<string[]>([]);
  const [tireSearchFilters, setTireSearchFilters] = useState<SelectData>(
    DEFAULT_TIRE_SEARCH_FILTERS,
  );
  const [priceRates, setPriceRates] = useState<any[]>([]);
  const [manufacturer, setmanufacturer] = useState<string[]>([]);
  const [wheel, setWheel] = useState<Wheel>(DEFAULT_WHEEL);
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);

  useEffect(() => {
    fetchTireSizes();
    fetchPriceRates();
    fetchAllmanufacturer();
    fetchServiceFees();
  }, []);

  const fetchTireSizes = async () => {
    const sizes = await getAllTireSizes();
    if (sizes.data) {
      const uniqueSizes = Array.from(
        new Set(sizes.data.map((item) => item.size)),
      );
      setTireSizes(uniqueSizes);
    }
  };

  const fetchPriceRates = async () => {
    const rates = await getCustomerTypePriceRates();
    setPriceRates(rates.data as any[]);
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

  const handleCustomerTypeChange = (value: string) => {
    setTireSearchFilters((prev) => ({ ...prev, target: value }));
  };

  const handleTireSizeChange = (size: string) => {
    setTireSearchFilters((prev) => ({ ...prev, tireSize: size }));
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setTireSearchFilters((prev) => ({ ...prev, manufacturer: manufacturer }));
  };

  // 計算がわかりにくいのでリファクタリングする
  // 関数名もわかりにくい
  const handleSearch = async () => {
    if (!tireSearchFilters.tireSize) {
      toast({
        variant: "destructive",
        title: "タイヤサイズが選択されていません。",
      });
      return;
    }

    // 選択されてるかのチェック
    if (tireSearchFilters.target === "") {
      toast({
        variant: "destructive",
        title: "お客さんが選択されていません。",
      });
      return;
    }

    if (printData.numberOfTires === 0) {
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

    const res = await searchTires(
      tireSearchFilters.tireSize,
      tireSearchFilters.manufacturer,
    ); //データベースからタイヤ情報を検索
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      toast({
        variant: "destructive",
        title: "タイヤ情報が見つかりませんでした。",
      });
      return;
    }

    if (tireSearchFilters.manufacturer === "all") {
      toast({
        title: "すべてのメーカーで検索しました",
      });
    }

    const newResults = res.data.map((tire: any) => {
      const tirePrice = tire.price;
      const serviceFee = calculateLaborCost(tire.laborCostRank);
      const totalServiceFee = calculateTotalServiceFee(serviceFee);
      // ここでお客さんのターゲットによって価格を変える
      const priceRate: number = searchMarkupRate(
        tire.pattern,
        tireSearchFilters.target,
      );
      // タイヤ一本当たりの「A表の価格」*「お客さんのタイプごとの掛け率」
      const sellingPrice = Math.ceil(tirePrice * priceRate);

      const profit = Math.ceil(
        (sellingPrice - tirePrice * searchMarkupRate(tire.pattern, "cost")) *
          printData.numberOfTires,
      );
      const wheelPrice = wheel.isIncluded ? wheel.price * wheel.quantity : 0;

      const totalPrice = Math.floor(
        sellingPrice * printData.numberOfTires +
          totalServiceFee +
          wheelPrice +
          printData.extraOptions.reduce(
            (acc, option) => acc + option.price * option.quantity,
            0,
          ),
      );

      const totalPriceWithTax = Math.floor(totalPrice * TAX_RATE);

      return {
        id: tire.id,
        manufacturer: tire.manufacturer,
        pattern: tire.pattern,
        tireSize: tireSearchFilters.tireSize,
        tirePrice: tirePrice,
        priceRate: priceRate,
        profit: profit,
        wheel: wheel,
        numberOfTires: printData.numberOfTires,
        serviceFee: {
          rank: tire.laborCostRank,
          laborFee: serviceFee.laborFee,
          removalFee: serviceFee.removalFee,
          tireStorageFee: serviceFee.tireStorageFee,
          tireDisposalFee: serviceFee.tireDisposalFee,
        },
        totalPrice: totalPrice,
        totalPriceWithTax: totalPriceWithTax,
        discountRate: printData.discountRate,
      };
    });
    // ここでSearchResult型に入れるのでインターフェイスと同じ形にする
    setSearchResults(newResults);
  };

  // タイヤのパターンとお客さんのターゲットによって価格を検索する。％ではなく割合で返すため注意
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

  return (
    <>
      <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
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
      <div className="my-4">
        <WheelInputCollapsible wheel={wheel} setWheel={setWheel} />
      </div>
      <Button
        className="w-min transform bg-green-500 hover:bg-green-600"
        onClick={handleSearch}
      >
        この内容で検索
      </Button>
    </>
  );
};

export default TireSearchForm;
