import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 使用 id 字段查询（Better Auth 使用 id 作为主键）
    const userId = session.user.id

    // 获取待处理申请数（申请人的申请且状态为pending）
    const pendingCount = await prisma.application.count({
      where: {
        userId: userId,
        status: "pending",
      },
    })

    // 获取已处理申请数（申请人的申请且状态为已通过或已拒绝）
    const processedCount = await prisma.application.count({
      where: {
        userId: userId,
        status: {
          in: ["approved", "rejected"],
        },
      },
    })

    // 获取我的申请总数
    const totalApplications = await prisma.application.count({
      where: {
        userId: userId,
      },
    })

    // 获取最近的申请（取最近5条）
    const recentApplications = await prisma.application.findMany({
      where: {
        userId: userId,
      },
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
    })

    return Response.json({
      pending: pendingCount,
      processed: processedCount,
      total: totalApplications,
      recentApplications: recentApplications.map((app: any) => ({
        id: app.applyId,
        type: app.type,
        title: app.title,
        status: app.status,
        date: app.createdAt,
      })),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return Response.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
