"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
  phone: string | null;
  sex: string | null;
  avatar: string | null;
  role: string;
  dept: {
    name: string;
  } | null;
  userPosts: {
    post: {
      name: string;
    };
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    phone: "",
    sex: "2",
    avatar: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData({
            nickname: data.nickname || "",
            phone: data.phone || "",
            sex: data.sex || "2",
            avatar: data.avatar || "",
          });
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("保存成功");
        const data = await response.json();
        setProfile(data);
        setTimeout(() => {
          router.back();
        }, 500);
      } else {
        toast.error("保存失败");
      }
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-8">未找到用户信息</div>;
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">个人信息设置</h1>

      <Card className="p-6">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar || profile.avatar || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {getInitials(profile.nickname || profile.username)}
            </AvatarFallback>
          </Avatar>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input value={profile.username} disabled />
            </div>

            <div className="space-y-2">
              <Label>邮箱</Label>
              <Input value={profile.email} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                placeholder="请输入昵称"
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
                placeholder="请输入手机号"
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
              <Label>角色</Label>
              <Input
                value={
                  profile.role === "admin"
                    ? "系统管理员"
                    : profile.role === "approver"
                      ? "审批人"
                      : "普通员工"
                }
                disabled
              />
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
              placeholder="请输入头像URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>所属部门</Label>
              <Input value={profile.dept?.name || "未分配"} disabled />
            </div>

            <div className="space-y-2">
              <Label>岗位</Label>
              <Input
                value={
                  profile?.userPosts && profile.userPosts.length > 0
                    ? profile.userPosts.map((up) => up.post.name).join(", ")
                    : "未分配"
                }
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
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
