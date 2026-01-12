"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-clients";
import { useEffect, useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DashboardStats {
  pending: number;
  processed: number;
  total: number;
  pendingApprovals?: number;
  userRole: string;
  recentApplications: Array<{
    id: number;
    type: string;
    title: string;
    status: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isUser, isApprover, isAdmin } = usePermissions();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "待审批";
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      default:
        return status;
    }
  };

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user)
    return <p className="text-center mt-8 text-white">Redirecting...</p>;

  const { user } = session;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">仪表板</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            onClick={() => signOut()}
            variant="destructive"
          >
            登出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            待处理{isUser ? "申请" : ""}
          </h3>
          <p className="text-3xl font-bold">
            {loading ? "-" : stats?.pending ?? 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            已处理{isUser ? "申请" : ""}
          </h3>
          <p className="text-3xl font-bold">
            {loading ? "-" : stats?.processed ?? 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {isAdmin ? "总申请数" : "我的申请"}
          </h3>
          <p className="text-3xl font-bold">
            {loading ? "-" : stats?.total ?? 0}
          </p>
        </Card>
        {(isApprover || isAdmin) && (
          <Card className="p-6 md:col-span-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              待审批任务
            </h3>
            <p className="text-3xl font-bold">
              {loading ? "-" : stats?.pendingApprovals ?? 0}
            </p>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isAdmin ? "最近的申请（全部）" : "最近的申请"}
        </h2>
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground">加载中...</p>
          ) : stats?.recentApplications &&
            stats.recentApplications.length > 0 ? (
            stats.recentApplications.map((app, index) => (
              <div key={index}>
                <div className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{app.title}</p>
                    <p className="text-xs text-muted-foreground">{app.type}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === "pending"
                        ? "secondary"
                        : app.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {getStatusLabel(app.status)}
                  </Badge>
                </div>
                {index < stats.recentApplications.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">暂无申请</p>
          )}
        </div>
      </Card>

      {/* 角色说明 */}
      <Card className="mt-6 p-4 bg-muted">
        <p className="text-sm text-muted-foreground">
          当前角色:{" "}
          <Badge variant="default" className="ml-2">
            {isAdmin ? "系统管理员" : isApprover ? "审批人" : "普通员工"}
          </Badge>
        </p>
        {isAdmin && (
          <p className="text-xs text-muted-foreground mt-2">
            您可以查看所有数据、管理用户和审批流程
          </p>
        )}
        {isApprover && (
          <p className="text-xs text-muted-foreground mt-2">
            您可以审批分配给您的任务
          </p>
        )}
        {isUser && (
          <p className="text-xs text-muted-foreground mt-2">
            您可以创建和管理自己的申请
          </p>
        )}
      </Card>
    </div>
  );
}
