"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { authClient } from "@/lib/auth-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("两次输入的密码不匹配");
      setLoading(false);
      return;
    }

    const formValues = await authClient.signUp.email({
      name: username,
      email: email,
      password: password,
    });

    setLoading(false);

    if (formValues.error) {
      setError(formValues.error.message || "注册失败");
    } else {
      toast.success("注册成功，请登录");
      router.replace("/sign-in");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google 注册失败:", error);
      toast.error("Google 注册失败");
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("GitHub 注册失败:", error);
      toast.error("GitHub 注册失败");
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="flex items-center justify-center text-center p-3">
        <CardTitle className="text-4xl">
          创建新账号
        </CardTitle>
      </CardHeader>

      <div className="px-7 mb-2">
        <Separator />
      </div>

      <CardContent className="">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Input
              id="username"
              type="text"
              placeholder="输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

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

          <div>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "注册中..." : "注册"}
          </Button>
        </form>
      </CardContent>

      <div>
        <Separator />
      </div>

      <CardContent className=" flex flex-col gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <FcGoogle className="mr-2 size-5" />
          使用 Google 注册
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleGithubSignUp}
          disabled={loading}
        >
          <FaGithub className="mr-2 size-5" />
          使用 GitHub 注册
        </Button>
      </CardContent>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="flex items-center justify-center">
        <p>
          已有账号？
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp;立即登录</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
