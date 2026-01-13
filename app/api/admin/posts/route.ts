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
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("获取岗位列表失败:", error);
    return NextResponse.json({ error: "获取岗位列表失败" }, { status: 500 });
  }
}
