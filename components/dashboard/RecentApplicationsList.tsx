"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Application {
  id: number;
  type: string;
  title: string;
  status: string;
  date: string;
}

interface RecentApplicationsListProps {
  applications: Application[];
  loading: boolean;
  isAdmin: boolean;
}

export function RecentApplicationsList({
  applications,
  loading,
  isAdmin,
}: RecentApplicationsListProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "待审批";
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      case "withdrawn":
        return "已撤回";
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isAdmin ? "最近的申请（全部）" : "最近的申请"}
      </h2>
      <div className="space-y-2">
        {loading ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : applications && applications.length > 0 ? (
          applications.map((app, index) => (
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
              {index < applications.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">暂无申请</p>
        )}
      </div>
    </Card>
  );
}
