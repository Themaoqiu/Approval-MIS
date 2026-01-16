import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        role: true,
        status: true,
        banned: true,
        createdAt: true,
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.username,
      nickname: u.nickname,
      email: u.email,
      role: u.role,
      status: u.status,
      banned: Boolean(u.banned),
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: formatted });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}
