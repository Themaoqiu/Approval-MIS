import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "monthly";
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());
  const type = searchParams.get("type") || "applications";

  const userId = session.user.id;
  const userRole = session.user.role;

  const startDate = new Date(year, period === "monthly" ? month - 1 : 0, 1);
  const endDate = new Date(year, period === "monthly" ? month : 12, 0);

  if (type === "approvals" && (userRole === "approver" || userRole === "admin")) {
    const approvalTasks = await prisma.approvalTask.findMany({
      where: {
        approverId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        application: true,
      },
    });

    const totalApprovals = approvalTasks.length;
    const approvedCount = approvalTasks.filter((t) => t.status === "approved").length;
    const rejectedCount = approvalTasks.filter((t) => t.status === "rejected").length;
    const pendingCount = approvalTasks.filter((t) => t.status === "pending").length;
    const approvalRate = totalApprovals > 0 ? (approvedCount / totalApprovals) * 100 : 0;

    const completedTasks = approvalTasks.filter((t) => t.status !== "pending" && t.processedAt);
    const avgProcessTime = completedTasks.length > 0
      ? completedTasks.reduce((sum, task) => {
          const time = ((task.processedAt?.getTime() || 0) - task.createdAt.getTime()) / (1000 * 60 * 60);
          return sum + time;
        }, 0) / completedTasks.length
      : 0;

    const byType: Record<string, any> = {};
    approvalTasks.forEach((task) => {
      const appType = task.application.type;
      if (!byType[appType]) {
        byType[appType] = { total: 0, approved: 0, rejected: 0, pending: 0 };
      }
      byType[appType].total++;
      byType[appType][task.status]++;
    });

    const trendData = [];
    const days = period === "monthly" ? new Date(year, month, 0).getDate() : 12;
    for (let i = 1; i <= days; i++) {
      const date = period === "monthly" 
        ? new Date(year, month - 1, i)
        : new Date(year, i - 1, 1);
      
      const dayTasks = approvalTasks.filter((task) => {
        if (period === "monthly") {
          return task.createdAt.getDate() === i;
        } else {
          return task.createdAt.getMonth() === i - 1;
        }
      });

      trendData.push({
        date: period === "monthly" ? `${i}日` : `${i}月`,
        count: dayTasks.length,
        approved: dayTasks.filter((t) => t.status === "approved").length,
        rejected: dayTasks.filter((t) => t.status === "rejected").length,
      });
    }

    return NextResponse.json({
      userId,
      type: "approvals",
      period,
      date: startDate,
      metrics: {
        totalApplications: totalApprovals,
        approvedApplications: approvedCount,
        rejectedApplications: rejectedCount,
        pendingApplications: pendingCount,
        approvalRate: parseFloat(approvalRate.toFixed(2)),
        avgProcessTime: parseFloat(avgProcessTime.toFixed(2)),
        byType,
        trendData,
      },
    });
  }

  const applications = await prisma.application.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      tasks: true,
    },
  });

  const totalApplications = applications.length;
  const approvedApplications = applications.filter((a) => a.status === "approved").length;
  const rejectedApplications = applications.filter((a) => a.status === "rejected").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

  const completedApps = applications.filter((a) => a.status !== "pending");
  const avgProcessTime = completedApps.length > 0
    ? completedApps.reduce((sum, app) => {
        const time = (app.updatedAt.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + time;
      }, 0) / completedApps.length
    : 0;

  const byType: Record<string, any> = {};
  applications.forEach((app) => {
    if (!byType[app.type]) {
      byType[app.type] = { total: 0, approved: 0, rejected: 0, pending: 0 };
    }
    byType[app.type].total++;
    byType[app.type][app.status]++;
  });

  const trendData = [];
  const days = period === "monthly" ? new Date(year, month, 0).getDate() : 12;
  for (let i = 1; i <= days; i++) {
    const date = period === "monthly" 
      ? new Date(year, month - 1, i)
      : new Date(year, i - 1, 1);
    
    const dayApps = applications.filter((app) => {
      if (period === "monthly") {
        return app.createdAt.getDate() === i;
      } else {
        return app.createdAt.getMonth() === i - 1;
      }
    });

    trendData.push({
      date: period === "monthly" ? `${i}日` : `${i}月`,
      count: dayApps.length,
      approved: dayApps.filter((a) => a.status === "approved").length,
      rejected: dayApps.filter((a) => a.status === "rejected").length,
    });
  }

  return NextResponse.json({
    userId,
    period,
    date: startDate,
    metrics: {
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      approvalRate: parseFloat(approvalRate.toFixed(2)),
      avgProcessTime: parseFloat(avgProcessTime.toFixed(2)),
      byType,
      trendData,
    },
  });
}
