"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
}

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  departments: Department[];
  onSuccess: () => void;
}

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
  departments,
  onSuccess,
}: DepartmentDialogProps) {
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
    if (department) {
      setFormData({
        parentId: department.parentId?.toString() || "",
        name: department.name,
        orderNum: department.orderNum,
        leader: department.leader || "",
        phone: department.phone || "",
        email: department.email || "",
        status: department.status,
      });
    } else {
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
  }, [department, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = department
        ? `/api/admin/departments/${department.deptId}`
        : "/api/admin/departments";

      const response = await fetch(url, {
        method: department ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      });

      if (response.ok) {
        toast.success(department ? "更新成功" : "创建成功");
        onOpenChange(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "操作失败");
      }
    } catch (error) {
      console.error("操作失败:", error);
      toast.error("操作失败");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {department ? "编辑部门" : "新增部门"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="parentId">上级部门</FieldLabel>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="无上级部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem
                        key={dept.deptId}
                        value={dept.deptId.toString()}
                        disabled={department?.deptId === dept.deptId}
                      >
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">部门名称 *</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="leader">负责人</FieldLabel>
                <Input
                  id="leader"
                  value={formData.leader}
                  onChange={(e) =>
                    setFormData({ ...formData, leader: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">联系电话</FieldLabel>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  maxLength={11}
                />
                <FieldDescription>11位手机号码</FieldDescription>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="orderNum">显示顺序</FieldLabel>
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
                <FieldDescription>数字越小越靠前</FieldDescription>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="status">状态</FieldLabel>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">正常</SelectItem>
                  <SelectItem value="1">停用</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field orientation="horizontal">
              <Button type="submit">{department ? "更新" : "创建"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
