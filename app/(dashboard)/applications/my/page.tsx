"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-clients";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyApplicationsTable } from "@/components/application/MyApplicationsTable";
import { WithdrawDialog } from "@/components/application/WithdrawDialog";
import { Plus } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">我的申请</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => router.push("/applications/new")} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            新建申请
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="p-0 dark:bg-card dark:border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="dark:bg-slate-800">
                <TabsTrigger value="all" className="dark:text-slate-300 dark:data-[state=active]:text-white">全部</TabsTrigger>
                <TabsTrigger value="pending" className="dark:text-slate-300 dark:data-[state=active]:text-white">待审批</TabsTrigger>
                <TabsTrigger value="approved" className="dark:text-slate-300 dark:data-[state=active]:text-white">已通过</TabsTrigger>
                <TabsTrigger value="rejected" className="dark:text-slate-300 dark:data-[state=active]:text-white">已拒绝</TabsTrigger>
                <TabsTrigger value="withdrawn" className="dark:text-slate-300 dark:data-[state=active]:text-white">已撤回</TabsTrigger>
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
      </motion.div>

      <WithdrawDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        onConfirm={confirmWithdraw}
      />
    </motion.div>
  );
}
