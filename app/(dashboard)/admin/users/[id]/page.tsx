"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
}

interface Post {
  postId: number;
  name: string;
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
    post: {
      postId: number;
      name: string;
    };
  }[];
}

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { isAdmin, user } = usePermissions();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    sex: "2",
    avatar: "",
    status: "0",
    deptId: "",
    remark: "",
    role: "user",
    postIds: [] as number[],
  });

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchData();
  }, [user, isAdmin, router, userId]);

  const fetchData = async () => {
    try {
      const [userRes, deptRes, postRes] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch("/api/admin/departments"),
        fetch("/api/admin/posts"),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserInfo(userData);
        setFormData({
          username: userData.username,
          nickname: userData.nickname || "",
          email: userData.email,
          phone: userData.phone || "",
          sex: userData.sex || "2",
          avatar: userData.avatar || "",
          status: userData.status,
          deptId: userData.deptId?.toString() || "",
          remark: userData.remark || "",
          role: userData.role || "user",
          postIds: userData.userPosts.map((up: any) => up.postId),
        });
      }

      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(deptData);
      }

      if (postRes.ok) {
        const postData = await postRes.json();
        setPosts(postData);
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

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
        router.push("/admin/users");
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "系统管理员";
      case "approver":
        return "审批人";
      case "user":
        return "普通员工";
      default:
        return "普通员工";
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

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  if (!userInfo) {
    return <div className="text-center mt-8">未找到用户信息</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">编辑用户信息</h1>
        <Button variant="outline" onClick={() => router.push("/admin/users")}>
          返回
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名 *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                maxLength={11}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sex">性别</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) =>
                  setFormData({ ...formData, sex: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">男</SelectItem>
                  <SelectItem value="1">女</SelectItem>
                  <SelectItem value="2">未知</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">正常</SelectItem>
                  <SelectItem value="1">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">头像URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deptId">所属部门</Label>
              <Select
                value={formData.deptId}
                onValueChange={(value) =>
                  setFormData({ ...formData, deptId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    .filter((dept: any) => dept.status === "0")
                    .map((dept) => (
                      <SelectItem key={dept.deptId} value={dept.deptId.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">用户角色 *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">普通员工</SelectItem>
                  <SelectItem value="approver">审批人</SelectItem>
                  <SelectItem value="admin">系统管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>岗位</Label>
            <div className="mt-2 space-y-2 border rounded-md p-4 max-h-48 overflow-y-auto">
              {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无可选岗位</p>
              ) : (
                posts
                  .filter((post: any) => post.status === "0")
                  .map((post) => (
                    <div key={post.postId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`post-${post.postId}`}
                        checked={formData.postIds.includes(post.postId)}
                        onCheckedChange={() => handlePostToggle(post.postId)}
                      />
                      <label
                        htmlFor={`post-${post.postId}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {post.name}
                      </label>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
              rows={3}
              placeholder="请输入备注信息"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              取消
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
