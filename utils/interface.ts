import { UUID } from "crypto";

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
  price: number;
}

export interface ExtraOption{
  id: string;
  option: string;
  price: number;
  quantity: number;
}