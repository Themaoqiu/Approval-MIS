import prisma from "../lib/prisma";

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

  // 3. 创建审批流程
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

  const createdProcesses = [];
  for (const process of processes) {
    const existing = await prisma.approvalProcess.findFirst({
      where: { type: process.type }
    });
    if (!existing) {
      const created = await prisma.approvalProcess.create({ data: process });
      createdProcesses.push(created);
      console.log(`  ✅ 创建审批流程: ${process.name} (type: ${process.type})`);
    } else {
      createdProcesses.push(existing);
      console.log(`  ⏭️  审批流程已存在: ${process.name}`);
    }
  }

  // 4. 创建示例审批规则
  console.log("\n⚙️  初始化审批规则...");
  
  // 获取部门和岗位
  const aiDept = await prisma.department.findFirst({ where: { name: "人工智能学部" } });
  const headTeacherPost = await prisma.post.findFirst({ where: { code: "HEAD_TEACHER" } });
  
  if (aiDept && headTeacherPost && createdProcesses.length > 0) {
    const leaveProcess = createdProcesses.find(p => p.type === "leave");
    
    const existingRule = await prisma.approvalRule.findFirst({
      where: {
        processId: leaveProcess?.processId,
        name: "AI学部请假规则"
      }
    });
    
    if (!existingRule && leaveProcess) {
      await prisma.approvalRule.create({
        data: {
          processId: leaveProcess.processId,
          name: "AI学部请假规则",
          description: "人工智能学部学生请假申请,需要提交给对应辅导员审批",
          applicantDeptId: aiDept.deptId,
          approverPostId: headTeacherPost.postId,
          approvalMode: "sequential",
          priority: 10,
          isActive: true,
        }
      });
      console.log(`  ✅ 创建审批规则: AI学部请假规则`);
    } else {
      console.log(`  ⏭️  审批规则已存在: AI学部请假规则`);
    }
  }

  console.log("\n✨ 数据库初始化完成!");
  console.log("\n📝 提示:");
  console.log("  - 部门和岗位数据已初始化");
  console.log("  - 审批流程已创建");
  console.log("  - 示例审批规则已创建");
  console.log("  - 请登录系统后在'审批规则'页面配置更多规则");
  console.log("  - 例如: 为其他部门添加审批规则,指定不同岗位的审批人");
}

main()
  .catch((e) => {
    console.error("❌ Seed 执行失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
