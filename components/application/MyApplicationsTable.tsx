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
        {applications.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              暂无申请
            </TableCell>
          </TableRow>
        ) : (
          applications.map((app) => (
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
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/applications/${app.applyId}`)}
                  >
                    查看
                  </Button>
                  {app.status === "pending" && app.currentStep === 0 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onWithdraw(app.applyId)}
                    >
                      撤回
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
