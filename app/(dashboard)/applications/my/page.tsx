"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-clients";
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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";

export default function MyApplicationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawApplyId, setWithdrawApplyId] = useState<number | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchApplications = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/my?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(activeTab);
  }, [activeTab]);

  const handleWithdraw = async (applyId: number) => {
    setWithdrawApplyId(applyId);
    setWithdrawDialogOpen(true);
  };

  const confirmWithdraw = async () => {
    if (!withdrawApplyId) return;

    setWithdrawing(true);
    try {
      const res = await fetch(`/api/applications/${withdrawApplyId}/withdraw`, {
        method: "POST"
      });

      if (res.ok) {
        toast.success("申请已撤回");
        setWithdrawDialogOpen(false);
        setWithdrawApplyId(null);
        fetchApplications(activeTab);
      } else {
        const error = await res.json();
        toast.error(error.error || "撤回失败");
      }
    } catch (error) {
      toast.error("撤回失败");
    } finally {
      setWithdrawing(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: "请假",
      reimbursement: "报销"
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">我的申请</h1>
        <Button onClick={() => router.push("/applications/new")}>
          新建申请
        </Button>
      </div>

      <Card className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="pending">待审批</TabsTrigger>
              <TabsTrigger value="approved">已通过</TabsTrigger>
              <TabsTrigger value="rejected">已拒绝</TabsTrigger>
              <TabsTrigger value="withdrawn">已撤回</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
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
                                onClick={() => handleWithdraw(app.applyId)}
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
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>撤回申请</DialogTitle>
            <DialogDescription>
              确定要撤回此申请吗？撤回后申请将无法继续审批。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
              disabled={withdrawing}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmWithdraw}
              disabled={withdrawing}
            >
              {withdrawing ? "撤回中..." : "确认撤回"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
