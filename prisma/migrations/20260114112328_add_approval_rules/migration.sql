-- CreateTable
CREATE TABLE "ApprovalRule" (
    "ruleId" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "applicantDeptId" INTEGER,
    "applicantPostId" INTEGER,
    "approverDeptId" INTEGER,
    "approverPostId" INTEGER,
    "specificUserIds" TEXT,
    "approvalMode" VARCHAR(20) NOT NULL DEFAULT 'sequential',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(64),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRule_pkey" PRIMARY KEY ("ruleId")
);

-- CreateIndex
CREATE INDEX "ApprovalRule_processId_isActive_idx" ON "ApprovalRule"("processId", "isActive");

-- CreateIndex
CREATE INDEX "ApprovalRule_applicantDeptId_applicantPostId_idx" ON "ApprovalRule"("applicantDeptId", "applicantPostId");

-- AddForeignKey
ALTER TABLE "ApprovalRule" ADD CONSTRAINT "ApprovalRule_processId_fkey" FOREIGN KEY ("processId") REFERENCES "ApprovalProcess"("processId") ON DELETE CASCADE ON UPDATE CASCADE;
