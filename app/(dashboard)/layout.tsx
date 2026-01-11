"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: "仪表板", href: "/dashboard" },
    { name: "我的申请", href: "/dashboard/applications" },
    { name: "我的待办", href: "/dashboard/tasks" },
    { name: "我已处理", href: "/dashboard/approvals" },
    { name: "统计", href: "/dashboard/statistics" },
  ]

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">审批系统</h2>
        </div>
        <nav className="px-4">
          {navItems.map((item) => (
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
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1">

        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
