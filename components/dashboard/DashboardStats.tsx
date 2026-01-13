"use client";

import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  pending: number;
  processed: number;
  total: number;
  pendingApprovals?: number;
  isUser: boolean;
  isApprover: boolean;
  isAdmin: boolean;
  loading: boolean;
}

export function DashboardStats({
  pending,
  processed,
  total,
  pendingApprovals,
  isUser,
  isApprover,
  isAdmin,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-muted-foreground">
          待处理{isUser ? "申请" : ""}
        </h3>
        <p className="text-3xl font-bold">
          {loading ? "-" : pending}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-medium text-muted-foreground">
          已处理{isUser ? "申请" : ""}
        </h3>
        <p className="text-3xl font-bold">
          {loading ? "-" : processed}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-medium text-muted-foreground">
          {isAdmin ? "总申请数" : "我的申请"}
        </h3>
        <p className="text-3xl font-bold">
          {loading ? "-" : total}
        </p>
      </Card>
      {(isApprover || isAdmin) && (
        <Card className="p-6 md:col-span-3">
          <h3 className="text-lg font-medium text-muted-foreground">
            待审批任务
          </h3>
          <p className="text-3xl font-bold">
            {loading ? "-" : pendingApprovals ?? 0}
          </p>
        </Card>
      )}
    </div>
  );
}
