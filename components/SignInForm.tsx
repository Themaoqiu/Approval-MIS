"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-clients";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "登录失败");
    } else {
      toast.success("登录成功");
      router.replace("/dashboard");
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google 登录暂未开放");
  };

  const handleGithubSignIn = () => {
    toast.info("GitHub 登录暂未开放");
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="flex items-center justify-center text-center p-3">
        <CardTitle className="text-4xl">
          欢迎回来！
        </CardTitle>
      </CardHeader>
      <div className="px-7 ">
        <Separator />
      </div>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Input
              id="email"
              type="email"
              placeholder="输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Input
              id="password"
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>

      <CardContent className=" flex flex-col gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="mr-2 size-5" />
          使用 Google 登录
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleGithubSignIn}
          disabled={loading}
        >
          <FaGithub className="mr-2 size-5" />
          使用 GitHub 登录
        </Button>
      </CardContent>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="flex items-center justify-center">
        <p>
          还没有账号？
          <Link href="/sign-up">
            <span className="text-blue-700">&nbsp;注册新账号</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
