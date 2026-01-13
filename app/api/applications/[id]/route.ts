import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applyId = parseInt(id);
  
  const application = await prisma.application.findUnique({
    where: { applyId },
    include: {
      applicant: { select: { username: true, nickname: true, email: true } },
      tasks: {
        include: {
          approver: { select: { username: true, nickname: true } }
        },
        orderBy: { step: "asc" }
      }
    }
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = application.userId === session.user.id;
  const isApprover = application.tasks.some(t => t.approverId === session.user.id);
  const isAdmin = session.user.role === "admin";

  if (!isOwner && !isApprover && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(application);
}
