"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

export function ApplicationForm() {
  const router = useRouter();
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    reason: ""
  });

  const [reimbursementData, setReimbursementData] = useState({
    expenseType: "",
    amount: "",
    reason: ""
  });

  const days = leaveData.startDate && leaveData.endDate
    ? differenceInDays(leaveData.endDate, leaveData.startDate) + 1
    : 0;

  const handleSubmit = async () => {
    let title = "";
    let content = {};

    if (type === "leave") {
      if (!leaveData.leaveType || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
        toast.error("请填写完整信息");
        return;
      }
      title = `请假申请 - ${leaveData.leaveType}`;
      content = {
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate.toISOString(),
        endDate: leaveData.endDate.toISOString(),
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

    setLoading(true);
    try {
      const res = await fetch("/api/applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content })
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold">新建申请</h2>
      <Separator />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>申请类型</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="选择申请类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leave">请假申请</SelectItem>
              <SelectItem value="reimbursement">报销申请</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "leave" && (
          <>
            <div className="space-y-2">
              <Label>请假类型</Label>
              <Select
                value={leaveData.leaveType}
                onValueChange={(v) => setLeaveData({ ...leaveData, leaveType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择请假类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="事假">事假</SelectItem>
                  <SelectItem value="病假">病假</SelectItem>
                  <SelectItem value="年假">年假</SelectItem>
                  <SelectItem value="调休">调休</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {leaveData.startDate ? format(leaveData.startDate, "PPP", { locale: zhCN }) : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leaveData.startDate}
                      onSelect={(date) => setLeaveData({ ...leaveData, startDate: date })}
                      locale={zhCN}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>结束日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {leaveData.endDate ? format(leaveData.endDate, "PPP", { locale: zhCN }) : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leaveData.endDate}
                      onSelect={(date) => setLeaveData({ ...leaveData, endDate: date })}
                      locale={zhCN}
                      disabled={(date) => leaveData.startDate ? date < leaveData.startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {days > 0 && (
              <p className="text-sm text-muted-foreground">请假天数：{days} 天</p>
            )}

            <div className="space-y-2">
              <Label>请假事由</Label>
              <Textarea
                value={leaveData.reason}
                onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                placeholder="请输入请假事由"
                rows={4}
              />
            </div>
          </>
        )}

        {type === "reimbursement" && (
          <>
            <div>
              <Label>费用类型</Label>
              <Select
                value={reimbursementData.expenseType}
                onValueChange={(v) => setReimbursementData({ ...reimbursementData, expenseType: v })}
              >
                <SelectTrigger>
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
            </div>

            <div>
              <Label>报销金额（元）</Label>
              <Input
                type="number"
                value={reimbursementData.amount}
                onChange={(e) => setReimbursementData({ ...reimbursementData, amount: e.target.value })}
                placeholder="请输入金额"
              />
            </div>

            <div>
              <Label>报销事由</Label>
              <Textarea
                value={reimbursementData.reason}
                onChange={(e) => setReimbursementData({ ...reimbursementData, reason: e.target.value })}
                placeholder="请输入报销事由"
                rows={4}
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSubmit} disabled={loading || !type}>
            {loading ? "提交中..." : "提交申请"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            取消
          </Button>
        </div>
      </div>
    </Card>
  );
}
