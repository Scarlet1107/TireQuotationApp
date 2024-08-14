import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function exportCSV(tableName: string) {
  try {
    // Supabaseからデータを取得
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) throw error;

    // データをCSV形式に変換
    const csv = Papa.unparse(data);

    // CSVファイルとしてダウンロード
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${tableName}_export.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
}
