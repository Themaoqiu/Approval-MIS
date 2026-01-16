"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApprovalRulesTable } from "@/components/admin/ApprovalRulesTable";
import { ApprovalRuleDialog } from "@/components/admin/ApprovalRuleDialog";

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
  process?: {
    name: string;
    type: string;
  };
  applicantDept?: { name: string };
  applicantPost?: { name: string };
  approverDept?: { name: string };
  approverPost?: { name: string };
}

export default function ApprovalRulesPage() {
  const router = useRouter();
  const { isAdmin, user } = usePermissions();
  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchApprovalRules();
  }, [user, isAdmin, router]);

  const fetchApprovalRules = async () => {
    try {
      const response = await fetch("/api/admin/approval-rules");
      if (response.ok) {
        const data = await response.json();
        setApprovalRules(data.rules || data || []);
      }
    } catch (error) {
      toast.error("获取审批规则失败");
      console.error("获取审批规则失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (rule?: ApprovalRule) => {
    setEditingRule(rule || null);
    setDialogOpen(true);
  };

  const handleDelete = async (ruleId: number) => {
    if (!confirm("确定要删除该规则吗？"))
      return;

    try {
      const response = await fetch(`/api/admin/approval-rules/${ruleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("删除成功");
        fetchApprovalRules();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">审批规则</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          新建规则
        </Button>
      </div>

      <ApprovalRulesTable
        approvalRules={approvalRules}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <ApprovalRuleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingRule(null);
          }
        }}
        rule={editingRule}
        onSuccess={fetchApprovalRules}
      />
    </div>
  );
}
