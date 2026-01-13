import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const form = await prisma.formTemplate.findUnique({
    where: { formId: parseInt(id) },
  });

  if (!form) {
    return NextResponse.json({ error: "表单不存在" }, { status: 404 });
  }

  return NextResponse.json(form);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, category, schema, isActive, remark } = body;

  const form = await prisma.formTemplate.update({
    where: { formId: parseInt(id) },
    data: {
      name,
      category,
      schema,
      isActive,
      remark,
      updatedBy: session.user.id,
    },
  });

  return NextResponse.json(form);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  const form = await prisma.formTemplate.findUnique({
    where: { formId: parseInt(id) },
  });

  if (form?.isSystem) {
    return NextResponse.json({ error: "系统表单不能删除" }, { status: 400 });
  }

  await prisma.formTemplate.delete({
    where: { formId: parseInt(id) },
  });

  return NextResponse.json({ success: true });
}
