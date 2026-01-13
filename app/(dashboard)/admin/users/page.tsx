"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { authClient } from "@/lib/auth-clients";
import { UsersTable } from "@/components/admin/UsersTable";

interface User {
  id: string;
  name: string;
  nickname: string | null;
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
      <UsersTable users={users} onRefresh={fetchUsers} currentUserId={user?.id || ""} />
      {users.length === 0 && (
        <p className="text-center text-muted-foreground py-8">暂无用户</p>
      )}
    </div>
  );
}
