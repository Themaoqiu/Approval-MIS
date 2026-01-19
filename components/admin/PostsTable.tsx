"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

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
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-0 border dark:border-slate-700 dark:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/30">
              <TableHead className="text-center w-20 dark:text-slate-300">岗位编码</TableHead>
              <TableHead className="text-center flex-1 w-20 dark:text-slate-300">岗位名称</TableHead>
              <TableHead className="text-center w-20 dark:text-slate-300">显示顺序</TableHead>
              <TableHead className="text-center w-20 dark:text-slate-300">状态</TableHead>
              <TableHead className="text-center w-32 dark:text-slate-300">备注</TableHead>
              <TableHead className="text-center w-16 dark:text-slate-300">用户数</TableHead>
              <TableHead className="text-center w-32 dark:text-slate-300">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground dark:text-slate-400 py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post, index) => (
                <motion.tr
                  key={post.postId}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
                >
                  <TableCell className="text-center font-mono text-sm dark:text-slate-300">{post.code}</TableCell>
                  <TableCell className="text-center font-medium dark:text-slate-300">{post.name}</TableCell>
                  <TableCell className="text-center dark:text-slate-300">{post.sort}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge variant={post.status === "0" ? "default" : "secondary"}>
                        {post.status === "0" ? "正常" : "停用"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground dark:text-slate-400 truncate px-2">
                    {post.remark || "-"}
                  </TableCell>
                  <TableCell className="text-center dark:text-slate-300">{post._count?.userPosts || 0}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(post)}
                          title="编辑"
                          className="dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(post.postId)}
                          disabled={(post._count?.userPosts || 0) > 0}
                          title="删除"
                          className="dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
