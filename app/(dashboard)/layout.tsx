"use client";

import AppSidebar from "@/components/layout/Sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const getBreadcrumbs = (pathname: string) => {
  const pathMap: Record<string, { label: string; parent?: string }> = {
    "/dashboard": { label: "仪表板" },
    "/applications/new": { label: "新建申请", parent: "申请管理" },
    "/applications/my": { label: "我的申请", parent: "申请管理" },
    "/approvals/tasks": { label: "审批任务", parent: "审批管理" },
    "/statistics/personal": { label: "个人统计", parent: "统计分析" },
    "/admin/users": { label: "用户管理", parent: "系统管理" },
    "/admin/departments": { label: "部门管理", parent: "系统管理" },
    "/admin/posts": { label: "岗位管理", parent: "系统管理" },
    "/admin/applications": { label: "所有申请", parent: "系统管理" },
    "/admin/forms": { label: "表单管理", parent: "系统管理" },
    "/admin/forms/new": { label: "新建表单", parent: "表单管理" },
    "/admin/statistics/department": { label: "部门统计", parent: "统计分析" },
  };

  if (pathname.startsWith("/admin/forms/") && pathname.endsWith("/edit")) {
    return { parent: "表单管理", current: "编辑表单" };
  }

  const current = pathMap[pathname];
  if (!current) return null;

  return {
    parent: current.parent,
    current: current.label,
  };
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.parent && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          {breadcrumbs.parent}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbs.current}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )}
            <div className="ml-auto">
              <Header />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
        <Toaster position="top-right" richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
