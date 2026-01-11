import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"

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
      maxAge: 5 * 60, // 5 minutes
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
  trustedOrigins: ["http://localhost:3000"],
})
