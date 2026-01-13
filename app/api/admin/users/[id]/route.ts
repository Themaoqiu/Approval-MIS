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
    const userInfo = await prisma.user.findUnique({
      where: { id },
      include: {
        dept: true,
        userPosts: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!userInfo) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
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
    const {
      username,
      nickname,
      email,
      phone,
      sex,
      avatar,
      status,
      deptId,
      remark,
      postIds,
    } = body;

    // 开启事务更新用户和岗位
    const updated = await prisma.$transaction(async (tx) => {
      // 更新用户信息
      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          username,
          nickname,
          email,
          phone,
          sex,
          avatar,
          status,
          deptId,
          remark,
          updatedBy: user.id,
        },
      });

      // 更新岗位关系
      if (postIds !== undefined) {
        // 删除旧的岗位关系
        await tx.userPost.deleteMany({
          where: { userId: id },
        });

        // 添加新的岗位关系
        if (postIds.length > 0) {
          await tx.userPost.createMany({
            data: postIds.map((postId: number) => ({
              userId: id,
              postId,
            })),
          });
        }
      }

      return updatedUser;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新用户信息失败:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
