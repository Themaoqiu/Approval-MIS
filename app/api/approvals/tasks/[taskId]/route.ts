import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId: taskIdStr } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskId = parseInt(taskIdStr);

  const task = await prisma.approvalTask.findUnique({
    where: { taskid: taskId },
    include: {
      application: {
        include: {
          applicant: { select: { username: true, nickname: true, email: true } },
          tasks: {
            include: {
              approver: { select: { username: true, nickname: true } }
            },
            orderBy: { step: "asc" }
          }
        }
      }
    }
  });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 检查权限：允许审批人或管理员查看
  if (task.approverId !== session.user.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json(task);
}
