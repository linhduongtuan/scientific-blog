import { NextResponse } from "next/server";

export async function GET() {
  // Mocked data, replace with Prisma query for real DB
  return NextResponse.json([
    { id: "1", name: "Computational Biology" },
    { id: "2", name: "Machine Learning for Healthcare" }
  ]);
}
