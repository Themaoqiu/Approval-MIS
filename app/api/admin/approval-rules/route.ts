import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

    const rules = await prisma.approvalRule.findMany({
      include: {
        process: {
          select: { name: true, type: true },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    // 获取部门和岗位名称
    const deptIds = [...new Set(rules.flatMap(r => [r.applicantDeptId, r.approverDeptId]).filter(Boolean))];
    const postIds = [...new Set(rules.flatMap(r => [r.applicantPostId, r.approverPostId]).filter(Boolean))];

    const departments = await prisma.department.findMany({
      where: { deptId: { in: deptIds as number[] } },
      select: { deptId: true, name: true },
    });

    const posts = await prisma.post.findMany({
      where: { postId: { in: postIds as number[] } },
      select: { postId: true, name: true },
    });

    const deptMap = Object.fromEntries(departments.map(d => [d.deptId, d]));
    const postMap = Object.fromEntries(posts.map(p => [p.postId, p]));

    const rulesWithDetails = rules.map(rule => ({
      ...rule,
      applicantDept: rule.applicantDeptId ? deptMap[rule.applicantDeptId] : null,
      applicantPost: rule.applicantPostId ? postMap[rule.applicantPostId] : null,
      approverDept: rule.approverDeptId ? deptMap[rule.approverDeptId] : null,
      approverPost: rule.approverPostId ? postMap[rule.approverPostId] : null,
    }));

    return NextResponse.json({ rules: rulesWithDetails });
  } catch (error) {
    console.error("获取审批规则失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

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

    if (!processId || !name) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const rule = await prisma.approvalRule.create({
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
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("创建审批规则失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
