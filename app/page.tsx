"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.3, duration: 0.4 },
    }),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 dark:bg-slate-950">
      <motion.div
        className="w-full max-w-md p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full border shadow-sm dark:bg-card dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <CardTitle className="text-3xl font-bold dark:text-white">审批管理系统</CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <CardDescription className="text-base dark:text-slate-400">
                使用您的账号登录或注册
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              custom={0}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button 
                className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" 
                size="lg"
                onClick={() => router.push("/sign-in")}
              >
                登录
              </Button>
            </motion.div>
            <motion.div
              custom={1}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button 
                className="w-full dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800" 
                size="lg"
                variant="outline"
                onClick={() => router.push("/sign-up")}
              >
                创建账号
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
