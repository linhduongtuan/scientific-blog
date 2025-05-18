import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
// Remove the external import since we have the function defined in this file

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = params;
    const data = await req.json();

    // Validate user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    // If subscription was activated, send confirmation email
    if (data.subscribed === true && !existingUser.subscribed) {
      await sendSubscriptionConfirmationEmail(
        existingUser.email,
        existingUser.name || "User"
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscribed: updatedUser.subscribed,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This function is now defined here instead of being imported
export async function sendSubscriptionConfirmationEmail(email: string, name: string) {
  try {
    // Implement your email sending logic here
    console.log(`Sending confirmation email to ${name} at ${email}`);
    // This is a placeholder. You would normally use a service like SendGrid, Mailchimp, etc.
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}