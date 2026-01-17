"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8">
        <Card className="w-full border shadow-sm">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold">审批管理系统</CardTitle>
            <CardDescription className="text-base">
              使用您的账号登录或注册
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => router.push("/sign-in")}
            >
              登录
            </Button>
            <Button 
              className="w-full" 
              size="lg"
              variant="outline"
              onClick={() => router.push("/sign-up")}
            >
              创建账号
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
