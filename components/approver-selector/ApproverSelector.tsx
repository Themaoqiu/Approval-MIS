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
import { Search, X } from "lucide-react";

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
  filterUserIds?: string[];
}

export function ApproverSelector({
  open,
  onOpenChange,
  selectedUserIds,
  onConfirm,
  mode = "multiple",
  filterUserIds,
}: ApproverSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [allSelectedUsers, setAllSelectedUsers] = useState<User[]>([]); // 存储所有已选择用户的完整信息
  const [tempSelected, setTempSelected] = useState<string[]>(selectedUserIds);
  const [loading, setLoading] = useState(false);

  const dedupeUsers = (list: User[]) => {
    const seen = new Set<string>();
    return list.filter((u) => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  };

  useEffect(() => {
    if (open) {
      setTempSelected(selectedUserIds);
      // 初始化已选择用户的完整信息
      if (selectedUserIds.length > 0) {
        // 从当前 users 中查找，如果找不到就清空（后续会通过搜索获取）
        const initialSelected = users.filter((u) => selectedUserIds.includes(u.id));
        setAllSelectedUsers(dedupeUsers(initialSelected));
      } else {
        setAllSelectedUsers([]);
      }
    }
  }, [open, selectedUserIds]);

  useEffect(() => {
    if (open) {
      searchUsers();
    }
  }, [searchQuery, open]);

  const searchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);

    const res = await fetch(`/api/approvers/search?${params}`);
    const data = await res.json();
    let filteredUsers = data.users || [];

    // 如果提供了过滤用户ID列表,只显示这些用户
    if (filterUserIds && filterUserIds.length > 0) {
      filteredUsers = filteredUsers.filter((u: User) => filterUserIds.includes(u.id));
    }

    setUsers(filteredUsers);
    
    // 更新 allSelectedUsers：将新获取的用户中已选择的加入，避免丢失
    setAllSelectedUsers((prev) => {
      const prevIds = prev.map((u) => u.id);
      const newSelectedUsers = filteredUsers.filter(
        (u: User) => tempSelected.includes(u.id) && !prevIds.includes(u.id)
      );
      return dedupeUsers([...prev, ...newSelectedUsers]);
    });
    
    setLoading(false);
  };

  const toggleUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (mode === "single") {
      setTempSelected([userId]);
      setAllSelectedUsers([user]);
    } else {
      setTempSelected((prev) => {
        if (prev.includes(userId)) {
          // 取消选择
          setAllSelectedUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
          return prev.filter((id) => id !== userId);
        } else {
          // 新增选择
          setAllSelectedUsers((prevUsers) => dedupeUsers([...prevUsers, user]));
          return [...prev, userId];
        }
      });
    }
  };

  const removeUser = (userId: string) => {
    setTempSelected((prev) => prev.filter((id) => id !== userId));
    setAllSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onOpenChange(false);
  };

  const selectedUsers = allSelectedUsers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>选择审批人</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-2 shrink-0">
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
            <div className="shrink-0 max-h-32 overflow-y-auto">
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
            </div>
          )}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">搜索中...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">未找到用户</div>
              ) : (
                <div className="space-y-2 pr-4">
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
          </div>

          <div className="flex justify-end gap-2 shrink-0 pt-4 border-t">
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
