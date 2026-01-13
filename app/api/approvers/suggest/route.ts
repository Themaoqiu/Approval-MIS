import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await req.json();
  const { assignType, userId, deptId, postIds } = body;

  let approvers: any[] = [];

  switch (assignType) {
    case "dept_leader":
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { dept: true },
        });
        if (user?.dept?.leader) {
          const leader = await prisma.user.findFirst({
            where: { username: user.dept.leader },
            include: { dept: true },
          });
          if (leader) {
            approvers.push({
              id: leader.id,
              name: leader.nickname || leader.username,
              dept: leader.dept?.name,
              avatar: leader.avatar,
            });
          }
        }
      } else if (deptId) {
        const dept = await prisma.department.findUnique({
          where: { deptId },
        });
        if (dept?.leader) {
          const leader = await prisma.user.findFirst({
            where: { username: dept.leader },
            include: { dept: true },
          });
          if (leader) {
            approvers.push({
              id: leader.id,
              name: leader.nickname || leader.username,
              dept: leader.dept?.name,
              avatar: leader.avatar,
            });
          }
        }
      }
      break;

    case "post":
      if (postIds && postIds.length > 0) {
        const userPosts = await prisma.userPost.findMany({
          where: { postId: { in: postIds } },
          include: {
            user: {
              include: { dept: true },
            },
            post: true,
          },
        });
        approvers = userPosts.map((up) => ({
          id: up.user.id,
          name: up.user.nickname || up.user.username,
          dept: up.user.dept?.name,
          post: up.post.name,
          avatar: up.user.avatar,
        }));
      }
      break;

    case "direct_superior":
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            dept: {
              include: { parent: true },
            },
          },
        });
        if (user?.dept?.parentId) {
          const parentDept = await prisma.department.findUnique({
            where: { deptId: user.dept.parentId },
          });
          if (parentDept?.leader) {
            const leader = await prisma.user.findFirst({
              where: { username: parentDept.leader },
              include: { dept: true },
            });
            if (leader) {
              approvers.push({
                id: leader.id,
                name: leader.nickname || leader.username,
                dept: leader.dept?.name,
                avatar: leader.avatar,
              });
            }
          }
        }
      }
      break;
  }

  return NextResponse.json({ approvers });
}
