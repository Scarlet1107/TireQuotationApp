export interface CheckboxState {
  laborFee: boolean;
  removalFee: boolean;
  tireDisposalFee: boolean;
}

export interface TireData {
  priceRate: number;
  numberOfTires: number;
  brandName: string;
  tireSize: string;
}

export interface Result {
  brandName: string;
  modelName: string;
  intermediateCalculation: string;
  laborCostRank: string;
  price: number;
}

export interface ExtraOption {
  id: string;
  option: string;
  price: number;
  quantity: number;
}

export interface ServiceFee {
  rank: string;
  laborFee: number;
  removalFee: number;
  tireDisposalFee: number;
}
