"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, FileEdit } from "lucide-react";
import { toast } from "sonner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFormId, setDeletingFormId] = useState<number | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/forms");
    const data = await res.json();
    setForms(data.forms);
    setLoading(false);
  };

  const handleDeleteClick = (id: number, isSystem: boolean) => {
    if (isSystem) {
      toast.error("系统表单不能删除");
      return;
    }
    setDeletingFormId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingFormId === null) return;

    const res = await fetch(`/api/admin/forms/${deletingFormId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("删除成功");
      fetchForms();
    } else {
      toast.error("删除失败");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">表单设计</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button onClick={() => router.push("/admin/forms/new")}>
            <Plus className="h-4 w-4 mr-2" />
            新建表单
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="p-0">
          <CardContent>
            {loading ? (
              <motion.div
                className="flex items-center justify-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-lg text-muted-foreground dark:text-slate-400">加载中...</div>
              </motion.div>
            ) : forms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileEdit className="h-8 w-8" />
                    </EmptyMedia>
                    <EmptyTitle>暂无表单模板</EmptyTitle>
                    <EmptyDescription>还没有创建任何表单模板，点击下方按钮开始创建</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={() => router.push("/admin/forms/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      创建表单
                    </Button>
                  </EmptyContent>
                </Empty>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/50">
                      <TableHead className="text-center dark:text-slate-300">表单名称</TableHead>
                      <TableHead className="text-center dark:text-slate-300">编码</TableHead>
                      <TableHead className="text-center dark:text-slate-300">分类</TableHead>
                      <TableHead className="text-center dark:text-slate-300">版本</TableHead>
                      <TableHead className="text-center dark:text-slate-300">状态</TableHead>
                      <TableHead className="text-center dark:text-slate-300">创建时间</TableHead>
                      <TableHead className="text-center dark:text-slate-300">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms.map((form, index) => (
                      <motion.tr
                        key={form.formId}
                        custom={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.03, duration: 0.3 }}
                        className="dark:border-slate-700 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="text-center font-medium dark:text-slate-200">{form.name}</TableCell>
                        <TableCell className="text-center dark:text-slate-300">
                          <code className="text-sm dark:bg-slate-900 dark:text-slate-100 bg-slate-100 px-2 py-1 rounded">{form.code}</code>
                        </TableCell>
                        <TableCell className="text-center dark:text-slate-300">
                          {form.category === "leave"
                            ? "请假"
                            : form.category === "expense"
                            ? "报销"
                            : "自定义"}
                        </TableCell>
                        <TableCell className="text-center dark:text-slate-300">v{form.version}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={form.isActive ? "default" : "secondary"}>
                            {form.isActive ? "启用" : "停用"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center dark:text-slate-300">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/forms/${form.formId}/edit`)}
                                title="编辑"
                                className="dark:text-slate-300 dark:hover:bg-slate-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(form.formId, form.isSystem)}
                                disabled={form.isSystem}
                                title="删除"
                                className="dark:text-red-500 dark:hover:bg-slate-700"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="删除表单"
        resourceName="表单"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
