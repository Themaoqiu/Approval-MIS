"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, FieldType } from "@/lib/stores/form-designer-store";
import {
  Type,
  Hash,
  List,
  Calendar,
  CalendarRange,
  FileText,
  CheckSquare,
} from "lucide-react";

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "文本框", icon: <Type className="h-4 w-4" /> },
  { type: "number", label: "数字", icon: <Hash className="h-4 w-4" /> },
  { type: "textarea", label: "多行文本", icon: <FileText className="h-4 w-4" /> },
  { type: "select", label: "下拉选择", icon: <List className="h-4 w-4" /> },
  { type: "date", label: "日期", icon: <Calendar className="h-4 w-4" /> },
  { type: "daterange", label: "日期范围", icon: <CalendarRange className="h-4 w-4" /> },
  { type: "checkbox", label: "复选框", icon: <CheckSquare className="h-4 w-4" /> },
];

interface FieldLibraryProps {
  onAddField: (field: FormField) => void;
}

export function FieldLibrary({ onAddField }: FieldLibraryProps) {
  const handleAddField = (type: FieldType) => {
    const field: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `新${fieldTypes.find((f) => f.type === type)?.label || "字段"}`,
      required: false,
      placeholder: "",
      ...(type === "select" && { options: [{ label: "选项1", value: "option1" }] }),
    };

    onAddField(field);
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>字段库</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddField(fieldType.type)}
          >
            {fieldType.icon}
            <span className="ml-2">{fieldType.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
