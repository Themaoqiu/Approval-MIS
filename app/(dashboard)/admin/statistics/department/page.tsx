"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DepartmentStatisticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [year, month]);

  const fetchStats = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });

    const res = await fetch(`/api/statistics/department?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  if (loading || !data) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">部门统计</h1>
        <div className="flex gap-2">
          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={m.toString()}>
                  {m}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>部门申请量对比</CardTitle>
          <CardDescription>各部门申请数量统计</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.departments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="deptName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalApplications" fill="#8884d8" name="总数" />
              <Bar dataKey="approvedApplications" fill="#82ca9d" name="通过" />
              <Bar dataKey="rejectedApplications" fill="#ff7c7c" name="拒绝" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.departments.map((dept: any) => (
          <Card key={dept.deptId}>
            <CardHeader>
              <CardTitle>{dept.deptName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">总申请数:</span>
                <span className="font-bold">{dept.totalApplications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">已通过:</span>
                <span className="font-bold text-green-600">{dept.approvedApplications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">已拒绝:</span>
                <span className="font-bold text-red-600">{dept.rejectedApplications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">通过率:</span>
                <span className="font-bold text-blue-600">{dept.approvalRate}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
