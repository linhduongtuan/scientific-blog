export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAdmin } from "@/app/lib/auth"
import { apiRateLimit } from "@/app/lib/rate-limit"
import { z } from "zod"

const updateAlumniSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  graduationYear: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

async function handleRequest(req: NextRequest, operation: Function) {
  try {
    const rateLimitResult = apiRateLimit(req);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    await requireAdmin();
    return await operation();
  } catch (error) {
    console.error(`Error during alumni operation:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      if (error.message === "Admin access required") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
      }
      if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

// GET: Get a single alumni
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(req, async () => {
    const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });
    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }
    return NextResponse.json(alumni);
  });
}

// PUT: Update an alumni (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(req, async () => {
    const data = await req.json();
    const validatedData = updateAlumniSchema.parse(data);
    const alumni = await prisma.alumni.update({ where: { id: params.id }, data: validatedData });
    return NextResponse.json(alumni);
  });
}

// DELETE: Delete an alumni (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(req, async () => {
    await prisma.alumni.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  });
}