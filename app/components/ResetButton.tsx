import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_PRINTDATA } from "@/config/constants";
import { PrintData } from "@/utils/interface";
import React from "react";

interface ResetButtonProps {
  setPrintData: (printData: PrintData) => void;
  printDataLength: number;
}

const ResetButton = ({ setPrintData, printDataLength }: ResetButtonProps) => {
  const resetPrintData = () => {
    if (printDataLength === 0) return;
    if (window.confirm("入力したデータをリセットしますか？")) {
      setPrintData(DEFAULT_PRINTDATA);
      toast({
        title: "リセットしました",
      });
    }
  };

  return (
    <Button
      className="relative w-max place-self-end font-medium"
      variant={"destructive"}
      onClick={() => resetPrintData()}
      id="resetButton"
    >
      リセット
      {printDataLength >= 0 ? (
        <Label
          htmlFor="resetButton"
          className={`absolute -right-3 -top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-red-600 text-center font-bold text-black ${
            printDataLength === 1
              ? "bg-white"
              : printDataLength === 2
                ? "bg-orange-100"
                : printDataLength === 3
                  ? "bg-red-300"
                  : "bg-white"
          }`}
        >
          {printDataLength}
        </Label>
      ) : null}
    </Button>
  );
};

export default ResetButton;
