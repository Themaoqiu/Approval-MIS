import { Badge } from "@/components/ui/badge";

export function ApplicationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, any> = {
    pending: { variant: "secondary", label: "待审批" },
    approved: { variant: "default", label: "已通过" },
    rejected: { variant: "destructive", label: "已拒绝" },
    withdrawn: { variant: "outline", label: "已撤回" }
  };

  const config = variants[status] || { variant: "outline", label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
