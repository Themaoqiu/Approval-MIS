"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserDialog } from "@/components/admin/UserDialog";

interface User {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  role: string;
  status: string;
  banned: boolean;
  createdAt: string;
}

interface Department {
  deptId: number;
  name: string;
  status: string;
}

interface Post {
  postId: number;
  name: string;
  status: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { isAdmin, user } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

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
    fetchDepartmentsAndPosts();
  }, [user, isAdmin, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentsAndPosts = async () => {
    try {
      const [deptsRes, postsRes] = await Promise.all([
        fetch("/api/admin/departments"),
        fetch("/api/admin/posts"),
      ]);

      if (deptsRes.ok) {
        const data = await deptsRes.json();
        setDepartments(data);
      }

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("获取部门和岗位失败:", error);
    }
  };

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingUserId(null);
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
      <UsersTable
        users={users}
        onRefresh={fetchUsers}
        onEdit={handleEdit}
        currentUserId={user?.id || ""}
      />
      {users.length === 0 && (
        <p className="text-center text-muted-foreground py-8">暂无用户</p>
      )}

      <UserDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        userId={editingUserId}
        departments={departments}
        posts={posts}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
