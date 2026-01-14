"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Home,
  FileText,
  ClipboardList,
  CheckSquare,
  Users,
  Building2,
  FolderKanban,
  ChevronRight,
  Briefcase,
  BarChart3,
  FileEdit,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isApprover, isAdmin } = usePermissions();

  const baseNavItems = [
    { name: "仪表板", href: "/dashboard", icon: Home },
    { name: "发起申请", href: "/applications/new", icon: FileText },
    { name: "我的申请", href: "/applications/my", icon: ClipboardList },
  ];

  const approverNavItems = [
    { name: "审批任务", href: "/approvals/tasks", icon: CheckSquare },
  ];

  const statisticsNavItems = [
    { name: "个人统计", href: "/statistics/personal", icon: BarChart3 },
  ];

  const adminStatisticsNavItems = [
    { name: "部门统计", href: "/admin/statistics/department", icon: BarChart3 },
  ];

  const adminTopLevelNavItems = [
    { name: "所有申请", href: "/admin/applications", icon: FolderKanban },
    { name: "表单设计", href: "/admin/forms", icon: FileEdit },
    { name: "审批规则", href: "/admin/approval-rules", icon: CheckSquare },
  ];

  const adminSystemNavItems = [
    { name: "用户管理", href: "/admin/users", icon: Users },
    { name: "部门管理", href: "/admin/departments", icon: Building2 },
    { name: "岗位管理", href: "/admin/posts", icon: Briefcase },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className="truncate font-semibold text-sm">审批管理系统</span>
                  {isAdmin && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 shrink-0">
                      管理员
                    </Badge>
                  )}
                  {!isAdmin && isApprover && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shrink-0">
                      审批员
                    </Badge>
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>工作区</SidebarGroupLabel>
          <SidebarMenu>
            {baseNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {(isApprover || isAdmin) &&
              approverNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>统计分析</SidebarGroupLabel>
          <SidebarMenu>
            {statisticsNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {isAdmin &&
              adminStatisticsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>系统</SidebarGroupLabel>
            <SidebarMenu>
              {adminTopLevelNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="系统管理">
                      <Building2 />
                      <span>系统管理</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {adminSystemNavItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(item.href)}
                          >
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
