import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        sort: "asc",
      },
      include: {
        _count: {
          select: { userPosts: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("获取岗位列表失败:", error);
    return NextResponse.json({ error: "获取岗位列表失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { code, name, sort, status, remark } = body;

    const existingPost = await prisma.post.findUnique({
      where: { code },
    });

    if (existingPost) {
      return NextResponse.json({ error: "岗位编码已存在" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        code,
        name,
        sort: sort || 0,
        status: status || "0",
        remark,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("创建岗位失败:", error);
    return NextResponse.json({ error: "创建岗位失败" }, { status: 500 });
  }
}
