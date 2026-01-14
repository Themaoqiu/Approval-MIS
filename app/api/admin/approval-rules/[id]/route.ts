import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

    const { id } = await context.params;
    const ruleId = parseInt(id);
    const body = await request.json();

    const {
      processId,
      name,
      description,
      applicantDeptId,
      applicantPostId,
      approverDeptId,
      approverPostId,
      specificUserIds,
      approvalMode,
      priority,
      isActive,
    } = body;

    const rule = await prisma.approvalRule.update({
      where: { ruleId },
      data: {
        processId,
        name,
        description,
        applicantDeptId,
        applicantPostId,
        approverDeptId,
        approverPostId,
        specificUserIds,
        approvalMode,
        priority,
        isActive,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("更新审批规则失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

    const { id } = await context.params;
    const ruleId = parseInt(id);

    await prisma.approvalRule.delete({
      where: { ruleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除审批规则失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
