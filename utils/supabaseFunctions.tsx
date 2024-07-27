import { supabase } from "../utils/supabase";

export const getCustomerTypePriceRates = async () => {
  const CustomerTypePriceRate = await supabase
    .from("CustomerTypePriceRate")
    .select("*");
  return CustomerTypePriceRate;
};

export const getAllTireSizes = async () => {
  const TireSize = await supabase.from("tirePrice").select("size");
  return TireSize;
};

export const getAllBrandNames = async () => {
  const BrandNames = await supabase.from("tirePrice").select("brandName");
  return BrandNames;
};

export const searchTires = async (size: string, brandName: string) => {
  let query = supabase.from("tirePrice").select("*").eq("size", size);
  if (brandName != "all") {
    query = query.eq("brandName", brandName);
  }
  const results = await query;
  return results;
};

export const getServiceFees = async () => {
  const serviceFees = await supabase.from("ServiceFees").select("*");
  return serviceFees.data;
};

// For master page

export const deleteAllData = async () => {
  const { data, error } = await supabase
    .from("tirePrice")
    .delete()
    .neq("id", "0");

  if (error) {
    console.error(error);
  } else {
    alert("テーブルのデータをすべて削除しました");
    console.log("All data deleted:", data);
  }
};
