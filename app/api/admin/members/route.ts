import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: List all members
export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(members);
}

// POST: Create a new member (admin only)
export async function POST(req: NextRequest) {
  // TODO: Add admin authentication/authorization
  const data = await req.json();
  const member = await prisma.member.create({ data });
  return NextResponse.json(member);
}
