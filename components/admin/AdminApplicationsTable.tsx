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
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";
import { Eye, FolderOpen } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface Application {
  applyId: number;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  applicant: {
    username: string;
    nickname: string | null;
  };
}

interface AdminApplicationsTableProps {
  applications: Application[];
  loading: boolean;
}

export function AdminApplicationsTable({
  applications,
  loading,
}: AdminApplicationsTableProps) {
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
          <FolderOpen className="h-8 w-8" />
        </EmptyMedia>
        <EmptyTitle>暂无申请数据</EmptyTitle>
        <EmptyDescription>系统中还没有任何申请记录</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">标题</TableHead>
          <TableHead className="text-center">类型</TableHead>
          <TableHead className="text-center">申请人</TableHead>
          <TableHead className="text-center">状态</TableHead>
          <TableHead className="text-center">创建时间</TableHead>
          <TableHead className="text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.applyId}>
            <TableCell className="text-center">
              {app.title}
            </TableCell>
            <TableCell className="text-center">{getTypeLabel(app.type)}</TableCell>
            <TableCell className="text-center">
              {app.applicant.nickname || app.applicant.username}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <ApplicationStatusBadge status={app.status} />
              </div>
            </TableCell>
            <TableCell className="text-center">
              {new Date(app.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
            <TableCell className="text-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => router.push(`/applications/${app.applyId}`)}
                title="查看详情"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
