import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"
import prisma from "./prisma"
import { ac, userRole, approverRole, adminRole } from "./permissions"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    modelName: "user",
    fields: {
        name: "username",
    },
    additionalFields: {
        nickname: {
            type: "string",
            required: false,
            input: true,
        }
    }
  },
  plugins: [
    admin({
      defaultRole: "user",
      ac,
      roles: {
        user: userRole,
        approver: approverRole,
        admin: adminRole,
      }
    })
  ],
  trustedOrigins: ["http://localhost:3000"],
})
