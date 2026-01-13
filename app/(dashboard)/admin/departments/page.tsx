"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [formData, setFormData] = useState({
    parentId: "",
    name: "",
    orderNum: 0,
    leader: "",
    phone: "",
    email: "",
    status: "0",
  });

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
      console.error("获取部门列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        parentId: dept.parentId?.toString() || "",
        name: dept.name,
        orderNum: dept.orderNum,
        leader: dept.leader || "",
        phone: dept.phone || "",
        email: dept.email || "",
        status: dept.status,
      });
    } else {
      setEditingDept(null);
      setFormData({
        parentId: "",
        name: "",
        orderNum: 0,
        leader: "",
        phone: "",
        email: "",
        status: "0",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingDept
        ? `/api/admin/departments/${editingDept.deptId}`
        : "/api/admin/departments";

      const response = await fetch(url, {
        method: editingDept ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      });

      if (response.ok) {
        toast.success(editingDept ? "更新成功" : "创建成功");
        setDialogOpen(false);
        fetchDepartments();
      } else {
        const error = await response.json();
        toast.error(error.error || "操作失败");
      }
    } catch (error) {
      console.error("操作失败:", error);
      toast.error("操作失败");
    }
  };

  const handleDelete = async (deptId: number) => {
    if (!confirm("确定要删除该部门吗？")) return;

    try {
      const response = await fetch(`/api/admin/departments/${deptId}`, {
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
            <Button onClick={() => handleOpenDialog()}>新增部门</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDept ? "编辑部门" : "新增部门"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentId">上级部门</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="无上级部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem
                          key={dept.deptId}
                          value={dept.deptId.toString()}
                          disabled={editingDept?.deptId === dept.deptId}
                        >
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">部门名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leader">负责人</Label>
                  <Input
                    id="leader"
                    value={formData.leader}
                    onChange={(e) =>
                      setFormData({ ...formData, leader: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderNum">显示顺序</Label>
                  <Input
                    id="orderNum"
                    type="number"
                    value={formData.orderNum}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orderNum: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">正常</SelectItem>
                    <SelectItem value="1">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  {editingDept ? "更新" : "创建"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">部门名称</TableHead>
              <TableHead className="text-center">上级部门</TableHead>
              <TableHead className="text-center">负责人</TableHead>
              <TableHead className="text-center">联系电话</TableHead>
              <TableHead className="text-center">邮箱</TableHead>
              <TableHead className="text-center">显示顺序</TableHead>
              <TableHead className="text-center">状态</TableHead>
              <TableHead className="text-center">用户数</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.deptId}>
                <TableCell className="text-center font-medium">
                  {dept.name}
                </TableCell>
                <TableCell className="text-center">
                  {dept.parent?.name || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {dept.leader || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {dept.phone || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {dept.email || "-"}
                </TableCell>
                <TableCell className="text-center">{dept.orderNum}</TableCell>
                <TableCell className="text-center">
                  {dept.status === "0" ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-300"
                    >
                      正常
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-300"
                    >
                      停用
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {dept._count.users}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(dept)}
                    >
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(dept.deptId)}
                      disabled={dept._count.users > 0 || dept._count.children > 0}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
