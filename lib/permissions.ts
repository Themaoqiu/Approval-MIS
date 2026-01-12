import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

export const statement = {
  ...defaultStatements,
  application: ["create", "view", "update", "delete", "withdraw"],
  approval: ["view", "approve", "reject", "comment"],
  process: ["create", "update", "delete", "view"],
} as const

export const ac = createAccessControl(statement)

export const userRole = ac.newRole({
  application: ["create", "view", "update", "delete", "withdraw"],
  approval: [],
  process: [],
})

export const approverRole = ac.newRole({
  application: ["view"],
  approval: ["view", "approve", "reject", "comment"],
  process: [],
})

export const adminRole = ac.newRole({
  ...adminAc.statements,
  application: ["create", "view", "update", "delete", "withdraw"],
  approval: ["view", "approve", "reject", "comment"],
  process: ["create", "update", "delete", "view"],
})
