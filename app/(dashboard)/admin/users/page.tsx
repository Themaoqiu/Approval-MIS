"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserDialog } from "@/components/admin/UserDialog";
import { ChangePasswordDialog } from "@/components/admin/ChangePasswordDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface User {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  role: string;
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [passwordUsername, setPasswordUsername] = useState<string>("");

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

  const handleUserChange = (userId: string, updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? updatedUser : u))
    );
  };

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUserId(null);
    setDialogOpen(true);
  };

  const handleChangePassword = (userId: string, username: string) => {
    setPasswordUserId(userId);
    setPasswordUsername(username);
    setPasswordDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingUserId(null);
  };

  if (loading) {
    return (
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="dark:text-slate-300">加载中...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">用户管理</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleAddUser} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            新增用户
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <UsersTable
          users={users}
          onUserChange={handleUserChange}
          onEdit={handleEdit}
          onChangePassword={handleChangePassword}
          currentUserId={user?.id || ""}
        />
        {users.length === 0 && (
          <p className="text-center text-muted-foreground dark:text-slate-400 py-8">暂无用户</p>
        )}
      </motion.div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        userId={editingUserId}
        departments={departments}
        posts={posts}
        onSuccess={fetchUsers}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        userId={passwordUserId || ""}
        username={passwordUsername}
      />
    </motion.div>
  );
}
