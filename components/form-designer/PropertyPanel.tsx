"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormField } from "@/lib/stores/form-designer-store";
import { Plus, Trash2 } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface PropertyPanelProps {
  field: FormField | null;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function PropertyPanel({ field, onUpdate }: PropertyPanelProps) {
  if (!field) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>属性配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">请选择一个字段</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>属性配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="label">字段标签</FieldLabel>
            <Input
              id="label"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="placeholder">占位符</FieldLabel>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
          />
          <Label htmlFor="required">必填字段</Label>
        </div>

        {field.type === "select" && (
          <FieldGroup>
            <FieldLabel>选项列表</FieldLabel>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="标签"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index].label = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                  />
                  <Input
                    placeholder="值"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index].value = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index);
                      onUpdate({ options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(field.options || []),
                    { label: `选项${(field.options?.length || 0) + 1}`, value: `option${(field.options?.length || 0) + 1}` },
                  ];
                  onUpdate({ options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加选项
              </Button>
            </div>
          </FieldGroup>
        )}

        {(field.type === "text" || field.type === "textarea") && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="minLength">最小长度</FieldLabel>
                <Input
                  id="minLength"
                  type="number"
                  value={field.validation?.minLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined },
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="maxLength">最大长度</FieldLabel>
                <Input
                  id="maxLength"
                  type="number"
                  value={field.validation?.maxLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined },
                    })
                  }
                />
              </Field>
            </FieldGroup>
          </>
        )}

        {field.type === "number" && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="min">最小值</FieldLabel>
                <Input
                  id="min"
                  type="number"
                  value={field.validation?.min || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...field.validation, min: parseInt(e.target.value) || undefined },
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="max">最大值</FieldLabel>
                <Input
                  id="max"
                  type="number"
                  value={field.validation?.max || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...field.validation, max: parseInt(e.target.value) || undefined },
                    })
                  }
                />
              </Field>
            </FieldGroup>
          </>
        )}
      </CardContent>
    </Card>
  );
}
