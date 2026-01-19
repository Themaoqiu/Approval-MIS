"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalTasksTable } from "@/components/approval/ApprovalTasksTable";

export default function ApprovalTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchTasks(activeTab);
  }, [activeTab]);

  const fetchTasks = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/approvals/tasks?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

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
        审批
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="p-0 dark:bg-card dark:border-slate-700" suppressHydrationWarning>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="dark:bg-slate-800" suppressHydrationWarning>
                <TabsTrigger value="pending" className="dark:text-slate-300 dark:data-[state=active]:text-white">待处理</TabsTrigger>
                <TabsTrigger value="approved" className="dark:text-slate-300 dark:data-[state=active]:text-white">已同意</TabsTrigger>
                <TabsTrigger value="rejected" className="dark:text-slate-300 dark:data-[state=active]:text-white">已拒绝</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <ApprovalTasksTable tasks={tasks} loading={loading} />
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  );
}
