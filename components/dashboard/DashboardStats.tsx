"use client";

import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, FolderOpen, ClipboardList } from "lucide-react";

interface DashboardStatsProps {
  pending: number;
  processed: number;
  total: number;
  pendingApprovals?: number;
  isUser: boolean;
  isApprover: boolean;
  isAdmin: boolean;
  loading: boolean;
}

export function DashboardStats({
  pending,
  processed,
  total,
  pendingApprovals,
  isUser,
  isApprover,
  isAdmin,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              待处理{isUser ? "申请" : ""}
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? "-" : pending}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              已处理{isUser ? "申请" : ""}
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {loading ? "-" : processed}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {isAdmin ? "总申请数" : "我的申请"}
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {loading ? "-" : total}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <FolderOpen className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </Card>
      
      {(isApprover || isAdmin) && (
        <Card className="p-6 md:col-span-3 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                待审批任务
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? "-" : pendingApprovals ?? 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
