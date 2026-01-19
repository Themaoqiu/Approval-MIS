"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck, Eye, ClipboardList } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface ApprovalTask {
  taskid: number;
  status: string;
  createdAt: string;
  application: {
    title: string;
    type: string;
    applicant: {
      username: string;
      nickname: string | null;
    };
  };
}

interface ApprovalTasksTableProps {
  tasks: ApprovalTask[];
  loading: boolean;
}

export function ApprovalTasksTable({
  tasks,
  loading,
}: ApprovalTasksTableProps) {
  const router = useRouter();

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: "请假",
      reimbursement: "报销",
    };
    return labels[type] || type;
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 },
    }),
  };

  return loading ? (
    <motion.p
      className="text-center py-8 text-muted-foreground dark:text-slate-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      加载中...
    </motion.p>
  ) : tasks.length === 0 ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardList className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>暂无待办任务</EmptyTitle>
          <EmptyDescription>当前没有需要处理的审批任务</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <Table>
        <TableHeader>
          <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/30">
            <TableHead className="text-center dark:text-slate-300">申请标题</TableHead>
            <TableHead className="text-center dark:text-slate-300">类型</TableHead>
            <TableHead className="text-center dark:text-slate-300">申请人</TableHead>
            <TableHead className="text-center dark:text-slate-300">提交时间</TableHead>
            <TableHead className="text-center dark:text-slate-300">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <motion.tr
              key={task.taskid}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
            >
              <TableCell className="text-center dark:text-slate-300">
                {task.application.title}
              </TableCell>
              <TableCell className="text-center dark:text-slate-300">
                {getTypeLabel(task.application.type)}
              </TableCell>
              <TableCell className="text-center dark:text-slate-300">
                {task.application.applicant.nickname ||
                  task.application.applicant.username}
              </TableCell>
              <TableCell className="text-center dark:text-slate-300">
                {new Date(task.createdAt).toLocaleString("zh-CN")}
              </TableCell>
              <TableCell className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => router.push(`/approvals/tasks/${task.taskid}`)}
                    title={task.status === "pending" ? "处理任务" : "查看详情"}
                    className="dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {task.status === "pending" ? (
                      <ClipboardCheck className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
