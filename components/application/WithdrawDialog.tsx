"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  onConfirm,
}: WithdrawDialogProps) {
  const [withdrawing, setWithdrawing] = useState(false);

  const handleConfirm = async () => {
    setWithdrawing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>撤回申请</DialogTitle>
          <DialogDescription>
            确定要撤回此申请吗？撤回后申请将无法继续审批。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={withdrawing}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={withdrawing}
          >
            {withdrawing ? "撤回中..." : "确认撤回"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
