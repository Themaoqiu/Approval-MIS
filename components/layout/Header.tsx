"use client";

import { useSession, signOut } from "@/lib/auth-clients";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const { user } = session;

  const handleSignOut = async () => {
    await signOut();
    toast.success("已退出登录");
    router.push("/sign-in");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">审批管理系统</h1>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-16 w-16 mb-3">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm">
                {user.name || "未命名用户"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/settings/profile")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              个人信息设置
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              variant="destructive"
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
