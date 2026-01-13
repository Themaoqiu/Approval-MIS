import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const departments = await prisma.department.findMany({
    where: { delFlag: "0", status: "0" },
    include: {
      users: {
        include: {
          applications: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      },
    },
  });

  const deptStats = departments.map((dept) => {
    const applications = dept.users.flatMap((u) => u.applications);
    const total = applications.length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    return {
      deptId: dept.deptId,
      deptName: dept.name,
      totalApplications: total,
      approvedApplications: approved,
      rejectedApplications: rejected,
      pendingApplications: pending,
      approvalRate: total > 0 ? parseFloat(((approved / total) * 100).toFixed(2)) : 0,
    };
  });

  return NextResponse.json({
    period: "monthly",
    date: startDate,
    departments: deptStats,
  });
}
