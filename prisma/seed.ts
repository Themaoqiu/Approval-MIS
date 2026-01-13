import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 开始数据库初始化...");

  console.log("\n📁 初始化部门...");
  const departments = [
    { name: "人工智能学部", orderNum: 1 },
    { name: "经济与管理学院", orderNum: 2 },
    { name: "电气工程学部", orderNum: 3 },
    { name: "文科学部", orderNum: 4 },
  ];

  for (const dept of departments) {
    const existing = await prisma.department.findFirst({
      where: { name: dept.name }
    });
    if (!existing) {
      await prisma.department.create({ data: dept });
      console.log(`  ✅ 创建部门: ${dept.name}`);
    } else {
      console.log(`  ⏭️  部门已存在: ${dept.name}`);
    }
  }

  // 2. 创建基础岗位（学校相关）
  console.log("\n🏷️  初始化岗位...");
  const posts = [
    { code: "PRESIDENT", name: "校长", sort: 1 },
    { code: "DEAN", name: "学院院长", sort: 2 },
    { code: "PROFESSOR", name: "教授", sort: 3 },
    { code: "ASSOCIATE_PROF", name: "副教授", sort: 4 },
    { code: "LECTURER", name: "讲师", sort: 5 },
    { code: "HEAD_TEACHER", name: "辅导员", sort: 6 },
    { code: "ADMINISTRATOR", name: "管理员", sort: 7 },
  ];

  for (const post of posts) {
    const existing = await prisma.post.findFirst({
      where: { code: post.code }
    });
    if (!existing) {
      await prisma.post.create({ data: post });
      console.log(`  ✅ 创建岗位: ${post.name} (${post.code})`);
    } else {
      console.log(`  ⏭️  岗位已存在: ${post.name}`);
    }
  }

  // 3. 创建测试用户
  console.log("\n👥 初始化测试用户...");
  
  const aiDept = await prisma.department.findFirst({ where: { name: "人工智能学部" } });
  const econDept = await prisma.department.findFirst({ where: { name: "经济与管理学院" } });
  const electricDept = await prisma.department.findFirst({ where: { name: "电气工程学部" } });

  // 加密密码
  const hashedPassword = await bcrypt.hash("12345", 10);

  const users = [
    {
      id: "9Qu4tyHcZoOOMI82f5g0OF96k0qtVqs7",
      username: "test1",
      nickname: "test1",
      email: "test1@gmail.com",
      role: "admin",
      deptId: electricDept?.deptId || 5,
      sex: "0",
      status: "0",
      delFlag: "0",
      password: hashedPassword,
      emailVerified: false,
    },
    {
      id: "x7w5CpzV41HwhQuJ2M9Q7lCzuCVsB4P7",
      username: "test2",
      nickname: "test2",
      email: "test2@gmail.com",
      role: "approver",
      deptId: econDept?.deptId || 3,
      sex: "2",
      status: "0",
      delFlag: "0",
      password: hashedPassword,
      emailVerified: false,
    },
    {
      id: "yIvWUN3yU1l3UpufjtbwydosVHdnfotp",
      username: "test3",
      nickname: "test3",
      email: "test3@gmail.com",
      role: "user",
      deptId: econDept?.deptId || 3,
      sex: "2",
      status: "0",
      delFlag: "0",
      password: hashedPassword,
      emailVerified: false,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findFirst({
      where: { username: user.username }
    });
    if (!existing) {
      await prisma.user.create({ data: user });
      console.log(`  ✅ 创建用户: ${user.nickname} (${user.username}) - 角色: ${user.role}`);
    } else {
      console.log(`  ⏭️  用户已存在: ${user.username}`);
    }
  }

  // 4. 创建审批流程
  console.log("\n📋 初始化审批流程...");
  const processes = [
    {
      name: "请假审批流程",
      type: "leave",
      config: {
        steps: [
          { step: 0, name: "部门经理审批", approverType: "dept_leader" }
        ]
      },
      version: 1,
      isActive: true
    },
    {
      name: "报销审批流程",
      type: "reimbursement",
      config: {
        steps: [
          { step: 0, name: "部门经理审批", approverType: "dept_leader" }
        ]
      },
      version: 1,
      isActive: true
    }
  ];

  for (const process of processes) {
    const existing = await prisma.approvalProcess.findFirst({
      where: { type: process.type }
    });
    if (!existing) {
      await prisma.approvalProcess.create({ data: process });
      console.log(`  ✅ 创建审批流程: ${process.name} (type: ${process.type})`);
    } else {
      console.log(`  ⏭️  审批流程已存在: ${process.name}`);
    }
  }

  console.log("\n✨ 数据库初始化完成!");
  console.log("\n📝 测试账号信息:");
  console.log("  test1 (管理员): test1@gmail.com | 密码: 12345");
  console.log("  test2 (审批人): test2@gmail.com | 密码: 12345");
  console.log("  test3 (普通员工): test3@gmail.com | 密码: 12345");
}

main()
  .catch((e) => {
    console.error("❌ Seed 执行失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
