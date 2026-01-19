"use client";

import { motion } from "framer-motion";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-0 border dark:border-slate-700 dark:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/30">
              <TableHead className="text-center dark:text-slate-300">部门名称</TableHead>
              <TableHead className="text-center dark:text-slate-300">上级部门</TableHead>
              <TableHead className="text-center dark:text-slate-300">负责人</TableHead>
              <TableHead className="text-center dark:text-slate-300">联系电话</TableHead>
              <TableHead className="text-center dark:text-slate-300">邮箱</TableHead>
              <TableHead className="text-center dark:text-slate-300">显示顺序</TableHead>
              <TableHead className="text-center dark:text-slate-300">状态</TableHead>
              <TableHead className="text-center dark:text-slate-300">用户数</TableHead>
              <TableHead className="text-center dark:text-slate-300">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept, index) => (
              <motion.tr
                key={dept.deptId}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
              >
                <TableCell className="text-center font-medium dark:text-slate-300">
                  {dept.name}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {dept.parent?.name || "-"}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {dept.leader || "-"}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {dept.phone || "-"}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {dept.email || "-"}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">{dept.orderNum}</TableCell>
                <TableCell className="text-center">
                  {dept.status === "0" ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                    >
                      正常
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                    >
                      停用
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center dark:text-slate-300">
                  {dept._count.users}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(dept)}
                        title="编辑"
                        className="dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(dept.deptId)}
                        disabled={
                          dept._count.users > 0 || dept._count.children > 0
                        }
                        title="删除"
                        className="dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
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
