import Papa from "papaparse";
import { supabase } from "@/utils/supabase";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface UploadButtonProps {
  tableName: string;
  handleChange: () => void;
  handleClick: () => void;
  exist: boolean | null;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  tableName,
  handleChange,
  handleClick,
  exist,
}) => {
  const [fileName, setFile] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "失敗",
        description: "ファイルを選択してください",
        variant: "default",
      });
      return;
    }
    if (exist) handleClick();
    setUploading(true);

    try {
      Papa.parse(fileInputRef.current.files[0], {
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

          toast({
            title: "成功",
            description: `${fileName}をアップロードしました`,
            variant: "default",
          });
          setUploading(false);
          handleChange();
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="item-center relative justify-center">
        <input
          type="file"
          id={`file-upload-${tableName}`}
          accept=".csv"
          onChange={handleFileChange}
          className="sr-only"
          ref={fileInputRef}
        />
        <button
          className="item-center justify-center rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "アップロード中..." : "アップロード開始"}
        </button>
        <label
          htmlFor={`file-upload-${tableName}`}
          className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        {fileName ? fileName : "ファイルが選択されていません"}
      </p>
      <Toaster />
    </div>
  );
};

export default UploadButton;
