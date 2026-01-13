import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        dept: true,
        userPosts: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nickname, phone, sex, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        nickname,
        phone,
        sex,
        avatar,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新用户信息失败:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
