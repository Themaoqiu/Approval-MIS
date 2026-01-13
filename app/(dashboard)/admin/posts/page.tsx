"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PostsTable } from "@/components/admin/PostsTable";
import { PostDialog } from "@/components/admin/PostDialog";

interface Post {
  postId: number;
  code: string;
  name: string;
  sort: number;
  status: string;
  remark: string | null;
  _count?: {
    userPosts: number;
  };
}

export default function PostsPage() {
  const router = useRouter();
  const { isAdmin, user } = usePermissions();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchPosts();
  }, [user, isAdmin, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("获取岗位列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (post?: Post) => {
    setEditingPost(post || null);
    setDialogOpen(true);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("确定要删除该岗位吗？")) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("删除成功");
        fetchPosts();
      } else {
        const error = await response.json();
        toast.error(error.error || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">岗位管理</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>新增岗位</Button>
          </DialogTrigger>
          <PostDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            post={editingPost}
            onSuccess={fetchPosts}
          />
        </Dialog>
      </div>

      <PostsTable
        posts={posts}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />
    </div>
  );
}
