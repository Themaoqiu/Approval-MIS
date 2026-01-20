import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { type, title, content, approverIds, approvalMode } = await req.json();

  if (!approverIds || approverIds.length === 0) {
    return NextResponse.json({ error: "至少选择一个审批人" }, { status: 400 });
  }

  const process = await prisma.approvalProcess.findFirst({
    where: { type, isActive: true }
  });

  if (!process) {
    return NextResponse.json({ error: "未找到对应的审批流程" }, { status: 400 });
  }

  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        type,
        title,
        content,
        userId: session.user.id,
        processId: process.processId,
        status: "pending",
        currentStep: 0
      }
    });

    // 根据审批模式创建审批任务
    if (approvalMode === "sequential") {
      // 顺序审批: 只创建第一个审批人的任务
      await tx.approvalTask.create({
        data: {
          applyId: app.applyId,
          step: 0,
          approverId: approverIds[0],
          status: "pending"
        }
      });
    } else if (approvalMode === "countersign" || approvalMode === "or-sign") {
      // 会签/或签: 为所有审批人创建任务
      for (const approverId of approverIds) {
        await tx.approvalTask.create({
          data: {
            applyId: app.applyId,
            step: 0,
            approverId,
            status: "pending"
          }
        });
      }
    }

    return app;
  });

  return NextResponse.json(application);
}
