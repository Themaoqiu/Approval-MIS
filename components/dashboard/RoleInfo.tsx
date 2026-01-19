"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoleInfoProps {
  isAdmin: boolean;
  isApprover: boolean;
  isUser: boolean;
}

export function RoleInfo({ isAdmin, isApprover, isUser }: RoleInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <Card className="mt-6 p-4 bg-muted dark:bg-card/50 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
        <p className="text-sm text-muted-foreground dark:text-slate-300">
          当前角色:{" "}
          <motion.div
            className="ml-2 inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Badge variant="default">
              {isAdmin ? "系统管理员" : isApprover ? "审批人" : "普通员工"}
            </Badge>
          </motion.div>
        </p>
        {isAdmin && (
          <motion.p
            className="text-xs text-muted-foreground dark:text-slate-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            您可以查看所有数据、管理用户和审批流程
          </motion.p>
        )}
        {isApprover && (
          <motion.p
            className="text-xs text-muted-foreground dark:text-slate-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            您可以审批分配给您的任务
          </motion.p>
        )}
        {isUser && (
          <motion.p
            className="text-xs text-muted-foreground dark:text-slate-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            您可以创建和管理自己的申请
          </motion.p>
        )}
      </Card>
    </motion.div>
  );
}
