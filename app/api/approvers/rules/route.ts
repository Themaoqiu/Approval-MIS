import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await (await import("next/headers")).headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const applicationType = searchParams.get("type");

    if (!applicationType) {
      return NextResponse.json({ error: "缺少申请类型" }, { status: 400 });
    }

    // 获取当前用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userPosts: {
          include: { post: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 获取对应类型的审批流程
    const process = await prisma.approvalProcess.findFirst({
      where: { type: applicationType, isActive: true },
    });

    if (!process) {
      return NextResponse.json({ error: "未找到对应的审批流程" }, { status: 404 });
    }

    // 查找匹配的审批规则(按优先级排序)
    const rules = await prisma.approvalRule.findMany({
      where: {
        processId: process.processId,
        isActive: true,
        OR: [
          // 匹配申请人部门
          { applicantDeptId: user.deptId },
          // 匹配申请人岗位
          {
            applicantPostId: {
              in: user.userPosts.map((up) => up.postId),
            },
          },
          // 不限制申请人条件
          {
            AND: [{ applicantDeptId: null }, { applicantPostId: null }],
          },
        ],
      },
      orderBy: { priority: "desc" },
    });

    if (rules.length === 0) {
      return NextResponse.json({ 
        rules: [],
        message: "未找到适用的审批规则" 
      });
    }

    // 选择优先级最高的规则
    const rule = rules[0];

    // 根据规则筛选审批人
    let approverFilter: any = {
      role: { in: ["approver", "admin"] },
      status: "0",
      delFlag: "0",
    };

    // 如果指定了具体审批人
    if (rule.specificUserIds) {
      const userIds = JSON.parse(rule.specificUserIds);
      approverFilter.id = { in: userIds };
    } else if (rule.approverPostId) {
      // 按岗位筛选
      approverFilter.userPosts = {
        some: { postId: rule.approverPostId },
      };
    } else if (rule.approverDeptId) {
      // 按部门筛选
      approverFilter.deptId = rule.approverDeptId;
    }

    const approvers = await prisma.user.findMany({
      where: approverFilter,
      include: {
        dept: { select: { name: true } },
        userPosts: {
          include: { post: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json({
      rule: {
        ruleId: rule.ruleId,
        name: rule.name,
        approvalMode: rule.approvalMode,
      },
      approvers: approvers.map((u) => ({
        id: u.id,
        name: u.nickname || u.username,
        username: u.username,
        email: u.email,
        dept: u.dept?.name,
        deptId: u.deptId,
        posts: u.userPosts.map((up) => up.post.name),
      })),
    });
  } catch (error) {
    console.error("获取审批规则失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
