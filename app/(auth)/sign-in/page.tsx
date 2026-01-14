import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "../../../components/SignInForm";

export default async function SignInPage() {
  // 检查用户是否已登录
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 如果已登录，重定向到仪表盘
  if (session) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
