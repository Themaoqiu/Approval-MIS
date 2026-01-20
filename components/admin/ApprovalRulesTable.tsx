"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { FileEdit } from "lucide-react";
import { Card } from "../ui/card";

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

const APPROVAL_MODES = {
  sequential: "顺序审批",
  countersign: "会签(全部同意)",
  "or-sign": "或签(一人同意)",
};

interface ApprovalRulesTableProps {
  approvalRules: ApprovalRule[];
  onEdit: (rule: ApprovalRule) => void;
  onDelete: (ruleId: number) => Promise<void>;
}

export function ApprovalRulesTable({ approvalRules, onEdit, onDelete }: ApprovalRulesTableProps) {
  const handleEdit = (rule: ApprovalRule) => {
    onEdit(rule);
  };

  const handleDelete = async (ruleId: number) => {
    await onDelete(ruleId);
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 },
    }),
  };

  return (
    <div className="space-y-4">
      {approvalRules.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileEdit className="h-8 w-8" />
              </EmptyMedia>
              <EmptyTitle>暂无审批规则</EmptyTitle>
              <EmptyDescription>还没有配置任何审批规则</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => onEdit(undefined as any)}>
                <Plus className="h-4 w-4 mr-2" />
                新建规则
              </Button>
            </EmptyContent>
          </Empty>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <Card className="p-0 border dark:border-slate-700 dark:bg-card/50">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-slate-700 dark:hover:bg-slate-800/30">
                    <TableHead className="text-center dark:text-slate-300">规则名称</TableHead>
                    <TableHead className="text-center dark:text-slate-300">审批流程</TableHead>
                    <TableHead className="text-center dark:text-slate-300">申请人条件</TableHead>
                    <TableHead className="text-center dark:text-slate-300">审批人条件</TableHead>
                    <TableHead className="text-center dark:text-slate-300">审批模式</TableHead>
                    <TableHead className="text-center dark:text-slate-300">优先级</TableHead>
                    <TableHead className="text-center dark:text-slate-300">状态</TableHead>
                    <TableHead className="text-center dark:text-slate-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalRules.map((rule, index) => (
                    <motion.tr
                      key={rule.ruleId}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors duration-200"
                    >
                      <TableCell className="text-center dark:text-slate-300">
                        <div className="font-medium">{rule.name}</div>
                        {rule.description && (
                          <div className="text-sm text-muted-foreground dark:text-slate-400">{rule.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-center dark:text-slate-300">
                        <div>{rule.process?.name}</div>
                        <Badge variant="outline" className="mt-1 dark:border-slate-600">
                          {rule.process?.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {rule.applicantDeptId ? (
                          <Badge variant="secondary">{rule.applicantDept?.name || `部门${rule.applicantDeptId}`}</Badge>
                        ) : rule.applicantPostId ? (
                          <Badge variant="secondary">{rule.applicantPost?.name || `岗位${rule.applicantPostId}`}</Badge>
                        ) : (
                          <span className="text-muted-foreground dark:text-slate-400">不限</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {rule.specificUserIds ? (
                          <Badge>指定用户</Badge>
                        ) : rule.approverDeptId ? (
                          <Badge variant="secondary">{rule.approverDept?.name || `部门${rule.approverDeptId}`}</Badge>
                        ) : rule.approverPostId ? (
                          <Badge variant="secondary">{rule.approverPost?.name || `岗位${rule.approverPostId}`}</Badge>
                        ) : (
                          <span className="text-muted-foreground dark:text-slate-400">不限</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={rule.approvalMode === "sequential" ? "outline" : "default"}>
                          {APPROVAL_MODES[rule.approvalMode as keyof typeof APPROVAL_MODES] || rule.approvalMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center dark:text-slate-300">{rule.priority}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "启用" : "禁用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(rule)}
                              className="dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(rule.ruleId)}
                              className="dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
