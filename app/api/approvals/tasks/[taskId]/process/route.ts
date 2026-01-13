import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId: taskIdStr } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskId = parseInt(taskIdStr);
  const { action, comment } = await req.json();

  const task = await prisma.approvalTask.findUnique({
    where: { taskid: taskId },
    include: { application: { include: { process: true } } }
  });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (task.approverId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (task.status !== "pending") {
    return NextResponse.json({ error: "Already processed" }, { status: 400 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  await prisma.$transaction(async (tx) => {
    await tx.approvalTask.update({
      where: { taskid: taskId },
      data: {
        status: newStatus,
        comment,
        processedAt: new Date()
      }
    });

    if (action === "reject") {
      await tx.application.update({
        where: { applyId: task.applyId },
        data: { status: "rejected" }
      });
    } else {
      const process = task.application.process;
      const config = process?.config as any;
      const nextStep = task.step + 1;
      const hasNextStep = config?.steps && config.steps.length > nextStep;

      if (hasNextStep) {
        const user = await tx.user.findUnique({
          where: { id: task.application.userId }
        });
        
        const nextApprover = await tx.user.findFirst({
          where: { 
            deptId: user?.deptId,
            role: { in: ["approver", "admin"] }
          }
        });

        if (nextApprover) {
          await tx.approvalTask.create({
            data: {
              applyId: task.applyId,
              step: nextStep,
              approverId: nextApprover.id,
              status: "pending"
            }
          });

          await tx.application.update({
            where: { applyId: task.applyId },
            data: { currentStep: nextStep }
          });
        }
      } else {
        await tx.application.update({
          where: { applyId: task.applyId },
          data: { status: "approved" }
        });
      }
    }
  });

  return NextResponse.json({ success: true });
}
