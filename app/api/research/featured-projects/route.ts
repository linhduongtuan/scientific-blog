import { NextResponse } from "next/server";

export async function GET() {
  // Mocked data, replace with Prisma query for real DB
  return NextResponse.json([
    { id: "1", title: "AI for Genomics", description: "Developing ML models for genomics.", image: "/images/genomics.jpg", link: "#" },
    { id: "2", title: "Digital Health Platform", description: "Digital tools for patient monitoring.", image: "/images/digital-health.jpg", link: "#" }
  ]);
}
