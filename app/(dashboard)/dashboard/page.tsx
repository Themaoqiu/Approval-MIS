"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-clients";
import { useEffect, useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentApplicationsList } from "@/components/dashboard/RecentApplicationsList";
import { RoleInfo } from "@/components/dashboard/RoleInfo";

interface DashboardStatsData {
  pending: number;
  processed: number;
  total: number;
  systemTotal?: number;
  pendingApprovals?: number;
  processedApprovals?: number;
  userRole: string;
  recentApplications: Array<{
    id: number;
    type: string;
    title: string;
    status: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isUser, isApprover, isAdmin } = usePermissions();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user)
    return <p className="text-center mt-8 text-white">Redirecting...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        仪表板
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <DashboardStats
          pending={stats?.pending ?? 0}
          processed={stats?.processed ?? 0}
          total={stats?.total ?? 0}
          systemTotal={stats?.systemTotal ?? 0}
          pendingApprovals={stats?.pendingApprovals ?? 0}
          processedApprovals={stats?.processedApprovals ?? 0}
          isUser={isUser}
          isApprover={isApprover}
          isAdmin={isAdmin}
          loading={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <RecentApplicationsList
          applications={stats?.recentApplications ?? []}
          loading={loading}
          isAdmin={isAdmin}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <RoleInfo isAdmin={isAdmin} isApprover={isApprover} isUser={isUser} />
      </motion.div>
    </motion.div>
  );
}
