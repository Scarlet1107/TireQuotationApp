// 変数の変更はここで行ってください

import { CheckboxState, DiscoundRate } from "@/utils/interface";

export const TAX_RATE = 1.1; // 消費税率。2024年8月時点で10%
export const DEFAULT_EXPIRY_DATE = 14 * 24 * 60 * 60 * 1000; // 見積もりの有効期限。デフォルトは14日

// 作業工賃、脱着工賃、タイヤ預かり料の割引率（%設定）
export const DEFAULT_DISCOUNT_RATE = <DiscoundRate>{
  laborFee: 0,
  removalFee: 0,
  tireStorageFee: 100,
};

// 工賃のチェックボックスの初期値
export const DEFAULT_CHECKED_STATUS = <CheckboxState>{
  laborFee: true,
  removalFee: true,
  tireStorageFee: true,
  tireDisposalFee: true,
};
