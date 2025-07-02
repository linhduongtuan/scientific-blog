import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { SignUpInput } from "./validation";
import { Session } from "next-auth";

export type UserSession = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  subscribed?: boolean;
};

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  // Retrieve complete user data from the database
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        subscribed: true
      }
    });
    
    if (!user) {
      return null;
    }
    
    return user as UserSession;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdmin(): Promise<UserSession> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return user;
}

export async function requireSubscription(): Promise<UserSession> {
  const user = await requireAuth();
  if (!user.subscribed) {
    throw new Error("Subscription required");
  }
  return user;
}

export async function createUser(data: SignUpInput) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

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