import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_PRINTDATA } from "@/config/constants";
import React from "react";
import { usePrintData } from "../printDataContext";
import { SearchResult } from "@/utils/interface";

interface ResetButtonProps {
  setSearchResult: React.Dispatch<React.SetStateAction<SearchResult[]>>;
}

const ResetButton = ({setSearchResult}: ResetButtonProps) => {
  const { printData, setPrintData } = usePrintData();
  const resetPrintData = () => {
    if (printData === DEFAULT_PRINTDATA) return;
    if (window.confirm("入力したデータをリセットしますか？")) {
      setPrintData(DEFAULT_PRINTDATA);
      setSearchResult([]);
      toast({
        title: "リセットしました",
      });
      localStorage.clear();
    }
  };

  return (
    <Button
      className="w-max place-self-end font-medium"
      variant={"destructive"}
      onClick={() => resetPrintData()}
    >
      リセット
    </Button>
  );
};

export default ResetButton;
