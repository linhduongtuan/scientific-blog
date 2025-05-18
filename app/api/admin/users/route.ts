import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from '@prisma/client';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// Extend the next-auth session types
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      subscribed?: boolean;
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as {
      user?: {
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: string;
        subscribed?: boolean;
      }
    } | null;

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        subscribed: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}