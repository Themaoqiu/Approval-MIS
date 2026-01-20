import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const applyId = parseInt(id);
  
  const application = await prisma.application.findUnique({
    where: { applyId }
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (application.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (application.status !== "pending" || application.currentStep !== 0) {
    return NextResponse.json({ error: "Cannot withdraw" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { applyId },
      data: { status: "withdrawn" }
    });

    await tx.approvalTask.updateMany({
      where: { applyId, status: "pending" },
      data: { status: "cancelled" }
    });
  });

  return NextResponse.json({ success: true });
}
