import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const department = await prisma.department.findUnique({
      where: { deptId: parseInt(id) },
      include: {
        parent: true,
        children: true,
        users: true,
      },
    });

    if (!department) {
      return NextResponse.json({ error: "部门不存在" }, { status: 404 });
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("获取部门信息失败:", error);
    return NextResponse.json({ error: "获取部门信息失败" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { parentId, name, orderNum, leader, phone, email, status } = body;

    let ancestors = "";
    if (parentId) {
      const parent = await prisma.department.findUnique({
        where: { deptId: parentId },
      });
      if (parent) {
        ancestors = parent.ancestors
          ? `${parent.ancestors},${parentId}`
          : `${parentId}`;
      }
    }

    const department = await prisma.department.update({
      where: { deptId: parseInt(id) },
      data: {
        parentId,
        ancestors,
        name,
        orderNum,
        leader,
        phone,
        email,
        status,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("更新部门失败:", error);
    return NextResponse.json({ error: "更新部门失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // 检查是否有子部门
    const children = await prisma.department.count({
      where: {
        parentId: parseInt(id),
        delFlag: "0",
      },
    });

    if (children > 0) {
      return NextResponse.json(
        { error: "该部门下有子部门，无法删除" },
        { status: 400 }
      );
    }

    // 检查是否有用户
    const users = await prisma.user.count({
      where: {
        deptId: parseInt(id),
        delFlag: "0",
      },
    });

    if (users > 0) {
      return NextResponse.json(
        { error: "该部门下有用户，无法删除" },
        { status: 400 }
      );
    }

    // 软删除
    await prisma.department.update({
      where: { deptId: parseInt(id) },
      data: {
        delFlag: "2",
        updatedBy: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除部门失败:", error);
    return NextResponse.json({ error: "删除部门失败" }, { status: 500 });
  }
}
