"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Application {
  id: number;
  type: string;
  title: string;
  status: string;
  date: string;
}

interface RecentApplicationsListProps {
  applications: Application[];
  loading: boolean;
  isAdmin: boolean;
}

export function RecentApplicationsList({
  applications,
  loading,
  isAdmin,
}: RecentApplicationsListProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "待审批";
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      case "withdrawn":
        return "已撤回";
      default:
        return status;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 dark:bg-card/50 dark:hover:bg-card/70 backdrop-blur-sm">
        <motion.h2
          className="text-xl font-semibold mb-4 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {isAdmin ? "最近的申请（全部）" : "最近的申请"}
        </motion.h2>
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground dark:text-slate-400">加载中...</p>
          ) : applications && applications.length > 0 ? (
            applications.map((app, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <div className="flex justify-between py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md px-2 transition-colors duration-200">
                  <div>
                    <motion.p
                      className="font-medium dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      {app.title}
                    </motion.p>
                    <motion.p
                      className="text-xs text-muted-foreground dark:text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.15 }}
                    >
                      {app.type}
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Badge
                      variant={
                        app.status === "pending"
                          ? "secondary"
                          : app.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                      className="dark:opacity-90"
                    >
                      {getStatusLabel(app.status)}
                    </Badge>
                  </motion.div>
                </div>
                {index < applications.length - 1 && (
                  <Separator className="my-2 dark:opacity-20" />
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground dark:text-slate-400">暂无申请</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
