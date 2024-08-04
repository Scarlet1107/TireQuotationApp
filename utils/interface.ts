export interface TireData {
  priceRate: number;
  numberOfTires: number;
  brandName: string;
  tireSize: string;
}

export interface SearchResult {
  manufacturer: string;
  pattern: string;
  tireSize: string;
  tirePrice: number;
  numberOfTires: number;
  priceRate: number;
  wheel: Wheel;
  serviceFee: ServiceFee;
  totalPrice: number;
  extraOptions: ExtraOption[];
}

export interface PrintData {
  customerName: string;
  carModel: string;
  searchResults: SearchResult[];
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

export interface ServiceFee {
  rank: string;
  laborFee: number;
  removalFee: number;
  tireStorageFee: number;
  tireDisposalFee: number;
}


export interface Wheel{
  size: string;
  quantity: number;
  price: number;
}