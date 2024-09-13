// 変数の変更はここで行ってください

import {
  CheckboxState,
  DiscoundRate,
  PrintData,
  Wheel,
} from "@/utils/interface";

export const TAX_RATE = 1.1; // 消費税率。2024年8月時点で10%
export const DEFAULT_EXPIRY_DATE = 14 * 24 * 60 * 60 * 1000; // 見積もりの有効期限。デフォルトは14日
export const MAX_EXTRAOPTIONS = 5; // 追加オプションの最大数

// 変数と表示名の対応を配列として宣言
export const CUSTOMER_TYPE = [
  { value: "individual", label: "個人" },
  { value: "corporate", label: "法人" },
  { value: "wholesale", label: "業者" },
];

// 作業工賃、脱着工賃、タイヤ預かり料の割引率（%設定）
export const DEFAULT_DISCOUNT_RATE = <DiscoundRate>{
  laborFee: 0,
  removalFee: 0,
  tireStorageFee: 0,
};

// 工賃のチェックボックスの初期値
export const DEFAULT_CHECKED_STATUS = <CheckboxState>{
  laborFee: true,
  removalFee: true,
  tireStorageFee: true,
  tireDisposalFee: true,
};

export const DEFAULT_WHEEL = <Wheel>{
  isIncluded: false,
  name: "",
  size: "",
  quantity: 4,
  price: 1000,
};

export const DEFAULT_PRINTDATA = <PrintData>{
  ids: [],
  tires: [],
  staffName: "",
  customerName: "",
  carModel: "",
  quotationNumber: "",
  expiryDate: new Date(Date.now() + DEFAULT_EXPIRY_DATE),
  serviceFees: [],
  numberOfTires: 4,
  checkBoxState: DEFAULT_CHECKED_STATUS,
  wheels: [],
  discountRate: DEFAULT_DISCOUNT_RATE,
  extraOptions: [],
};
