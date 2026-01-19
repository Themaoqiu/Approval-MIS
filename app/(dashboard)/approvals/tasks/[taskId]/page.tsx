"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";
import { ApprovalTimeline } from "@/components/application/ApprovalTimeline";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function ApprovalTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processAction, setProcessAction] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/approvals/tasks/${taskId}`);
      if (res.ok) {
        const task = await res.json();
        setTask(task);
      } else if (res.status === 404) {
        setError("任务不存在");
      } else if (res.status === 403) {
        setError("无权查看此任务");
      } else {
        setError("加载失败");
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (action: "approve" | "reject") => {
    if (!comment.trim()) {
      toast.error("请填写审批意见");
      return;
    }

    setProcessAction(action);
    setProcessDialogOpen(true);
  };

  const confirmProcess = async () => {
    if (!processAction) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/approvals/tasks/${taskId}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: processAction, comment })
      });

      if (res.ok) {
        toast.success("审批成功");
        setProcessDialogOpen(false);
        setProcessAction(null);
        router.push("/approvals/tasks");
      } else {
        const error = await res.json();
        toast.error(error.error || "审批失败");
      }
    } catch (error) {
      toast.error("审批失败");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="text-center py-8">加载中...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-destructive">{error}</p>;
  }

  if (!task) {
    return <p className="text-center py-8">任务不存在或已处理</p>;
  }

  const app = task.application;
  const content = app.content;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">审批处理</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">基本信息</h2>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">申请标题</p>
              <p className="font-medium">{app.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">申请状态</p>
              <ApplicationStatusBadge status={app.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">申请人</p>
              <p className="font-medium">
                {app.applicant.nickname || app.applicant.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">创建时间</p>
              <p className="font-medium">
                {new Date(app.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">申请内容</h2>
          <Separator />
          {app.type === "leave" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">请假类型</p>
                <p className="font-medium">{content.leaveType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">开始日期</p>
                  <p className="font-medium">
                    {format(new Date(content.startDate), "PPP", { locale: zhCN })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">结束日期</p>
                  <p className="font-medium">
                    {format(new Date(content.endDate), "PPP", { locale: zhCN })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">请假天数</p>
                <p className="font-medium">{content.days} 天</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">请假事由</p>
                <p className="font-medium whitespace-pre-wrap">{content.reason}</p>
              </div>
            </div>
          )}

          {app.type === "reimbursement" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">费用类型</p>
                <p className="font-medium">{content.expenseType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">报销金额</p>
                <p className="font-medium text-lg">¥ {content.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">报销事由</p>
                <p className="font-medium whitespace-pre-wrap">{content.reason}</p>
              </div>
            </div>
          )}
        </Card>

        {app.tasks.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold">审批历史</h2>
            <Separator />
            <ApprovalTimeline tasks={app.tasks} />
          </Card>
        )}

        {task.status === "pending" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold">审批操作</h2>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>审批意见</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="请填写审批意见"
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleProcess("approve")}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white"
                >
                  同意
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleProcess("reject")}
                  disabled={processing}
                >
                  拒绝
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认审批</DialogTitle>
            <DialogDescription>
              确定要{processAction === "approve" ? "同意" : "拒绝"}此申请吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessDialogOpen(false)}
              disabled={processing}
            >
              取消
            </Button>
            <Button
              variant={processAction === "approve" ? "default" : "destructive"}
              onClick={confirmProcess}
              disabled={processing}
              className={processAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {processing ? "处理中..." : processAction === "approve" ? "同意" : "拒绝"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
