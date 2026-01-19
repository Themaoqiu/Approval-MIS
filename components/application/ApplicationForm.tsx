"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Users } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import { ApproverSelector } from "@/components/approver-selector/ApproverSelector";
import { Badge } from "@/components/ui/badge";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";

interface ApprovalRule {
  ruleId: number;
  name: string;
  approvalMode: string;
}

interface Approver {
  id: string;
  name: string;
  username: string;
  email: string;
  dept?: string;
  deptId?: number;
  posts?: string[];
}

export function ApplicationForm() {
  const router = useRouter();
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showApproverSelector, setShowApproverSelector] = useState(false);
  const [selectedApproverIds, setSelectedApproverIds] = useState<string[]>([]);
  const [availableApprovers, setAvailableApprovers] = useState<Approver[]>([]);
  const [currentRule, setCurrentRule] = useState<ApprovalRule | null>(null);

  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    dateRange: undefined as DateRange | undefined,
    reason: ""
  });

  const [reimbursementData, setReimbursementData] = useState({
    expenseType: "",
    amount: "",
    reason: ""
  });

  const days = leaveData.dateRange?.from && leaveData.dateRange?.to
    ? differenceInDays(leaveData.dateRange.to, leaveData.dateRange.from) + 1
    : 0;

  useEffect(() => {
    if (type) {
      fetchApprovalRule();
    } else {
      setCurrentRule(null);
      setAvailableApprovers([]);
      setSelectedApproverIds([]);
    }
  }, [type]);

  const fetchApprovalRule = async () => {
    try {
      const res = await fetch(`/api/approvers/rules?type=${type}`);
      const data = await res.json();

      if (res.ok && data.rule) {
        setCurrentRule(data.rule);
        setAvailableApprovers(data.approvers || []);
        if (data.approvers?.length === 1) {
          setSelectedApproverIds([data.approvers[0].id]);
        } else {
          setSelectedApproverIds([]);
        }
      } else {
        toast.error(data.message || "未找到适用的审批规则");
        setCurrentRule(null);
        setAvailableApprovers([]);
      }
    } catch (error) {
      console.error("获取审批规则失败:", error);
      toast.error("获取审批规则失败");
    }
  };

  const getApprovalModeText = (mode: string) => {
    switch (mode) {
      case "sequential":
        return "顺序审批";
      case "countersign":
        return "会签(全部同意)";
      case "or-sign":
        return "或签(一人同意)";
      default:
        return mode;
    }
  };

  const handleSubmit = async () => {
    let title = "";
    let content = {};

    if (type === "leave") {
      if (!leaveData.leaveType || !leaveData.dateRange?.from || !leaveData.dateRange?.to || !leaveData.reason) {
        toast.error("请填写完整信息");
        return;
      }
      title = `请假申请 - ${leaveData.leaveType}`;
      content = {
        leaveType: leaveData.leaveType,
        startDate: leaveData.dateRange.from.toISOString(),
        endDate: leaveData.dateRange.to.toISOString(),
        days,
        reason: leaveData.reason
      };
    } else if (type === "reimbursement") {
      if (!reimbursementData.expenseType || !reimbursementData.amount || !reimbursementData.reason) {
        toast.error("请填写完整信息");
        return;
      }
      title = `报销申请 - ${reimbursementData.expenseType}`;
      content = {
        expenseType: reimbursementData.expenseType,
        amount: parseFloat(reimbursementData.amount),
        reason: reimbursementData.reason
      };
    } else {
      toast.error("请选择申请类型");
      return;
    }

    if (selectedApproverIds.length === 0) {
      toast.error("请选择审批人");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type, 
          title, 
          content,
          approverIds: selectedApproverIds,
          approvalMode: currentRule?.approvalMode || "sequential"
        })
      });

      if (res.ok) {
        toast.success("申请提交成功");
        router.push("/applications/my");
      } else {
        const error = await res.json();
        toast.error(error.error || "提交失败");
      }
    } catch (error) {
      toast.error("提交失败");
    } finally {
      setLoading(false);
    }
  };

  const selectedApprovers = availableApprovers.filter(a => selectedApproverIds.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
    <Card className="p-6">
      <h2 className="text-2xl font-bold">新建申请</h2>
      <Separator />
      <form>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="type">申请类型</FieldLabel>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="max-w-xs">
                  <SelectValue placeholder="选择申请类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leave">请假申请</SelectItem>
                  <SelectItem value="reimbursement">报销申请</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {type === "leave" && (
            <FieldSet>
              <FieldLegend>请假信息</FieldLegend>
              <FieldSeparator />
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="leaveType">请假类型</FieldLabel>
                    <Select
                      value={leaveData.leaveType}
                      onValueChange={(v) => setLeaveData({ ...leaveData, leaveType: v })}
                    >
                      <SelectTrigger id="leaveType" className="max-w-xs">
                        <SelectValue placeholder="选择请假类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="事假">事假</SelectItem>
                        <SelectItem value="病假">病假</SelectItem>
                        <SelectItem value="年假">年假</SelectItem>
                        <SelectItem value="调休">调休</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>请假日期</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="max-w-xs justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {leaveData.dateRange?.from ? (
                            leaveData.dateRange.to ? (
                              <>
                                {format(leaveData.dateRange.from, "PPP", { locale: zhCN })} -{" "}
                                {format(leaveData.dateRange.to, "PPP", { locale: zhCN })}
                              </>
                            ) : (
                              format(leaveData.dateRange.from, "PPP", { locale: zhCN })
                            )
                          ) : (
                            "选择日期范围"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          defaultMonth={leaveData.dateRange?.from}
                          selected={leaveData.dateRange}
                          onSelect={(range) => setLeaveData({ ...leaveData, dateRange: range })}
                          numberOfMonths={2}
                          locale={zhCN}
                          className="rounded-lg border shadow-sm"
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>

                {days > 0 && (
                  <FieldDescription>请假天数：{days} 天</FieldDescription>
                )}

                <Field>
                  <FieldLabel htmlFor="leaveReason">请假事由</FieldLabel>
                  <Textarea
                    id="leaveReason"
                    value={leaveData.reason}
                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    placeholder="请输入请假事由"
                    rows={4}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          )}

          {type === "reimbursement" && (
            <FieldSet>
              <FieldLegend>报销信息</FieldLegend>
              <FieldSeparator />
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="expenseType">费用类型</FieldLabel>
                    <Select
                      value={reimbursementData.expenseType}
                      onValueChange={(v) => setReimbursementData({ ...reimbursementData, expenseType: v })}
                    >
                      <SelectTrigger id="expenseType">
                        <SelectValue placeholder="选择费用类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="差旅费">差旅费</SelectItem>
                        <SelectItem value="餐费">餐费</SelectItem>
                        <SelectItem value="交通费">交通费</SelectItem>
                        <SelectItem value="办公用品">办公用品</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="amount">报销金额（元）</FieldLabel>
                    <Input
                      id="amount"
                      type="number"
                      value={reimbursementData.amount}
                      onChange={(e) => setReimbursementData({ ...reimbursementData, amount: e.target.value })}
                      placeholder="请输入金额"
                    />
                    <FieldDescription>请输入实际报销金额</FieldDescription>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="reimbursementReason">报销事由</FieldLabel>
                  <Textarea
                    id="reimbursementReason"
                    value={reimbursementData.reason}
                    onChange={(e) => setReimbursementData({ ...reimbursementData, reason: e.target.value })}
                    placeholder="请输入报销事由"
                    rows={4}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          )}

          {type && currentRule && (
            <FieldSet>
              <FieldLegend>审批人选择</FieldLegend>
              <FieldSeparator />
              <FieldGroup>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{currentRule.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        审批模式: {getApprovalModeText(currentRule.approvalMode)}
                      </div>
                      {availableApprovers.length > 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          可选审批人: {availableApprovers.length} 人
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApproverSelector(true)}
                      disabled={availableApprovers.length === 0}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      选择审批人
                    </Button>
                  </div>

                  {selectedApproverIds.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        已选审批人 ({selectedApproverIds.length}人)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedApprovers.map((approver) => (
                          <Badge key={approver.id} variant="secondary">
                            {approver.name} ({approver.dept || "无部门"})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableApprovers.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      未找到符合条件的审批人,请联系管理员配置审批规则
                    </div>
                  )}
                </div>
              </FieldGroup>
            </FieldSet>
          )}

          <div className="flex gap-2">
            <Button type="button" onClick={handleSubmit} disabled={loading || !type || selectedApproverIds.length === 0}>
              {loading ? "提交中..." : "提交申请"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              取消
            </Button>
          </div>
        </FieldGroup>
      </form>

      <ApproverSelector
        open={showApproverSelector}
        onOpenChange={setShowApproverSelector}
        selectedUserIds={selectedApproverIds}
        onConfirm={setSelectedApproverIds}
        mode={currentRule?.approvalMode === "sequential" ? "single" : "multiple"}
        filterUserIds={availableApprovers.map(a => a.id)}
      />
    </Card>
    </motion.div>
  );
}
