import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  const tasks = await prisma.approvalTask.findMany({
    where: {
      approverId: session.user.id,
      status
    },
    include: {
      application: {
        include: {
          applicant: { select: { username: true, nickname: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tasks);
}
