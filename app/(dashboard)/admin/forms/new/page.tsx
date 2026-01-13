"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldLibrary } from "@/components/form-designer/FieldLibrary";
import { DesignCanvas } from "@/components/form-designer/DesignCanvas";
import { PropertyPanel } from "@/components/form-designer/PropertyPanel";
import { useFormDesignerStore } from "@/lib/stores/form-designer-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

export default function NewFormPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("custom");
  const [saving, setSaving] = useState(false);

  const {
    fields,
    selectedFieldId,
    addField,
    removeField,
    updateField,
    setSelectedField,
    reorderFields,
  } = useFormDesignerStore();

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const handleSave = async () => {
    if (!name || !code) {
      toast.error("请填写表单名称和编码");
      return;
    }

    if (fields.length === 0) {
      toast.error("请至少添加一个字段");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          category,
          schema: { fields },
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "保存失败");
      }

      toast.success("表单创建成功");
      router.push("/admin/forms");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">创建表单</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">表单名称</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入表单名称"
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="code">表单编码</FieldLabel>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="唯一标识，如：custom_form_1"
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category">表单分类</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leave">请假</SelectItem>
                  <SelectItem value="expense">报销</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <FieldLibrary onAddField={addField} />
        <DesignCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedField}
          onRemoveField={removeField}
          onReorder={reorderFields}
        />
        <PropertyPanel
          field={selectedField}
          onUpdate={(updates) => {
            if (selectedFieldId) {
              updateField(selectedFieldId, updates);
            }
          }}
        />
      </div>
    </div>
  );
}
