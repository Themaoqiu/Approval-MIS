import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const deptId = searchParams.get("deptId");

  const users = await prisma.user.findMany({
    where: {
      delFlag: "0",
      status: "0",
      ...(query && {
        OR: [
          { username: { contains: query } },
          { nickname: { contains: query } },
          { email: { contains: query } },
        ],
      }),
      ...(deptId && { deptId: parseInt(deptId) }),
    },
    include: {
      dept: true,
      userPosts: {
        include: { post: true },
      },
    },
    take: 50,
  });

  const result = users.map((user) => ({
    id: user.id,
    username: user.username,
    name: user.nickname || user.username,
    email: user.email,
    dept: user.dept?.name,
    deptId: user.deptId,
    posts: user.userPosts.map((up) => up.post.name),
    avatar: user.avatar,
  }));

  return NextResponse.json({ users: result });
}
