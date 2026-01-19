import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const users = await auth.api.listUsers({
      query: {
        limit: 1000,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      headers: await headers(),
    });

    if (!users) {
      return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
    }

    const formatted = users.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      nickname: u.nickname,
      email: u.email,
      role: u.role,
      banned: Boolean(u.banned),
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: formatted });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, deptId, postIds, nickname, phone, sex, remark } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度至少为 6 位" },
        { status: 400 }
      );
    }

    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: role || "user",
        data: {
          ...(nickname && { nickname }),
          ...(phone && { phone }),
          ...(sex && { sex }),
          ...(deptId && { deptId }),
          ...(remark && { remark }),
          status: "0",
        },
      },
    });

    if (!newUser) {
      return NextResponse.json(
        { error: "创建用户失败" },
        { status: 500 }
      );
    }

    if (postIds && postIds.length > 0) {
      const prisma = (await import("@/lib/prisma")).default;
      await prisma.userPost.createMany({
        data: postIds.map((postId: number) => ({
          userId: newUser.user.id,
          postId,
        })),
      });
    }

    return NextResponse.json({
      message: "用户创建成功",
      userId: newUser.user.id,
    });
  } catch (error: any) {
    console.error("创建用户失败:", error);
    
    if (error.message?.includes("already exists")) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "创建用户失败" },
      { status: 500 }
    );
  }
}
