"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApproverSelector } from "@/components/approver-selector/ApproverSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function ApproverSelectorDemo() {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const handleConfirm = async (userIds: string[]) => {
    setSelectedUserIds(userIds);

    const res = await fetch(`/api/approvers/search?q=`);
    const data = await res.json();
    const users = data.users.filter((u: any) => userIds.includes(u.id));
    setSelectedUsers(users);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">审批人选择器</h1>
        <p className="text-muted-foreground mt-2">
          演示如何使用审批人选择器组件
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>选择审批人</CardTitle>
          <CardDescription>
            支持按搜索、部门、岗位三种方式选择审批人
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setSelectorOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            选择审批人
          </Button>

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium">已选择 {selectedUsers.length} 人:</div>
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.dept && <Badge variant="outline">{user.dept}</Badge>}
                        {user.posts && user.posts.length > 0 && (
                          <span className="ml-2 text-xs">{user.posts.join(", ")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ApproverSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        selectedUserIds={selectedUserIds}
        onConfirm={handleConfirm}
        mode="multiple"
      />
    </div>
  );
}
