"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface PostsTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
}

export function PostsTable({ posts, onEdit, onDelete }: PostsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-20">岗位编码</TableHead>
            <TableHead className="text-center flex-1 w-20">岗位名称</TableHead>
            <TableHead className="text-center w-20">显示顺序</TableHead>
            <TableHead className="text-center w-20">状态</TableHead>
            <TableHead className="text-center w-32">备注</TableHead>
            <TableHead className="text-center w-16">用户数</TableHead>
            <TableHead className="text-center w-32">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.postId}>
                <TableCell className="text-center font-mono text-sm">{post.code}</TableCell>
                <TableCell className="text-center font-medium">{post.name}</TableCell>
                <TableCell className="text-center">{post.sort}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Badge variant={post.status === "0" ? "default" : "secondary"}>
                      {post.status === "0" ? "正常" : "停用"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground truncate px-2">
                  {post.remark || "-"}
                </TableCell>
                <TableCell className="text-center">{post._count?.userPosts || 0}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(post.postId)}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
