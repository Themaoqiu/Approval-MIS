"use client";

import { motion } from "framer-motion";
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

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  resourceName?: string;
  onConfirm: () => Promise<void>;
  isDangerous?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "删除确认",
  description,
  resourceName = "此项",
  onConfirm,
  isDangerous = true,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-slate-900 dark:border-slate-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="dark:text-white">{title}</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              {description || `确定要删除${resourceName}吗？此操作无法撤销。`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={deleting}
                className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant={isDangerous ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={deleting}
                className={isDangerous ? "dark:bg-red-700 dark:hover:bg-red-800" : "dark:bg-slate-700 dark:hover:bg-slate-600"}
              >
                {deleting ? "删除中..." : "确认删除"}
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
