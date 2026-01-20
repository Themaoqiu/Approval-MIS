"use client";

import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, FolderOpen, ClipboardList, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  pending: number;
  processed: number;
  total: number;
  systemTotal?: number;
  pendingApprovals?: number;
  processedApprovals?: number;
  isUser: boolean;
  isApprover: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function DashboardStats({
  pending,
  processed,
  total,
  systemTotal,
  pendingApprovals,
  processedApprovals,
  isUser,
  isApprover,
  isAdmin,
  loading,
}: DashboardStatsProps) {
  const showApproverStats = isApprover || isAdmin;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                我的待处理
              </h3>
              <motion.p
                className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                key={pending}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? "-" : pending}
              </motion.p>
            </div>
            <motion.div
              className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                我的已处理
              </h3>
              <motion.p
                className="text-3xl font-bold text-green-600 dark:text-green-400"
                key={processed}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? "-" : processed}
              </motion.p>
            </div>
            <motion.div
              className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </motion.div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                我的所有申请
              </h3>
              <motion.p
                className="text-3xl font-bold text-purple-600 dark:text-purple-400"
                key={total}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? "-" : total}
              </motion.p>
            </div>
            <motion.div
              className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {showApproverStats && (
        <>
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    系统总申请
                  </h3>
                  <motion.p
                    className="text-3xl font-bold text-yellow-600 dark:text-yellow-400"
                    key={systemTotal}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loading ? "-" : systemTotal ?? 0}
                  </motion.p>
                </div>
                <motion.div
                  className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FolderOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    待审批
                  </h3>
                  <motion.p
                    className="text-3xl font-bold text-orange-600 dark:text-orange-400"
                    key={pendingApprovals}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loading ? "-" : pendingApprovals ?? 0}
                  </motion.p>
                </div>
                <motion.div
                  className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    已审批
                  </h3>
                  <motion.p
                    className="text-3xl font-bold text-teal-600 dark:text-teal-400"
                    key={processedApprovals}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loading ? "-" : processedApprovals ?? 0}
                  </motion.p>
                </div>
                <motion.div
                  className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}