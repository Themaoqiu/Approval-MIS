"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-clients";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyApplicationsTable } from "@/components/application/MyApplicationsTable";
import { WithdrawDialog } from "@/components/application/WithdrawDialog";

export default function MyApplicationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawApplyId, setWithdrawApplyId] = useState<number | null>(null);

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

  const handleWithdraw = (applyId: number) => {
    setWithdrawApplyId(applyId);
    setWithdrawDialogOpen(true);
  };

  const confirmWithdraw = async () => {
    if (!withdrawApplyId) return;

    try {
      const res = await fetch(`/api/applications/${withdrawApplyId}/withdraw`, {
        method: "POST",
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
    }
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
            <MyApplicationsTable
              applications={applications}
              loading={loading}
              onWithdraw={handleWithdraw}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <WithdrawDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        onConfirm={confirmWithdraw}
      />
    </div>
  );
}
