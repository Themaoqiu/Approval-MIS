import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, title, content } = await req.json();

  const process = await prisma.approvalProcess.findFirst({
    where: { type, isActive: true }
  });

  if (!process) {
    return NextResponse.json({ error: "No active process found" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { dept: true }
  });

  if (!user?.deptId) {
    return NextResponse.json({ error: "User has no department" }, { status: 400 });
  }

  const deptLeader = await prisma.user.findFirst({
    where: { 
      deptId: user.deptId,
      role: { in: ["approver", "admin"] }
    }
  });

  if (!deptLeader) {
    return NextResponse.json({ error: "No department approver found" }, { status: 400 });
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

    await tx.approvalTask.create({
      data: {
        applyId: app.applyId,
        step: 0,
        approverId: deptLeader.id,
        status: "pending"
      }
    });

    return app;
  });

  return NextResponse.json(application);
}
