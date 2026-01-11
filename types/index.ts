import type { User, Application, ApprovalTask, Department, Post } from '@/lib/generated/prisma/client'

// 扩展类型
export type UserWithDept = User & {
  dept?: Department | null
}

export type ApplicationWithRelations = Application & {
  applicant: User
  tasks: ApprovalTask[]
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 认证相关
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  nickName?: string
}

export interface Session {
  user: {
    id: string
    email: string
    username: string
    role: string
  }
}
