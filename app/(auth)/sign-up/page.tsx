import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignUpForm from "../../../components/SignUpForm";

export default async function SignUpPage() {
  // 检查用户是否已登录
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 如果已登录，重定向到仪表盘
  if (session) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
