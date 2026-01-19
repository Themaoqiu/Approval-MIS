"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface StatsChartsProps {
  trendData: Array<{ date: string; count: number; approved: number; rejected: number }>;
  typeData: Array<{ name: string; value: number }>;
  statusData: Array<{ name: string; value: number }>;
  avgProcessTime: number;
  period: string;
}

export function StatsCharts({ trendData, typeData, statusData, avgProcessTime, period }: StatsChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>趋势分析</CardTitle>
          <CardDescription>
            {period === "monthly" ? "本月每日数量" : "本年每月数量"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="总数" />
              <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="通过" />
              <Line type="monotone" dataKey="rejected" stroke="#ff7c7c" name="拒绝" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>类型分布</CardTitle>
          <CardDescription>按类型统计数量</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>状态分布</CardTitle>
          <CardDescription>按状态统计数量</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>平均处理时长</CardTitle>
          <CardDescription>从开始到完成的平均时间</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-75">
            <div className="text-6xl font-bold text-primary">{avgProcessTime.toFixed(1)}</div>
            <div className="text-xl text-muted-foreground mt-2">小时</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
