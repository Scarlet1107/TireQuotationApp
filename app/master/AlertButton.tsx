import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";

interface AlertButtonProps {
  onPush: () => void;
  children: React.ReactNode;
}

const AlertButton: React.FC<AlertButtonProps> = ({ onPush, children }) => {
  const handleClick = () => {
    onPush();
  };
  return (
    <div className="mt-5">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
            {children}を削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {children}を消去してもよろしいですか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              このボタンを押すと{children}
              を消去してしまうのですがよろしいでしょうか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>やめる</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleClick}>{children}を消去</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default AlertButton;
