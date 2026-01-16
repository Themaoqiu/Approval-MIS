"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-clients";
import { Pencil, Ban, CheckCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  role: string;
  banned: boolean;
  status: string;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  onRefresh: () => Promise<void>;
  onEdit: (userId: string) => void;
  currentUserId: string;
}

export function UsersTable({
  users,
  onRefresh,
  onEdit,
  currentUserId,
}: UsersTableProps) {

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await authClient.admin.setRole({
        userId,
        role: newRole as "user" | "approver" | "admin",
      });
      await onRefresh();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("更新角色失败");
    }
  };

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      if (banned) {
        await authClient.admin.banUser({
          userId,
          banReason: "管理员操作",
        });
      } else {
        await authClient.admin.unbanUser({ userId });
      }
      await onRefresh();
    } catch (error) {
      console.error("Failed to ban/unban user:", error);
      toast.error("操作失败");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "系统管理员";
      case "approver":
        return "审批人";
      case "user":
        return "普通员工";
      default:
        return role;
    }
  };

  return (
    <Card className="p-0 border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">用户名</TableHead>
            <TableHead className="text-center">昵称</TableHead>
            <TableHead className="text-center">邮箱</TableHead>
            <TableHead className="text-center">角色</TableHead>
            <TableHead className="text-center">状态</TableHead>
            <TableHead className="text-center">创建时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="text-center">{u.name || "-"}</TableCell>
              <TableCell className="text-center">
                {u.nickname || "-"}
              </TableCell>
              <TableCell className="text-center">{u.email}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Select
                    value={u.role}
                    onValueChange={(newRole) =>
                      handleRoleChange(u.id, newRole)
                    }
                    disabled={u.id === currentUserId}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">普通员工</SelectItem>
                      <SelectItem value="approver">审批人</SelectItem>
                      <SelectItem value="admin">系统管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {u.status === "1" ? (
                  <Badge variant="destructive" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    已停用
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    正常
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                {new Date(u.createdAt).toLocaleDateString("zh-CN")}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => onEdit(u.id)}
                    variant="ghost"
                    size="icon"
                    title="编辑"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleBanUser(u.id, u.banned)}
                    variant="ghost"
                    size="icon"
                    disabled={u.id === currentUserId}
                    title={u.banned ? "启用" : "禁用"}
                  >
                    {u.banned ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Ban className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
