"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface Post {
  postId: number;
  code: string;
  name: string;
  sort: number;
  status: string;
  remark: string | null;
}

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSuccess: () => void;
}

export function PostDialog({
  open,
  onOpenChange,
  post,
  onSuccess,
}: PostDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    sort: 0,
    status: "0",
    remark: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        code: post.code,
        name: post.name,
        sort: post.sort,
        status: post.status,
        remark: post.remark || "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        sort: 0,
        status: "0",
        remark: "",
      });
    }
  }, [post, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = post
        ? `/api/admin/posts/${post.postId}`
        : "/api/admin/posts";

      const response = await fetch(url, {
        method: post ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(post ? "更新成功" : "创建成功");
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
          <DialogTitle>{post ? "编辑岗位" : "新增岗位"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="code">岗位编码 *</FieldLabel>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
                <FieldDescription>唯一标识，不可重复</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">岗位名称 *</FieldLabel>
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
                <FieldLabel htmlFor="sort">显示顺序</FieldLabel>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <FieldDescription>数字越小越靠前</FieldDescription>
              </Field>

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
            </div>

            <Field>
              <FieldLabel htmlFor="remark">备注</FieldLabel>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
                placeholder="添加备注信息"
                className="resize-none"
                rows={3}
              />
            </Field>

            <Field orientation="horizontal">
              <Button type="submit">{post ? "更新" : "创建"}</Button>
              <Button
                variant="outline"
                type="button"
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
