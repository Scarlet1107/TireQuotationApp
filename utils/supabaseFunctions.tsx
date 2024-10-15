import { MAX_PRINT_LOG_HISTORY } from "@/config/constants";
import { supabase } from "../utils/supabase";
import { PrintData } from "./interface";

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

// Print History
export const uploadPrintData = async (printData: PrintData) => {
  const { data, error } = await supabase.from("printLogs").insert([
    {
      ids: printData.ids,
      tires: printData.tires,
      serviceFees: printData.serviceFees,
      customerName: printData.customerName,
      staffName: printData.staffName,
      carModel: printData.carModel,
      expiryDate: printData.expiryDate,
      quotationNumber: printData.quotationNumber,
      numberOfTires: printData.numberOfTires,
      checkBoxState: printData.checkBoxState,
      discountRate: printData.discountRate,
      wheels: printData.wheels,
      extraOptions: printData.extraOptions,
      memo: printData.memo,
    },
  ]);

  if (error) {
    console.error("Error uploading print data to printLogs: ", error);
    throw new Error("Failed to upload print data.");
  } else {
    console.log("Success to upload print history");
  }

  return data;
};

export const getPrintDataHistory = async () => {
  const { data, error } = await supabase
    .from("printLogs")
    .select("*")
    .order("id", { ascending: false }) // 最新のデータを取得
    .limit(MAX_PRINT_LOG_HISTORY); // 履歴の取得最大数

  if (error) {
    console.error("Error fetching print data history from printLogs: ", error);
    throw new Error("Failed to fetch print data history.");
  }

  return data;
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
  const { data } = await supabase.from(name).select("*").limit(1);
  if (data?.length == 0) {
    return false;
  }
  if (data) {
    return true;
  }
  return false;
};

export const deletePrint_log = async (id: number) => {
  const { error } = await supabase.from("printLogs").delete().eq("id", id);
  if (error) {
    console.error(error);
  } else {
    console.log("print logs are successfully deleted:");
  }
};

export const getPrintLogsId = async () => {
  const { data, error } = await supabase
    .from("printLogs")
    .select("id")
    .order("id", { ascending: false }); // 最新のデータを取得

  if (error) {
    console.error(error);
  }

  const ids: number[] = data ? data.map((item) => item.id) : [];

  return ids;
};
