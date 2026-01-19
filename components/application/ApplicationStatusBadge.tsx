import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function ApplicationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, any> = {
    pending: { variant: "secondary", label: "待审批" },
    approved: { variant: "default", label: "已通过" },
    rejected: { variant: "destructive", label: "已拒绝" },
    withdrawn: { variant: "outline", label: "已撤回" }
  };

  const config = variants[status] || { variant: "outline", label: status };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Badge variant={config.variant} className="dark:opacity-90">
        {config.label}
      </Badge>
    </motion.div>
  );
}
