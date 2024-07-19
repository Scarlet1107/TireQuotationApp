import { UUID } from "crypto";

export interface TireData {
  priceRate: number;
  theNumberOfTire: number;
  tireSize: string;
}

export interface Result {
  brandName: string;
  modelName: string;
  intermediateCalculation: string;
  price: number;
}

export interface extraOption{
  id: string;
  option: string;
  price: number;
  quantity: number;
}