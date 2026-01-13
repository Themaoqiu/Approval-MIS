"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: "请假",
      reimbursement: "报销"
    };
    return labels[type] || type;
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">所有申请（只读）</h1>

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
                    <TableHead className="text-center">申请人</TableHead>
                    <TableHead className="text-center">状态</TableHead>
                    <TableHead className="text-center">创建时间</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        暂无申请
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.applyId}>
                        <TableCell className="text-center">{app.title}</TableCell>
                        <TableCell className="text-center">{getTypeLabel(app.type)}</TableCell>
                        <TableCell className="text-center">
                          {app.applicant.nickname || app.applicant.username}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <ApplicationStatusBadge status={app.status} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(app.createdAt).toLocaleDateString("zh-CN")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/applications/${app.applyId}`)}
                          >
                            查看
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
