import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return unauthorizedResponse();
    }

    const userId = user.id;
    const userRole = user.role;

    // 根据角色设置查询条件
    // 普通用户只能看自己的申请
    // 审批人可以看到待审批的任务
    // 管理员可以看到所有数据
    const isAdmin = userRole === "admin";
    const isApprover = userRole === "approver";

    const baseWhere = isAdmin
      ? {} // 管理员可以看所有
      : { userId: userId }; // 普通用户只看自己的

    const pendingCount = await prisma.application.count({
      where: {
        ...baseWhere,
        status: "pending",
      },
    });

    const processedCount = await prisma.application.count({
      where: {
        ...baseWhere,
        status: {
          in: ["approved", "rejected"],
        },
      },
    });

    const totalApplications = await prisma.application.count({
      where: baseWhere,
    });

    let pendingApprovalCount = 0;
    if (isApprover || isAdmin) {
      pendingApprovalCount = await prisma.approvalTask.count({
        where: isAdmin
          ? { status: "pending" }
          : {
              approverId: userId,
              status: "pending",
            },
      });
    }

    const recentApplications = await prisma.application.findMany({
      where: baseWhere,
      select: {
        applyId: true,
        type: true,
        title: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return Response.json({
      pending: pendingCount,
      processed: processedCount,
      total: totalApplications,
      pendingApprovals: pendingApprovalCount, 
      recentApplications: recentApplications.map((app) => ({
        id: app.applyId,
        type: app.type,
        title: app.title,
        status: app.status,
        date: app.createdAt,
      })),
      userRole, 
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return Response.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
