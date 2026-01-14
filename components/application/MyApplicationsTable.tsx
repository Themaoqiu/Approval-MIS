"use client";

import { useRouter } from "next/navigation";
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

  return loading ? (
    <p className="text-center py-8 text-muted-foreground">加载中...</p>
  ) : applications.length === 0 ? (
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
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">标题</TableHead>
          <TableHead className="text-center">类型</TableHead>
          <TableHead className="text-center">状态</TableHead>
          <TableHead className="text-center">创建时间</TableHead>
          <TableHead className="text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.applyId}>
            <TableCell className="text-center">{app.title}</TableCell>
            <TableCell className="text-center">{getTypeLabel(app.type)}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <ApplicationStatusBadge status={app.status} />
              </div>
            </TableCell>
            <TableCell className="text-center">
              {new Date(app.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex gap-2 justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(`/applications/${app.applyId}`)}
                  title="查看详情"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onWithdraw(app.applyId)}
                  disabled={!(app.status === "pending" && app.currentStep === 0)}
                  title="撤回申请"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
