"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { authClient } from "@/lib/auth-clients";

interface User {
  id: string;
  username: string;
  name: string | null;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { isAdmin, user } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchUsers();
  }, [user, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit: 100,
        },
      });
      if (result.data) {
        setUsers(result.data.users as User[]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await authClient.admin.setRole({
        userId,
        role: newRole as "user" | "approver" | "admin",
      });

      await fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("更新角色失败");
    }
  };

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

      await fetchUsers();
    } catch (error) {
      console.error("Failed to ban/unban user:", error);
      alert("操作失败");
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">用户管理</h1>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">用户名</th>
                <th className="text-left p-4 font-medium">姓名</th>
                <th className="text-left p-4 font-medium">邮箱</th>
                <th className="text-left p-4 font-medium">角色</th>
                <th className="text-left p-4 font-medium">状态</th>
                <th className="text-left p-4 font-medium">创建时间</th>
                <th className="text-left p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">{u.name || "-"}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 border rounded bg-background"
                      disabled={u.id === user?.id} // 不能修改自己的角色
                    >
                      <option value="user">普通员工</option>
                      <option value="approver">审批人</option>
                      <option value="admin">系统管理员</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {u.banned ? (
                      <span className="text-red-600 text-sm">已禁用</span>
                    ) : (
                      <span className="text-green-600 text-sm">正常</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="p-4">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleBanUser(u.id, u.banned)}
                        className={`px-3 py-1 text-sm rounded ${
                          u.banned
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {u.banned ? "启用" : "禁用"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <p className="text-center text-muted-foreground py-8">暂无用户</p>
      )}
    </div>
  );
}
