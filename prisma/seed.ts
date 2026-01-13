import prisma from "../lib/prisma";

async function main() {
  console.log("🌱 开始初始化审批流程...");

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
    // 检查是否已存在（防止重复插入）
    const existing = await prisma.approvalProcess.findFirst({
      where: { type: process.type }
    });

    if (!existing) {
      await prisma.approvalProcess.create({
        data: process
      });
      console.log(`✅ 已创建审批流程: ${process.name} (type: ${process.type})`);
    } else {
      console.log(`⏭️  审批流程已存在: ${process.name} (type: ${process.type})，跳过创建`);
    }
  }

  console.log("✨ 审批流程初始化完成!");
}

main()
  .catch((e) => {
    console.error("❌ Seed 执行失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
