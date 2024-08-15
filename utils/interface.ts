export interface TireData {
  target: string;
  numberOfTires: number;
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
  extraOptions: ExtraOption[];
  discountRate: DiscoundRate;
}

export interface PrintData {
  customerName: string;
  carModel: string;
  expiryDate: Date;
  ids: number[];
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

export interface DiscoundRate {
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
