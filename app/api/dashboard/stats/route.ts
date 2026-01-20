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

    const isAdmin = userRole === "admin";
    const isApprover = userRole === "approver";

    const myPendingCount = await prisma.application.count({
      where: {
        userId,
        status: "pending",
      },
    });

    const myProcessedCount = await prisma.application.count({
      where: {
        userId,
        status: {
          in: ["approved", "rejected"],
        },
      },
    });

    const myTotalApplications = await prisma.application.count({
      where: { userId },
    });

    const systemTotalApplications = await prisma.application.count({});

    let pendingApprovalCount = 0;
    let processedApprovalCount = 0;
    if (isApprover || isAdmin) {
      pendingApprovalCount = await prisma.approvalTask.count({
        where: isAdmin
          ? { status: "pending" }
          : {
              approverId: userId,
              status: "pending",
            },
      });

      processedApprovalCount = await prisma.approvalTask.count({
        where: isAdmin
          ? { status: { in: ["approved", "rejected"] } }
          : {
              approverId: userId,
              status: { in: ["approved", "rejected"] },
            },
      });
    }

    const recentApplications = await prisma.application.findMany({
      where: { userId },
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
      pending: myPendingCount,
      processed: myProcessedCount,
      total: myTotalApplications,
      systemTotal: systemTotalApplications,
      pendingApprovals: pendingApprovalCount,
      processedApprovals: processedApprovalCount,
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
