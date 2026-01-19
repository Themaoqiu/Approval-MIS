"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";
import { Eye, Trash2, FileText } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";

interface Application {
  applyId: number;
  title: string;
  type: string;
  status: string;
  currentStep: number;
  createdAt: string;
}

interface MyApplicationsTableProps {
  applications: Application[];
  loading: boolean;
  onWithdraw: (applyId: number) => void;
}

export function MyApplicationsTable({
  applications,
  loading,
  onWithdraw,
}: MyApplicationsTableProps) {
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
  ) : applications.length === 0 ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>暂无申请</EmptyTitle>
          <EmptyDescription>您还没有提交过任何申请</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => router.push('/applications/new')}>发起申请</Button>
        </EmptyContent>
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
            <TableHead className="text-center dark:text-slate-300">标题</TableHead>
            <TableHead className="text-center dark:text-slate-300">类型</TableHead>
            <TableHead className="text-center dark:text-slate-300">状态</TableHead>
            <TableHead className="text-center dark:text-slate-300">创建时间</TableHead>
            <TableHead className="text-center dark:text-slate-300">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app, index) => (
            <motion.tr
              key={app.applyId}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
            >
              <TableCell className="text-center dark:text-slate-300">{app.title}</TableCell>
              <TableCell className="text-center dark:text-slate-300">{getTypeLabel(app.type)}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </TableCell>
              <TableCell className="text-center dark:text-slate-300">
                {new Date(app.createdAt).toLocaleDateString("zh-CN")}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex gap-2 justify-center">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => router.push(`/applications/${app.applyId}`)}
                      title="查看详情"
                      className="dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onWithdraw(app.applyId)}
                      disabled={!(app.status === "pending" && app.currentStep === 0)}
                      title="撤回申请"
                      className="dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </motion.div>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
