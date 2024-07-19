import { supabase } from "../utils/supabase";

export const getCustomerTypePriceRates = async () => {
  const CustomerTypePriceRate = await supabase
    .from("CustomerTypePriceRate")
    .select("*");
  return CustomerTypePriceRate;
};

export const getAllTireInformation = async () => {
  const TireInformation = await supabase.from("tirePrice").select("*");
  return TireInformation;
};

export const getAllTireSizes = async () => {
  const TireSize = await supabase.from("tirePrice").select("size");
  return TireSize;
};

export const getAllTiresBySize = async (size: string) => {
  const TiresBySize = await supabase
    .from("tirePrice")
    .select("*")
    .eq("size", size);
  return TiresBySize;
};

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
