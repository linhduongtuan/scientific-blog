import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { apiRateLimit } from "@/app/lib/rate-limit";
import { z } from "zod";

export const dynamic = 'force-dynamic';

// Define a schema that ensures required fields
const createAlumniSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  current: z.string().min(1, 'Current position/status is required'),
  bio: z.string().optional(),
}).transform(data => ({
  name: data.name,
  current: data.current,
  bio: data.bio
}));

// GET: List all alumni with pagination and search
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;
    
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { current: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
      
    const [alumni, total] = await Promise.all([
      prisma.alumni.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.alumni.count({ where }),
    ]);
    
    return NextResponse.json({
      alumni,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    if (error instanceof Error && (error.message === "Authentication required" || error.message === "Admin access required")) {
      return NextResponse.json({ error: error.message }, { status: error.message === "Authentication required" ? 401 : 403 });
    }
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 });
  }
}

// POST: Create a new alumni (admin only)
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    await requireAdmin();
    
    const body = await request.json();
    const validatedData = createAlumniSchema.parse(body);
    
    const alumni = await prisma.alumni.create({
      data: validatedData,
    });
    
    return NextResponse.json(alumni, { status: 201 });
  } catch (error) {
    console.error("Error creating alumni:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && (error.message === "Authentication required" || error.message === "Admin access required")) {
      return NextResponse.json({ error: error.message }, { status: error.message === "Authentication required" ? 401 : 403 });
    }
    if (error instanceof Error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: "Alumni already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create alumni" }, { status: 500 });
  }
}
