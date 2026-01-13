import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const departments = await prisma.department.findMany({
      where: {
        delFlag: "0",
      },
      include: {
        parent: true,
        _count: {
          select: {
            users: true,
            children: true,
          },
        },
      },
      orderBy: {
        orderNum: "asc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("获取部门列表失败:", error);
    return NextResponse.json({ error: "获取部门列表失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      parentId,
      name,
      orderNum = 0,
      leader,
      phone,
      email,
      status = "0",
    } = body;

    // 计算 ancestors
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

    const department = await prisma.department.create({
      data: {
        parentId,
        ancestors,
        name,
        orderNum,
        leader,
        phone,
        email,
        status,
        createdBy: user.id,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("创建部门失败:", error);
    return NextResponse.json({ error: "创建部门失败" }, { status: 500 });
  }
}
