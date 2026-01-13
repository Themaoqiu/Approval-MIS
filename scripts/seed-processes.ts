import prisma from "../lib/prisma";

async function main() {
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

  const existing = await prisma.approvalProcess.findMany();
  if (existing.length === 0) {
    await prisma.approvalProcess.createMany({
      data: processes
    });
  }

  console.log("✅ 审批流程初始化完成");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
