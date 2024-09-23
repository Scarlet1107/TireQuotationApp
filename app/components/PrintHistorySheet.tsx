import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITEMS_PER_PAGE } from "@/config/constants";
import { PrintData } from "@/utils/interface";
import { getPrintDataHistory } from "@/utils/supabaseFunctions";
import { useEffect, useState } from "react";

interface PrintHistorySheetProps {
  setPrintData: (data: PrintData) => void;
}

const PrintHistorySheet = ({ setPrintData }: PrintHistorySheetProps) => {
  const [printHistory, setPrintHistory] = useState<PrintData[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 履歴の現在のページ
  const [totalPages, setTotalPages] = useState(1); // 履歴の総ページ数

  useEffect(() => {
    const fetchPrintHistory = async () => {
      const res = await getPrintDataHistory();
      console.log(res);
      setPrintHistory(res as PrintData[]);
      setTotalPages(Math.ceil(res.length / ITEMS_PER_PAGE));
    };
    fetchPrintHistory();
  }, []);

  // 履歴のページを変更する関数
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return printHistory.slice(startIndex, endIndex);
  };

  // 履歴機能において、次のページに進む
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // 履歴機能において、前のページに戻る
  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-min transform bg-blue-500 text-white hover:bg-blue-600"
        >
          履歴を表示
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={prevPage} disabled={currentPage === 1}>
              前へ
            </Button>
            <span className="md:">
              ページ {currentPage} / {totalPages}
            </span>
            <Button onClick={nextPage} disabled={currentPage === totalPages}>
              次へ
            </Button>
          </div>
          <SheetTitle>履歴を管理</SheetTitle>
        </SheetHeader>
        <SheetDescription asChild>
          <SheetClose>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>見積り番号</TableHead>
                  <TableHead>お客様</TableHead>
                  <TableHead className="hidden md:table-cell">担当</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageData().map((history, index) => (
                  <TableRow key={index} onClick={() => setPrintData(history)}>
                    <TableCell className="font-medium">
                      {history.quotationNumber}
                    </TableCell>
                    <TableCell>{history.customerName}</TableCell>
                    <TableCell className="hidden sm:block">
                      {history.staffName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SheetClose>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default PrintHistorySheet;
