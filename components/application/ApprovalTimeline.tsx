import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Task {
  step: number;
  status: string;
  approver: { username: string; nickname: string | null };
  comment: string | null;
  processedAt: Date | null;
  createdAt: Date;
}

export function ApprovalTimeline({ tasks }: { tasks: Task[] }) {
  const getIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === "rejected") return <XCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved") return <Badge>已同意</Badge>;
    if (status === "rejected") return <Badge variant="destructive">已拒绝</Badge>;
    return <Badge variant="secondary">待处理</Badge>;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={index}>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              {getIcon(task.status)}
              {index < tasks.length - 1 && (
                <div className="w-0.5 h-16 bg-border my-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {task.approver.nickname || task.approver.username}
                </span>
                {getStatusBadge(task.status)}
              </div>
              {task.comment && (
                <p className="text-sm text-muted-foreground mt-1">{task.comment}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {task.processedAt
                  ? new Date(task.processedAt).toLocaleString("zh-CN")
                  : `创建于 ${new Date(task.createdAt).toLocaleString("zh-CN")}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
