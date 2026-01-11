"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">审批管理系统</h1>
        <p className="text-muted-foreground mb-8">Approval Management Information System</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/sign-in")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            登录
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-6 py-3 border border-input rounded-md hover:bg-accent"
          >
            注册
          </button>
        </div>
      </div>
    </div>
  )
}
