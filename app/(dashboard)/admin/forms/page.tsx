"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number, isSystem: boolean) => {
    if (isSystem) {
      toast.error("系统表单不能删除");
      return;
    }

    if (!confirm("确定要删除此表单吗?")) return;

    const res = await fetch(`/api/admin/forms/${id}`, {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">表单管理</h1>
        <Button onClick={() => router.push("/admin/forms/new")}>
          <Plus className="h-4 w-4 mr-2" />
          新建表单
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>表单列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>表单名称</TableHead>
                  <TableHead>编码</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>版本</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.formId}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>
                      <code className="text-sm">{form.code}</code>
                    </TableCell>
                    <TableCell>
                      {form.category === "leave"
                        ? "请假"
                        : form.category === "expense"
                        ? "报销"
                        : "自定义"}
                    </TableCell>
                    <TableCell>v{form.version}</TableCell>
                    <TableCell>
                      <Badge variant={form.isActive ? "default" : "secondary"}>
                        {form.isActive ? "启用" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(form.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/forms/${form.formId}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(form.formId, form.isSystem)}
                          disabled={form.isSystem}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
