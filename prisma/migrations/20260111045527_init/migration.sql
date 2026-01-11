-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "nickName" VARCHAR(30),
    "userType" VARCHAR(2) DEFAULT '00',
    "email" VARCHAR(50),
    "phone" VARCHAR(11),
    "password" VARCHAR(100) NOT NULL,
    "avatar" VARCHAR(100),
    "sex" CHAR(1),
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "delFlag" CHAR(1) NOT NULL DEFAULT '0',
    "role" TEXT NOT NULL DEFAULT 'user',
    "deptId" INTEGER,
    "loginIp" VARCHAR(128),
    "loginDate" TIMESTAMP(3),
    "createdBy" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(64),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Department" (
    "deptId" SERIAL NOT NULL,
    "parentId" INTEGER,
    "ancestors" VARCHAR(50),
    "name" VARCHAR(30) NOT NULL,
    "orderNum" INTEGER NOT NULL DEFAULT 0,
    "leader" VARCHAR(20),
    "phone" VARCHAR(11),
    "email" VARCHAR(50),
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "delFlag" CHAR(1) NOT NULL DEFAULT '0',
    "createdBy" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(64),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("deptId")
);

-- CreateTable
CREATE TABLE "Post" (
    "postId" SERIAL NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" CHAR(1) NOT NULL DEFAULT '0',
    "createdBy" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(64),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "UserPost" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "Application" (
    "applyId" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "processId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("applyId")
);

-- CreateTable
CREATE TABLE "ApprovalProcess" (
    "processId" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "config" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalProcess_pkey" PRIMARY KEY ("processId")
);

-- CreateTable
CREATE TABLE "ApprovalTask" (
    "taskid" SERIAL NOT NULL,
    "applyId" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "approverId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "comment" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalTask_pkey" PRIMARY KEY ("taskid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Post_code_key" ON "Post"("code");

-- CreateIndex
CREATE INDEX "ApprovalTask_approverId_status_idx" ON "ApprovalTask"("approverId", "status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Department"("deptId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("deptId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_processId_fkey" FOREIGN KEY ("processId") REFERENCES "ApprovalProcess"("processId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalTask" ADD CONSTRAINT "ApprovalTask_applyId_fkey" FOREIGN KEY ("applyId") REFERENCES "Application"("applyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalTask" ADD CONSTRAINT "ApprovalTask_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
