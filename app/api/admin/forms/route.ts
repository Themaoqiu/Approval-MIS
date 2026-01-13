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
  const category = searchParams.get("category");
  const isActive = searchParams.get("isActive");

  const forms = await prisma.formTemplate.findMany({
    where: {
      ...(category && { category }),
      ...(isActive && { isActive: isActive === "true" }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ forms });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await req.json();
  const { name, code, category, schema, remark } = body;

  const existing = await prisma.formTemplate.findUnique({
    where: { code },
  });

  if (existing) {
    return NextResponse.json({ error: "表单编码已存在" }, { status: 400 });
  }

  const form = await prisma.formTemplate.create({
    data: {
      name,
      code,
      category,
      schema,
      remark,
      createdBy: session.user.id,
    },
  });

  return NextResponse.json(form);
}
