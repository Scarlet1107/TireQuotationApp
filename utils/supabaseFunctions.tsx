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

export const getAllmanufacturer = async () => {
  const manufacturer = await supabase.from("tirePrice").select("manufacturer");
  return manufacturer;
};

export const searchTires = async (size: string, brandName: string) => {
  let query = supabase.from("tirePrice").select("*").eq("size", size);
  if (brandName != "all") {
    query = query.eq("manufacturer", brandName);
  }
  const results = await query;
  return results;
};

export const getServiceFees = async () => {
  const serviceFees = await supabase.from("ServiceFees").select("*");
  return serviceFees.data;
};

export const searchTireByID = async (id: number) => {
  const tire = await supabase.from("tirePrice").select("*").eq("id", id);
  return tire;
};

// For master page

export const deleteAllData = async (name: string) => {
  const { data, error } = await supabase.from(name).delete().gte("id", 0);

  if (error) {
    console.error(error);
  } else {
    console.log("All data deleted:", data);
  }
};

export const ExistDB = async (name: string): Promise<boolean> => {
  const { data, error } = await supabase.from(name).select("*").limit(1);
  console.log(data);
  if (data?.length == 0) {
    return false;
  }
  if (data) {
    return true;
  }
  return false;
};
