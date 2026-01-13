"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const pathname = usePathname();
  const { isUser, isApprover, isAdmin } = usePermissions();

  const baseNavItems = [
    { name: "仪表板", href: "/dashboard" },
    { name: "新建申请", href: "/applications/new" },
    { name: "我的申请", href: "/applications/my" },
  ];

  const approverNavItems = [
    { name: "审批", href: "/approvals/tasks" },
  ];

  const adminNavItems = [
    { name: "用户管理", href: "/admin/users" },
    { name: "部门管理", href: "/admin/departments" },
    { name: "所有申请", href: "/admin/applications" },
  ];

  return (
    <aside className="w-64 bg-card border-r">
      <div className="p-6">
        <h2 className="text-xl font-bold">审批系统</h2>
        {isAdmin && (
          <p className="text-xs text-muted-foreground mt-1">管理员</p>
        )}
        {isApprover && !isAdmin && (
          <p className="text-xs text-muted-foreground mt-1">审批人</p>
        )}
      </div>
      <nav className="px-4">
        <div>
          {baseNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md mb-1 ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {(isApprover || isAdmin) && (
          <>
            <Separator className="my-3" />
            <div>
              {approverNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md mb-1 ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <Separator className="my-3" />
            <div>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md mb-1 ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
