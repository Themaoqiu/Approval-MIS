import { Metadata } from "next";
import { ApprovalRulesTable } from "@/components/admin/ApprovalRulesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "审批规则配置",
};

export default function ApprovalRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">审批规则</h1>
        <div className="flex justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建规则
          </Button>
        </div>
      </div>
      <ApprovalRulesTable />
    </div>
  );
};
