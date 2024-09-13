import { ExistDB } from "@/utils/supabaseFunctions";
import React, { useState, useEffect } from "react";

interface Props {
  tableName: string;
  trigger: number;
  exist: boolean | null;
  setExist: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const DataExist: React.FC<Props> = ({
  tableName,
  trigger,
  exist,
  setExist,
}) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkExistence = async () => {
      try {
        setLoading(true);
        const result = await ExistDB(tableName);
        setExist(result);
      } catch (e) {
        console.error("テーブル存在確認中にエラーが発生しました:", e);
        setError("テーブル存在の確認に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    checkExistence();
  }, [trigger]);
  if (isLoading) return <div>テーブルの存在を確認中...</div>;
  if (error) return <div>エラー：{error}</div>;
  return (
    <div>
      {exist ? ` ${tableName}は存在します` : `${tableName}は存在しません`}
    </div>
  );
};

export default DataExist;
