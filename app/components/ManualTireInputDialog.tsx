import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

const ManualTireInputDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>手打ち入力</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>手打ち入力</DialogTitle>
          <DialogDescription>
            特化タイヤなどのデータベースに存在しないタイヤを手動で入力できます
          </DialogDescription>
        </DialogHeader>
        This is content
      </DialogContent>
    </Dialog>
  );
};

export default ManualTireInputDialog;
