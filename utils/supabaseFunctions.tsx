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
  const { data, error } = await supabase
    .from("print_logs") // 新しいテーブル名
    .insert([
      {
        ids: printData.ids,
        tires: printData.tires,
        service_fees: printData.serviceFees,
        customer_name: printData.customerName,
        staff_name: printData.staffName,
        car_model: printData.carModel,
        expiry_date: printData.expiryDate,
        quotation_number: printData.quotationNumber,
        number_of_tires: printData.numberOfTires,
        check_box_state: printData.checkBoxState,
        discount_rate: printData.discountRate,
        wheels: printData.wheels,
        extra_options: printData.extraOptions,
      },
    ]);

  if (error) {
    console.error("Error uploading print data to print_logs: ", error);
    throw new Error("Failed to upload print data.");
  }

  console.log("Print data uploaded successfully to print_logs:", data);
  return data;
};

export const getPrintDataHistory = async () => {
  const { data, error } = await supabase
    .from("print_logs") // 新しいテーブル名
    .select("*")
    .order("id", { ascending: false }) // 最新のデータを取得
    .limit(20); // 過去20件

  if (error) {
    console.error("Error fetching print data history from print_logs: ", error);
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
