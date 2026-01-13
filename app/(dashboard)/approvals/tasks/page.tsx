"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { ApplicationStatusBadge } from "@/components/application/ApplicationStatusBadge";

export default function ApprovalTasksPage() {
  const router = useRouter();
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: "请假",
      reimbursement: "报销"
    };
    return labels[type] || type;
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
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">加载中...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">申请标题</TableHead>
                    <TableHead className="text-center">类型</TableHead>
                    <TableHead className="text-center">申请人</TableHead>
                    <TableHead className="text-center">提交时间</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        暂无任务
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task.taskid}>
                        <TableCell className="text-center">{task.application.title}</TableCell>
                        <TableCell className="text-center">
                          {getTypeLabel(task.application.type)}
                        </TableCell>
                        <TableCell className="text-center">
                          {task.application.applicant.nickname || task.application.applicant.username}
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(task.createdAt).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/approvals/tasks/${task.taskid}`)}
                          >
                            {task.status === "pending" ? "处理" : "查看"}
                          </Button>
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
    </div>
  );
}
