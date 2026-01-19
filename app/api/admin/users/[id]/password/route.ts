import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { newPassword } = body;
    const { id: userId } = await params;

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "密码长度至少为 6 位" },
        { status: 400 }
      );
    }

    const data = await auth.api.setUserPassword({
      body: {
        newPassword,
        userId,
      },
      headers: await headers(),
    });

    if (!data) {
      return NextResponse.json(
        { error: "修改密码失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "密码修改成功",
    });
  } catch (error) {
    console.error("修改密码失败:", error);
    return NextResponse.json(
      { error: "修改密码失败" },
      { status: 500 }
    );
  }
}
