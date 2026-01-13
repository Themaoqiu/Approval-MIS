-- CreateTable
CREATE TABLE "FormTemplate" (
    "formId" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "schema" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(64),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("formId")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "statId" SERIAL NOT NULL,
    "userId" TEXT,
    "deptId" INTEGER,
    "statType" VARCHAR(20) NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "metrics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("statId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormTemplate_code_key" ON "FormTemplate"("code");

-- CreateIndex
CREATE INDEX "FormTemplate_category_isActive_idx" ON "FormTemplate"("category", "isActive");

-- CreateIndex
CREATE INDEX "Statistics_userId_period_date_idx" ON "Statistics"("userId", "period", "date");

-- CreateIndex
CREATE INDEX "Statistics_deptId_period_date_idx" ON "Statistics"("deptId", "period", "date");
