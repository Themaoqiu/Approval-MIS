"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ApproverSelector } from "@/components/approver-selector/ApproverSelector";

interface ApprovalRule {
  ruleId: number;
  processId: number;
  name: string;
  description: string | null;
  applicantDeptId: number | null;
  applicantPostId: number | null;
  approverDeptId: number | null;
  approverPostId: number | null;
  specificUserIds: string | null;
  approvalMode: string;
  priority: number;
  isActive: boolean;
}

interface ApprovalRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, success?: boolean) => void;
  rule?: ApprovalRule;
}

interface Process {
  processId: number;
  name: string;
  type: string;
}

interface Department {
  deptId: number;
  name: string;
}

interface Post {
  postId: number;
  name: string;
}

export function ApprovalRuleDialog({ open, onOpenChange, rule }: ApprovalRuleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showApproverSelector, setShowApproverSelector] = useState(false);

  const [formData, setFormData] = useState({
    processId: "",
    name: "",
    description: "",
    applicantDeptId: "",
    applicantPostId: "",
    approverDeptId: "",
    approverPostId: "",
    specificUserIds: [] as string[],
    approvalMode: "sequential",
    priority: "0",
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      fetchProcesses();
      fetchDepartments();
      fetchPosts();

      if (rule) {
        setFormData({
          processId: rule.processId.toString(),
          name: rule.name,
          description: rule.description || "",
          applicantDeptId: rule.applicantDeptId?.toString() || "",
          applicantPostId: rule.applicantPostId?.toString() || "",
          approverDeptId: rule.approverDeptId?.toString() || "",
          approverPostId: rule.approverPostId?.toString() || "",
          specificUserIds: rule.specificUserIds ? JSON.parse(rule.specificUserIds) : [],
          approvalMode: rule.approvalMode,
          priority: rule.priority.toString(),
          isActive: rule.isActive,
        });
      } else {
        setFormData({
          processId: "",
          name: "",
          description: "",
          applicantDeptId: "",
          applicantPostId: "",
          approverDeptId: "",
          approverPostId: "",
          specificUserIds: [],
          approvalMode: "sequential",
          priority: "0",
          isActive: true,
        });
      }
    }
  }, [open, rule]);

  const fetchProcesses = async () => {
    const res = await fetch("/api/admin/processes");
    const data = await res.json();
    setProcesses(data.processes || []);
  };

  const fetchDepartments = async () => {
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    setDepartments(data);
  };

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async () => {
    if (!formData.processId || !formData.name) {
      toast.error("请填写必填字段");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        processId: parseInt(formData.processId),
        name: formData.name,
        description: formData.description || null,
        applicantDeptId: formData.applicantDeptId ? parseInt(formData.applicantDeptId) : null,
        applicantPostId: formData.applicantPostId ? parseInt(formData.applicantPostId) : null,
        approverDeptId: formData.approverDeptId ? parseInt(formData.approverDeptId) : null,
        approverPostId: formData.approverPostId ? parseInt(formData.approverPostId) : null,
        specificUserIds: formData.specificUserIds.length > 0 ? JSON.stringify(formData.specificUserIds) : null,
        approvalMode: formData.approvalMode,
        priority: parseInt(formData.priority),
        isActive: formData.isActive,
      };

      const url = rule
        ? `/api/admin/approval-rules/${rule.ruleId}`
        : "/api/admin/approval-rules";
      const method = rule ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(rule ? "更新成功" : "创建成功");
        onOpenChange(false, true);
      } else {
        const error = await res.json();
        toast.error(error.error || "操作失败");
      }
    } catch (error) {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{rule ? "编辑审批规则" : "新建审批规则"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processId">审批流程 *</Label>
                <Select
                  value={formData.processId}
                  onValueChange={(v) => setFormData({ ...formData, processId: v })}
                >
                  <SelectTrigger id="processId">
                    <SelectValue placeholder="选择审批流程" />
                  </SelectTrigger>
                  <SelectContent>
                    {processes.map((p) => (
                      <SelectItem key={p.processId} value={p.processId.toString()}>
                        {p.name} ({p.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">规则名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如: 计算机学院学生请假规则"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">规则描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述这条规则的用途"
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">申请人条件(满足以下任一条件)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantDeptId">申请人所属部门</Label>
                  <Select
                    value={formData.applicantDeptId || "none"}
                    onValueChange={(v) => setFormData({ ...formData, applicantDeptId: v === "none" ? "" : v })}
                  >
                    <SelectTrigger id="applicantDeptId">
                      <SelectValue placeholder="不限" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不限</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.deptId} value={d.deptId.toString()}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicantPostId">申请人所属岗位</Label>
                  <Select
                    value={formData.applicantPostId || "none"}
                    onValueChange={(v) => setFormData({ ...formData, applicantPostId: v === "none" ? "" : v })}
                  >
                    <SelectTrigger id="applicantPostId">
                      <SelectValue placeholder="不限" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不限</SelectItem>
                      {posts.map((p) => (
                        <SelectItem key={p.postId} value={p.postId.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">审批人筛选条件</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="approverDeptId">审批人部门</Label>
                    <Select
                      value={formData.approverDeptId || "none"}
                      onValueChange={(v) => setFormData({ ...formData, approverDeptId: v === "none" ? "" : v })}
                    >
                      <SelectTrigger id="approverDeptId">
                        <SelectValue placeholder="不限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不限</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d.deptId} value={d.deptId.toString()}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approverPostId">审批人岗位</Label>
                    <Select
                      value={formData.approverPostId || "none"}
                      onValueChange={(v) => setFormData({ ...formData, approverPostId: v === "none" ? "" : v })}
                    >
                      <SelectTrigger id="approverPostId">
                        <SelectValue placeholder="不限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不限</SelectItem>
                        {posts.map((p) => (
                          <SelectItem key={p.postId} value={p.postId.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>指定具体审批人({formData.specificUserIds.length}人)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApproverSelector(true)}
                  >
                    选择审批人
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    优先级: 指定用户 &gt; 岗位 &gt; 部门。留空则不限制
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">审批设置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approvalMode">审批模式</Label>
                  <Select
                    value={formData.approvalMode}
                    onValueChange={(v) => setFormData({ ...formData, approvalMode: v })}
                  >
                    <SelectTrigger id="approvalMode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">顺序审批</SelectItem>
                      <SelectItem value="countersign">会签(全部同意)</SelectItem>
                      <SelectItem value="or-sign">或签(一人同意)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">数字越大优先级越高</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive">启用此规则</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ApproverSelector
        open={showApproverSelector}
        onOpenChange={setShowApproverSelector}
        selectedUserIds={formData.specificUserIds}
        onConfirm={(userIds) => {
          setFormData({ ...formData, specificUserIds: userIds });
          setShowApproverSelector(false);
        }}
        mode="multiple"
      />
    </>
  );
}
