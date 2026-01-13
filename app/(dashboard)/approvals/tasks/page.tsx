"use client";

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
    <div>
      <h1 className="text-3xl font-bold mb-6">审批</h1>
      <Card className="p-0" suppressHydrationWarning>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList suppressHydrationWarning>
              <TabsTrigger value="pending">待处理</TabsTrigger>
              <TabsTrigger value="approved">已同意</TabsTrigger>
              <TabsTrigger value="rejected">已拒绝</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <ApprovalTasksTable tasks={tasks} loading={loading} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
