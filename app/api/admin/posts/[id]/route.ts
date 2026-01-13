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
    const post = await prisma.post.findUnique({
      where: { postId: parseInt(id) },
      include: {
        userPosts: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "岗位不存在" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("获取岗位信息失败:", error);
    return NextResponse.json({ error: "获取岗位信息失败" }, { status: 500 });
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
    const { code, name, sort, status, remark } = body;

    const existingPost = await prisma.post.findFirst({
      where: {
        code,
        postId: { not: parseInt(id) },
      },
    });

    if (existingPost) {
      return NextResponse.json({ error: "岗位编码已存在" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { postId: parseInt(id) },
      data: {
        code,
        name,
        sort,
        status,
        remark,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("更新岗位失败:", error);
    return NextResponse.json({ error: "更新岗位失败" }, { status: 500 });
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

    const userPosts = await prisma.userPost.count({
      where: { postId: parseInt(id) },
    });

    if (userPosts > 0) {
      return NextResponse.json(
        { error: "该岗位下有用户，无法删除" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { postId: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除岗位失败:", error);
    return NextResponse.json({ error: "删除岗位失败" }, { status: 500 });
  }
}
