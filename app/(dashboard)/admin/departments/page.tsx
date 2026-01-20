"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DepartmentsTable } from "@/components/admin/DepartmentsTable";
import { DepartmentDialog } from "@/components/admin/DepartmentDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Plus } from "lucide-react";

interface Department {
  deptId: number;
  parentId: number | null;
  name: string;
  orderNum: number;
  leader: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  parent: { name: string } | null;
  _count: {
    users: number;
    children: number;
  };
}

export default function DepartmentsPage() {
  const router = useRouter();
  const { isAdmin, user } = usePermissions();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDeptId, setDeletingDeptId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchDepartments();
  }, [user, isAdmin, router]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/admin/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      toast.error("获取部门列表失败");
      console.error("获取部门列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (dept?: Department) => {
    setEditingDept(dept || null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (deptId: number) => {
    setDeletingDeptId(deptId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingDeptId === null) return;

    try {
      const response = await fetch(`/api/admin/departments/${deletingDeptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("删除成功");
        fetchDepartments();
      } else {
        const error = await response.json();
        toast.error(error.error || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">部门管理</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              新增部门
            </Button>
          </DialogTrigger>
          <DepartmentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            department={editingDept}
            departments={departments}
            onSuccess={fetchDepartments}
          />
        </Dialog>
      </div>

      <DepartmentsTable
        departments={departments}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="删除部门"
        description="确定要删除此部门吗？删除后该部门的数据将无法恢复。"
        resourceName="部门"
        onConfirm={handleDelete}
      />
    </div>
  );
}
