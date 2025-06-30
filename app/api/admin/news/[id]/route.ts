import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Get a single news item
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const news = await prisma.news.findUnique({ where: { id: params.id } });
  if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(news);
}

// PUT: Update a news item (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Add admin authentication/authorization
  const data = await req.json();
  const news = await prisma.news.update({ where: { id: params.id }, data });
  return NextResponse.json(news);
}

// DELETE: Delete a news item (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Add admin authentication/authorization
  await prisma.news.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
