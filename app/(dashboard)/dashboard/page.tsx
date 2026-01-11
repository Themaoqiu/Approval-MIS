"use client"

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-clients";
import { useEffect, useState } from "react";

interface DashboardStats {
  pending: number;
  processed: number;
  total: number;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

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
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            登出
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            待处理
          </h3>
          <p className="text-3xl font-bold">{loading ? "-" : stats?.pending ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            已处理
          </h3>
          <p className="text-3xl font-bold">{loading ? "-" : stats?.processed ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            我的申请
          </h3>
          <p className="text-3xl font-bold">{loading ? "-" : stats?.total ?? 0}</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">最近的申请</h2>
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground">加载中...</p>
          ) : stats?.recentApplications && stats.recentApplications.length > 0 ? (
            stats.recentApplications.map((app, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{app.title}</p>
                  <p className="text-xs text-muted-foreground">{app.type}</p>
                </div>
                <span className={`${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">暂无申请</p>
          )}
        </div>
      </div>
    </div>
  )
}
