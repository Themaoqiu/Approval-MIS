import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const applications = await prisma.application.findMany({
    where,
    include: {
      applicant: { 
        select: { 
          username: true, 
          nickname: true 
        } 
      },
        tasks: {
          include: {
            approver: { 
              select: { 
                username: true, 
                nickname: true 
              } 
            }
          },
          orderBy: { 
            step: "asc" 
          }
        }
    },
    orderBy: { 
      createdAt: "desc" 
    }
  });

  return NextResponse.json(applications);
}
