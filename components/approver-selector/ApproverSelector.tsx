"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Building2, Briefcase, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  dept?: string;
  deptId?: number;
  posts?: string[];
  avatar?: string;
}

interface ApproverSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserIds: string[];
  onConfirm: (userIds: string[]) => void;
  mode?: "single" | "multiple";
}

export function ApproverSelector({
  open,
  onOpenChange,
  selectedUserIds,
  onConfirm,
  mode = "multiple",
}: ApproverSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedUserIds);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTempSelected(selectedUserIds);
      fetchDepartments();
      fetchPosts();
    }
  }, [open, selectedUserIds]);

  useEffect(() => {
    if (open) {
      searchUsers();
    }
  }, [searchQuery, selectedDeptId, selectedPostId, open]);

  const fetchDepartments = async () => {
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    setDepartments(data.departments || []);
  };

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const searchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedDeptId) params.set("deptId", selectedDeptId.toString());

    const res = await fetch(`/api/approvers/search?${params}`);
    const data = await res.json();
    let filteredUsers = data.users || [];

    if (selectedPostId) {
      const postUsers = await fetch(`/api/admin/posts/${selectedPostId}`);
      const postData = await postUsers.json();
      const postUserIds = postData.userPosts?.map((up: any) => up.userId) || [];
      filteredUsers = filteredUsers.filter((u: User) => postUserIds.includes(u.id));
    }

    setUsers(filteredUsers);
    setLoading(false);
  };

  const toggleUser = (userId: string) => {
    if (mode === "single") {
      setTempSelected([userId]);
    } else {
      setTempSelected((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
      );
    }
  };

  const removeUser = (userId: string) => {
    setTempSelected((prev) => prev.filter((id) => id !== userId));
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onOpenChange(false);
  };

  const selectedUsers = users.filter((u) => tempSelected.includes(u.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>选择审批人</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、姓名或邮箱"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {tempSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
              <div className="w-full text-sm font-medium mb-2">
                已选择 {tempSelected.length} 人
              </div>
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="pr-1">
                  {user.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeUser(user.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">
                <Users className="h-4 w-4 mr-2" />
                搜索
              </TabsTrigger>
              <TabsTrigger value="department">
                <Building2 className="h-4 w-4 mr-2" />
                按部门
              </TabsTrigger>
              <TabsTrigger value="post">
                <Briefcase className="h-4 w-4 mr-2" />
                按岗位
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-4">
              <ScrollArea className="h-96">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">搜索中...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">未找到用户</div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleUser(user.id)}
                      >
                        <Checkbox checked={tempSelected.includes(user.id)} />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.dept} {user.posts && user.posts.length > 0 && `· ${user.posts.join(", ")}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="department" className="mt-4">
              <div className="grid grid-cols-4 gap-4 h-96">
                <ScrollArea className="col-span-1 border rounded-lg p-2">
                  <div className="space-y-1">
                    {departments.map((dept) => (
                      <Button
                        key={dept.deptId}
                        variant={selectedDeptId === dept.deptId ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedDeptId(dept.deptId)}
                      >
                        {dept.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                <ScrollArea className="col-span-3">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">请选择部门</div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => toggleUser(user.id)}
                        >
                          <Checkbox checked={tempSelected.includes(user.id)} />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="post" className="mt-4">
              <div className="grid grid-cols-4 gap-4 h-96">
                <ScrollArea className="col-span-1 border rounded-lg p-2">
                  <div className="space-y-1">
                    {posts.map((post) => (
                      <Button
                        key={post.postId}
                        variant={selectedPostId === post.postId ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedPostId(post.postId)}
                      >
                        {post.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                <ScrollArea className="col-span-3">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">请选择岗位</div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => toggleUser(user.id)}
                        >
                          <Checkbox checked={tempSelected.includes(user.id)} />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.dept} · {user.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleConfirm}>
              确定 {tempSelected.length > 0 && `(${tempSelected.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
