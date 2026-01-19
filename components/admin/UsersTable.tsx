"use client";

import { motion } from "framer-motion";
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
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-clients";
import { Pencil, Ban, CheckCircle, KeyRound } from "lucide-react";

interface User {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  onUserChange: (userId: string, updatedUser: User) => void;
  onEdit: (userId: string) => void;
  onChangePassword: (userId: string, username: string) => void;
  currentUserId: string;
}

export function UsersTable({
  users,
  onUserChange,
  onEdit,
  onChangePassword,
  currentUserId,
}: UsersTableProps) {

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      if (banned) {
        await authClient.admin.unbanUser({ userId });
      } else {
        await authClient.admin.banUser({
          userId,
          banReason: "管理员操作",
        });
      }
      
      const updatedUser = users.find((u) => u.id === userId);
      if (updatedUser) {
        onUserChange(userId, { 
          ...updatedUser, 
          banned: !banned,
        });
        toast.success("操作成功");
      }
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "approver":
        return "secondary";
      default:
        return "outline";
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <Card className="p-0 border dark:border-slate-700 dark:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/30">
              <TableHead className="text-center dark:text-slate-300">用户名</TableHead>
              <TableHead className="text-center dark:text-slate-300">昵称</TableHead>
              <TableHead className="text-center dark:text-slate-300">邮箱</TableHead>
              <TableHead className="text-center dark:text-slate-300">角色</TableHead>
              <TableHead className="text-center dark:text-slate-300">状态</TableHead>
              <TableHead className="text-center dark:text-slate-300">创建时间</TableHead>
              <TableHead className="text-center dark:text-slate-300">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u, index) => (
              <motion.tr
                key={u.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
              >
                <TableCell className="text-center dark:text-slate-300">{u.name || "-"}</TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {u.nickname || "-"}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">{u.email}</TableCell>
                <TableCell className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Badge variant={getRoleBadgeVariant(u.role) as "default" | "secondary" | "outline"}>
                      {getRoleLabel(u.role)}
                    </Badge>
                  </motion.div>
                </TableCell>
                <TableCell className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {u.banned ? (
                      <Badge variant="destructive" className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                        已停用
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                        正常
                      </Badge>
                    )}
                  </motion.div>
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => onEdit(u.id)}
                        variant="ghost"
                        size="icon"
                        title="编辑"
                        className="dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => onChangePassword(u.id, u.name)}
                        variant="ghost"
                        size="icon"
                        disabled={u.id === currentUserId}
                        title="修改密码"
                        className="dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleBanUser(u.id, u.banned)}
                        variant="ghost"
                        size="icon"
                        disabled={u.id === currentUserId}
                        title={u.banned ? "启用" : "禁用"}
                        className="dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        {u.banned ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
