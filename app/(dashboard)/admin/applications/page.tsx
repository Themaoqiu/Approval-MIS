"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminApplicationsTable } from "@/components/admin/AdminApplicationsTable";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const { isAdmin } = usePermissions();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchApplications(activeTab);
  }, [activeTab, isAdmin]);

  const fetchApplications = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${status}`);
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

  if (!isAdmin) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        所有申请（只读）
      </motion.h1>

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
              <AdminApplicationsTable
                applications={applications}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  );
}
