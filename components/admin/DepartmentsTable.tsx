"use client";

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
import { Pencil, Trash2 } from "lucide-react";

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

interface DepartmentsTableProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (deptId: number) => void;
}

export function DepartmentsTable({
  departments,
  onEdit,
  onDelete,
}: DepartmentsTableProps) {
  return (
    <Card className="p-0 border">
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
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(dept)}
                    title="编辑"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(dept.deptId)}
                    disabled={
                      dept._count.users > 0 || dept._count.children > 0
                    }
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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
