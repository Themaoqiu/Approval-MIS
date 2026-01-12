import { auth } from "./auth";
import { NextRequest } from "next/server";


export async function getSessionUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return null;
  }

  return session.user;
}


export async function checkPermission(
  request: NextRequest,
  resource: "application" | "approval" | "process" | "user",
  actions: string[]
): Promise<{ hasPermission: boolean; user: any | null }> {
  const user = await getSessionUser(request);

  if (!user?.role) {
    return { hasPermission: false, user: null };
  }

  try {
    const result = await auth.api.userHasPermission({
      body: {
        role: user.role as "user" | "approver" | "admin",
        permission: {
          [resource]: actions,
        } as any,
      },
    });

    return {
      hasPermission: result?.success ?? false,
      user,
    };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { hasPermission: false, user };
  }
}

/**
 * 检查用户是否可以访问资源
 * @param user 用户对象
 * @param resourceOwnerId 资源所有者ID
 * @param allowedRoles 允许访问的角色
 */
export function canAccessResource(
  user: any,
  resourceOwnerId: string,
  allowedRoles: string[] = ["admin"]
): boolean {
  if (!user) 
    return false;

  if (allowedRoles.includes(user.role)) 
    return true;

  return user.id === resourceOwnerId;
}


export function unauthorizedResponse(message = "未授权") {
  return Response.json({ error: message }, { status: 401 });
}


export function forbiddenResponse(message = "无权访问") {
  return Response.json({ error: message }, { status: 403 });
}
