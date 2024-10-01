import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deletePrint_log, getPrintLogsId } from "@/utils/supabaseFunctions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/components/ui/use-toast";

const HandlePrintLog = () => {
  const [number, setNumber] = useState<number>(200);
  const { toast } = useToast();

  const fetchPrintLog = async () => {
    const printLogsIds = await getPrintLogsId();

    const dataLength = printLogsIds.length;
    if (dataLength <= number) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: `保存されているlogの数が${number}以下です`,
      });
    } else {
      for (let i = number; i < dataLength; i++) {
        deletePrint_log(printLogsIds[i]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberOfValue = value === "" ? 0 : Number(value);

    if (isNaN(numberOfValue)) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "有効な数値を入力してください。",
      });
    } else {
      setNumber(numberOfValue);
    }
  };

  return (
    <div>
      <Input type="number" defaultValue={200} onChange={handleChange} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
            データを削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>logを消去します？</AlertDialogTitle>
            <AlertDialogDescription>
              {number}個を残してlogをすべて消去しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>やめる</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={fetchPrintLog}>はい</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HandlePrintLog;
