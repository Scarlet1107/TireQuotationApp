import Papa from "papaparse";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  children: React.ReactNode;
  tableName: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ children, tableName }) => {
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

          const { error } = await supabase.from(tableName).insert(chunk);

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
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          accept=".csv"
          onChange={handleFileChange}
          className="sr-only"
        />
        <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "アップロード中..." : "アップロード開始"}
        </button>
        <label
          htmlFor="file-upload"
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>ファイル選択</span>
        </label>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {file ? file.name : "ファイルが選択されていません"}
      </p>
    </div>
  );
};

export default UploadButton;
