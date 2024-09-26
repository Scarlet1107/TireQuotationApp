import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_PRINTDATA } from "@/config/constants";
import React from "react";
import { usePrintData } from "../printDataContext";

const ResetButton = () => {
  const { printData, setPrintData } = usePrintData();
  const resetPrintData = () => {
    if (printData.ids.length === 0) return;
    if (window.confirm("入力したデータをリセットしますか？")) {
      setPrintData(DEFAULT_PRINTDATA);
      toast({
        title: "リセットしました",
      });
      localStorage.clear();
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
      {printData.ids.length >= 0 ? (
        <Label
          htmlFor="resetButton"
          className={`absolute -right-3 -top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-red-600 text-center font-bold text-black ${
            printData.ids.length === 1
              ? "bg-white"
              : printData.ids.length === 2
                ? "bg-orange-100"
                : printData.ids.length === 3
                  ? "bg-red-300"
                  : "bg-white"
          }`}
        >
          {printData.ids.length}
        </Label>
      ) : null}
    </Button>
  );
};

export default ResetButton;
