"use client";

import { useRouter } from "next/navigation";
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

  return loading ? (
    <p className="text-center py-8 text-muted-foreground">加载中...</p>
  ) : tasks.length === 0 ? (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardList className="h-8 w-8" />
        </EmptyMedia>
        <EmptyTitle>暂无待办任务</EmptyTitle>
        <EmptyDescription>当前没有需要处理的审批任务</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">申请标题</TableHead>
          <TableHead className="text-center">类型</TableHead>
          <TableHead className="text-center">申请人</TableHead>
          <TableHead className="text-center">提交时间</TableHead>
          <TableHead className="text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.taskid}>
            <TableCell className="text-center">
              {task.application.title}
            </TableCell>
            <TableCell className="text-center">
              {getTypeLabel(task.application.type)}
            </TableCell>
            <TableCell className="text-center">
              {task.application.applicant.nickname ||
                task.application.applicant.username}
            </TableCell>
            <TableCell className="text-center">
              {new Date(task.createdAt).toLocaleString("zh-CN")}
            </TableCell>
            <TableCell className="text-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => router.push(`/approvals/tasks/${task.taskid}`)}
                title={task.status === "pending" ? "处理任务" : "查看详情"}
              >
                {task.status === "pending" ? (
                  <ClipboardCheck className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
