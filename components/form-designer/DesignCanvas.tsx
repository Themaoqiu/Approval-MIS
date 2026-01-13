"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/lib/stores/form-designer-store";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function DesignCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onRemoveField,
  onReorder,
}: DesignCanvasProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>表单画布</CardTitle>
      </CardHeader>
      <CardContent className="min-h-96">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            从左侧拖拽字段到这里开始设计表单
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="canvas">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-2 p-4 border rounded-lg ${
                            selectedFieldId === field.id ? "border-primary bg-primary/5" : "bg-background"
                          } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          onClick={() => onSelectField(field.id)}
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                            <div className="text-sm text-muted-foreground">{field.type}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveField(field.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}
