"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signUp } from "@/lib/auth-clients";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const nickName = formData.get("nickName") as string;

    if (password !== confirmPassword) {
      setError("两次输入的密码不匹配");
      setLoading(false);
      return;
    }

    const formValues = await signUp.email({
      name: formData.get("username") as string,
      email: formData.get("email") as string,
      password: password,
    });

    setLoading(false);

    if (formValues.error) {
      setError(formValues.error.message || "注册失败");
    } else {
      toast.success("注册成功，请登录");
      // 使用 replace 而不是 push，防止后退
      router.replace("/sign-in");
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">注册</h1>
        <p className="text-sm text-muted-foreground mt-2">
          创建新账号开始使用系统
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            用户名 *
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入用户名"
          />
        </div>

        <div>
          <label htmlFor="nickName" className="block text-sm font-medium mb-2">
            昵称
          </label>
          <input
            id="nickName"
            name="nickName"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入昵称（可选）"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            邮箱 *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            密码 *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="至少 6 位"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            确认密码 *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="再次输入密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">已有账号？</span>{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          立即登录
        </Link>
      </div>
    </div>
  );
}
