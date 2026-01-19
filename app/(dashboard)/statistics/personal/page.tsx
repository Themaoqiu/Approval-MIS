"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { StatsMetrics } from "@/components/statistics/StatsMetrics";
import { StatsCharts } from "@/components/statistics/StatsCharts";
import { usePermissions } from "@/hooks/use-permissions";

export default function PersonalStatisticsPage() {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [statsType, setStatsType] = useState<"applications" | "approvals">("applications");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isApprover, isAdmin } = usePermissions();

  const showApproverStats = isApprover || isAdmin;

  useEffect(() => {
    fetchStats();
  }, [period, year, month, statsType]);

  const fetchStats = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      period,
      year: year.toString(),
      type: statsType,
      ...(period === "monthly" && { month: month.toString() }),
    });

    const res = await fetch(`/api/statistics/personal?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <motion.div
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-lg text-muted-foreground dark:text-slate-400">加载中...</div>
      </motion.div>
    );
  }

  const { metrics } = data;

  const typeData = Object.entries(metrics.byType).map(([key, value]: [string, any]) => ({
    name: key === "leave" ? "请假" : key === "reimbursement" ? "报销" : key,
    value: value.total,
  }));

  const statusData = [
    { name: "已通过", value: metrics.approvedApplications },
    { name: "已拒绝", value: metrics.rejectedApplications },
    { name: "待处理", value: metrics.pendingApplications },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">个人统计</h1>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-28 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem value="monthly">月度</SelectItem>
                <SelectItem value="yearly">年度</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-28 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                {[2024, 2025, 2026].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          
          {period === "monthly" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-24 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {m}月
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>
      </motion.div>

      {showApproverStats ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Tabs value={statsType} onValueChange={(v) => setStatsType(v as "applications" | "approvals")}>
            <TabsList className="dark:bg-slate-800">
              <TabsTrigger value="applications" className="dark:text-slate-300 dark:data-[state=active]:text-white">我的申请</TabsTrigger>
              <TabsTrigger value="approvals" className="dark:text-slate-300 dark:data-[state=active]:text-white">我的审批</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <StatsMetrics
                  totalApplications={metrics.totalApplications}
                  approvedApplications={metrics.approvedApplications}
                  rejectedApplications={metrics.rejectedApplications}
                  approvalRate={metrics.approvalRate}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <StatsCharts
                  trendData={metrics.trendData}
                  typeData={typeData}
                  statusData={statusData}
                  avgProcessTime={metrics.avgProcessTime}
                  period={period}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <StatsMetrics
                  totalApplications={metrics.totalApplications}
                  approvedApplications={metrics.approvedApplications}
                  rejectedApplications={metrics.rejectedApplications}
                  approvalRate={metrics.approvalRate}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <StatsCharts
                  trendData={metrics.trendData}
                  typeData={typeData}
                  statusData={statusData}
                  avgProcessTime={metrics.avgProcessTime}
                  period={period}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <StatsMetrics
              totalApplications={metrics.totalApplications}
              approvedApplications={metrics.approvedApplications}
              rejectedApplications={metrics.rejectedApplications}
              approvalRate={metrics.approvalRate}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <StatsCharts
              trendData={metrics.trendData}
              typeData={typeData}
              statusData={statusData}
              avgProcessTime={metrics.avgProcessTime}
              period={period}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
