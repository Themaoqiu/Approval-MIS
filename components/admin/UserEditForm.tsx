"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Department {
  deptId: number;
  name: string;
  status: string;
}

interface Post {
  postId: number;
  name: string;
  status: string;
}

interface UserInfo {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
  phone: string | null;
  sex: string | null;
  avatar: string | null;
  status: string;
  deptId: number | null;
  remark: string | null;
  role: string;
  userPosts: {
    postId: number;
  }[];
}

interface UserEditFormProps {
  userId: string;
  userInfo: UserInfo;
  departments: Department[];
  posts: Post[];
  onSuccess: () => void;
}

export function UserEditForm({
  userId,
  userInfo,
  departments,
  posts,
  onSuccess,
}: UserEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: userInfo.username,
    nickname: userInfo.nickname || "",
    email: userInfo.email,
    phone: userInfo.phone || "",
    sex: userInfo.sex || "2",
    avatar: userInfo.avatar || "",
    status: userInfo.status,
    deptId: userInfo.deptId?.toString() || "",
    remark: userInfo.remark || "",
    role: userInfo.role || "user",
    postIds: userInfo.userPosts.map((up) => up.postId),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          deptId: formData.deptId ? parseInt(formData.deptId) : null,
        }),
      });

      if (response.ok) {
        toast.success("保存成功");
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "保存失败");
      }
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handlePostToggle = (postId: number) => {
    setFormData((prev) => ({
      ...prev,
      postIds: prev.postIds.includes(postId)
        ? prev.postIds.filter((id) => id !== postId)
        : [...prev.postIds, postId],
    }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>基本信息</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="username">用户名 *</FieldLabel>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                  <FieldDescription>用户登录账号</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="nickname">昵称</FieldLabel>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="email">邮箱 *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">手机号</FieldLabel>
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
                  <FieldLabel htmlFor="sex">性别</FieldLabel>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sex: value })
                    }
                  >
                    <SelectTrigger id="sex">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">男</SelectItem>
                      <SelectItem value="1">女</SelectItem>
                      <SelectItem value="2">未知</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FieldLabel htmlFor="avatar">头像URL</FieldLabel>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  placeholder="https://..."
                />
                <FieldDescription>用户头像图片地址</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>组织信息</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="deptId">所属部门</FieldLabel>
                  <Select
                    value={formData.deptId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, deptId: value })
                    }
                  >
                    <SelectTrigger id="deptId">
                      <SelectValue placeholder="请选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments
                        .filter((dept) => dept.status === "0")
                        .map((dept) => (
                          <SelectItem
                            key={dept.deptId}
                            value={dept.deptId.toString()}
                          >
                            {dept.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="role">用户角色 *</FieldLabel>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="请选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">普通员工</SelectItem>
                      <SelectItem value="approver">审批人</SelectItem>
                      <SelectItem value="admin">系统管理员</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    决定用户的系统权限范围
                  </FieldDescription>
                </Field>
              </div>

              <Field>
                <FieldLabel>岗位</FieldLabel>
                <div className="mt-2 border rounded-md p-4 max-h-48 overflow-y-auto">
                  {posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">暂无可选岗位</p>
                  ) : (
                    <div className="space-y-2">
                      {posts
                        .filter((post) => post.status === "0")
                        .map((post) => (
                          <div
                            key={post.postId}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`post-${post.postId}`}
                              checked={formData.postIds.includes(post.postId)}
                              onCheckedChange={() => handlePostToggle(post.postId)}
                            />
                            <label
                              htmlFor={`post-${post.postId}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {post.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <FieldDescription>可选择多个岗位</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>其他信息</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="remark">备注</FieldLabel>
                <Textarea
                  id="remark"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                  rows={3}
                  placeholder="请输入备注信息"
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit" disabled={saving}>
              {saving ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              取消
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Card>
  );
}
