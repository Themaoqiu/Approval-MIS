"use client";

import { useSession, authClient } from "@/lib/auth-clients";

export function usePermissions() {
  const { data: session } = useSession();
  const user = session?.user;

  const isUser = user?.role === "user";
  const isApprover = user?.role === "approver";
  const isAdmin = user?.role === "admin";

  const hasPermission = async (
    resource: "application" | "approval" | "process" | "user",
    action: string
  ): Promise<boolean> => {
    if (!user?.role) return false;

    try {
      const result = await authClient.admin.checkRolePermission({
        role: user.role as "user" | "approver" | "admin",
        permission: {
          [resource]: [action],
        } as any,
      });

      return result ?? false;
    } catch (error) {
      console.error("Permission check failed:", error);
      return false;
    }
  };

  // 申请相关权限
  const canCreateApplication = () => hasPermission("application", "create");
  const canViewOwnApplications = () => hasPermission("application", "view");
  const canEditOwnApplication = () => hasPermission("application", "edit");
  const canDeleteOwnApplication = () => hasPermission("application", "delete");
  const canViewAllApplications = () =>
    hasPermission("application", "view_all");

  // 审批相关权限
  const canApprove = () => hasPermission("approval", "approve");
  const canReject = () => hasPermission("approval", "reject");
  const canViewAssignedApprovals = () => hasPermission("approval", "view");
  const canViewAllApprovals = () => hasPermission("approval", "view_all");

  // 流程管理权限
  const canManageProcesses = () => hasPermission("process", "manage");
  const canViewProcesses = () => hasPermission("process", "view");

  // 用户管理权限（仅管理员）
  const canManageUsers = async () => {
    if (!isAdmin) return false;
    return hasPermission("user", "manage");
  };

  return {
    user,
    isUser,
    isApprover,
    isAdmin,
    hasPermission,
    canCreateApplication,
    canViewOwnApplications,
    canEditOwnApplication,
    canDeleteOwnApplication,
    canViewAllApplications,
    canApprove,
    canReject,
    canViewAssignedApprovals,
    canViewAllApprovals,
    canManageProcesses,
    canViewProcesses,
    canManageUsers,
  };
}
