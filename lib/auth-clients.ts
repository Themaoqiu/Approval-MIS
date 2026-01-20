import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'
import { ac, userRole, approverRole, adminRole } from './permissions'

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        user: userRole,
        approver: approverRole,
        admin: adminRole,
      }
    })
  ]
})

export const { signIn, signUp, signOut, useSession,changePassword } = authClient

export { authClient }