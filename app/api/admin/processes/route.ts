import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

    const processes = await prisma.approvalProcess.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ processes });
  } catch (error) {
    console.error("获取审批流程失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
