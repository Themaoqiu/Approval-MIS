"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";
import { ApprovalTimeline } from "@/components/application/ApprovalTimeline";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${id}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
      } else if (res.status === 403) {
        toast.error("无权查看此申请");
        router.back();
      }
    } catch (error) {
      console.error("Failed to fetch application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("确定要撤回此申请吗？")) return;

    try {
      const res = await fetch(`/api/applications/${id}/withdraw`, {
        method: "POST"
      });

      if (res.ok) {
        toast.success("申请已撤回");
        fetchApplication();
      } else {
        const error = await res.json();
        toast.error(error.error || "撤回失败");
      }
    } catch (error) {
      toast.error("撤回失败");
    }
  };

  if (loading) {
    return <p className="text-center py-8">加载中...</p>;
  }

  if (!application) {
    return <p className="text-center py-8">申请不存在</p>;
  }

  const content = application.content;
  const canWithdraw = application.status === "pending" && application.currentStep === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">申请详情</h1>
        <div className="flex gap-2">
          {canWithdraw && (
            <Button variant="destructive" onClick={handleWithdraw}>
              撤回申请
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            返回
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">申请标题</p>
              <p className="font-medium">{application.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">申请状态</p>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">申请人</p>
              <p className="font-medium">
                {application.applicant.nickname || application.applicant.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">创建时间</p>
              <p className="font-medium">
                {new Date(application.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">申请内容</h2>
          {application.type === "leave" && (
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

          {application.type === "reimbursement" && (
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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">审批历史</h2>
          {application.tasks.length > 0 ? (
            <ApprovalTimeline tasks={application.tasks} />
          ) : (
            <p className="text-muted-foreground">暂无审批记录</p>
          )}
        </Card>
      </div>
    </div>
  );
}
