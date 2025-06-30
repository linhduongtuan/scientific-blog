import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/app/lib/auth";

const prisma = new PrismaClient();

// GET: List all news
export async function GET() {
  const news = await prisma.news.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(news);
}

// POST: Create a news item (admin only)
export async function POST(req: NextRequest) {
  await requireAdmin();
  const data = await req.json();
  const news = await prisma.news.create({ data });
  return NextResponse.json(news);
}
