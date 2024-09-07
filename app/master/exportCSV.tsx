import Papa from "papaparse";

export const exportCSV = async (tableName: string) => {
  try {
    // Supabaseからデータを取得
    let header: string[];

    if (tableName == "tirePrice") {
      header = [
        "id",
        "size",
        "price",
        "manufacturer",
        "pattern",
        "laborCostRank",
      ];
    } else if (tableName == "ServiceFees") {
      header = [
        "id",
        "rank",
        "laborFee",
        "removalFee",
        "tireDisposalFee",
        "tireStorageFee",
      ];
    } else if (tableName == "CustomerTypePriceRate") {
      header = [
        "id",
        "pattern",
        "individual",
        "corporate",
        "wholesale",
        "cost",
      ];
    } else {
      header = [];
    }

    // データをCSV形式に変換
    const csv = Papa.unparse({
      fields: header,
      data: [],
    });

    // CSVファイルとしてダウンロード
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${tableName}_template.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
};
