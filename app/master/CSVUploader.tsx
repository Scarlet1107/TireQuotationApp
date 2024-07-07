import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const CSVUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    Papa.parse(file, {
      header: true,
      complete: async function (results: { data: any; errors: any }) {
        const { data, errors } = results;
        if (errors.length) {
          console.error(errors);
          setUploading(false);
          return;
        }

        // Supabaseのバルクインサート制限に注意しつつ、データを分割してアップロード
        const chunkSize = 1000; // 一度にアップロードするレコード数を設定
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);

          const { error } = await supabase.from("tirePrice").insert(chunk);

          if (error) {
            console.error(error);
            setUploading(false);
            return;
          }
        }

        alert("Upload complete!");
        setUploading(false);
      },
    });
  };

  return (
    <div className="space-y-10 items-center">
      <h1 className="text-2xl flex justify-center">
        CSV Upload for Tire Price
      </h1>
      <div className="flex justify-center space-x-10">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default CSVUploader;
