"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { UserEditForm } from "@/components/admin/UserEditForm";

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

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { isAdmin, user } = usePermissions();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  if (!userInfo) {
    return <div className="text-center mt-8">未找到用户信息</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">编辑用户信息</h1>
        <Button variant="outline" onClick={() => router.push("/admin/users")}>
          返回
        </Button>
      </div>

      <UserEditForm
        userId={userId}
        userInfo={userInfo}
        departments={departments}
        posts={posts}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
