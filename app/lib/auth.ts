// Temporarily disabled NextAuth imports for build fix
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "./prisma"
import bcrypt from "bcrypt"
import { SignUpInput } from "./validation"

export async function getCurrentUser() {
  // Mock implementation
  return null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if ((user as any)?.role !== "ADMIN") {
    throw new Error("Admin access required")
  }
  return user
}

export async function requireSubscription() {
  const user = await requireAuth()
  if (!(user as any)?.subscribed) {
    throw new Error("Subscription required")
  }
  return user
}

export async function createUser(data: SignUpInput) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "USER",
      subscribed: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscribed: true,
      createdAt: true
    }
  })

  return user
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}