"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoleInfoProps {
  isAdmin: boolean;
  isApprover: boolean;
  isUser: boolean;
}

export function RoleInfo({ isAdmin, isApprover, isUser }: RoleInfoProps) {
  return (
    <Card className="mt-6 p-4 bg-muted">
      <p className="text-sm text-muted-foreground">
        当前角色:{" "}
        <Badge variant="default" className="ml-2">
          {isAdmin ? "系统管理员" : isApprover ? "审批人" : "普通员工"}
        </Badge>
      </p>
      {isAdmin && (
        <p className="text-xs text-muted-foreground mt-2">
          您可以查看所有数据、管理用户和审批流程
        </p>
      )}
      {isApprover && (
        <p className="text-xs text-muted-foreground mt-2">
          您可以审批分配给您的任务
        </p>
      )}
      {isUser && (
        <p className="text-xs text-muted-foreground mt-2">
          您可以创建和管理自己的申请
        </p>
      )}
    </Card>
  );
}
