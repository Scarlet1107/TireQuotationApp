export interface SelectData {
  target: string;
  manufacturer: string;
  tireSize: string;
}

export interface SearchResult {
  id: number;
  manufacturer: string;
  pattern: string;
  tireSize: string;
  tirePrice: number;
  numberOfTires: number;
  priceRate: number;
  profit: number;
  wheel: Wheel;
  serviceFee: ServiceFee;
  totalPrice: number;
  totalPriceWithTax: number;
  extraOptions: ExtraOption[];
  discountRate: DiscountRate;
}

export interface Tire {
  manufacturer: string;
  pattern: string;
  tireSize: string;
  tirePrice: number;
  priceRate: number;
}

// すべてのタイヤにおいて共通のものは値として持っておいて、タイヤでフェッチできるものはidだけ持っておく
export interface PrintData {
  ids: number[];
  tires: Tire[];

  serviceFees: ServiceFee[];

  customerName: string;
  staffName: string;
  carModel: string;
  expiryDate: Date;
  quotationNumber: string;

  numberOfTires: number; //タイヤの数

  checkBoxState: CheckboxState; //工賃のチェックリスト(すべて同じ)
  discountRate: DiscountRate; // 工賃の割引率（すべて同じ）

  wheels: Wheel[];
  extraOptions: ExtraOption[];
}

export interface ExtraOption {
  id: string;
  option: string;
  price: number;
  quantity: number;
}

export interface CheckboxState {
  laborFee: boolean;
  removalFee: boolean;
  tireStorageFee: boolean;
  tireDisposalFee: boolean;
}

export interface DiscountRate {
  laborFee: number;
  removalFee: number;
  tireStorageFee: number;
}

export interface ServiceFee {
  rank: string;
  laborFee: number;
  removalFee: number;
  tireStorageFee: number;
  tireDisposalFee: number;
}

export interface Wheel {
  isIncluded: boolean;
  name: string;
  size: string;
  quantity: number;
  price: number;
}
