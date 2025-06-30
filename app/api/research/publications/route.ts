import { NextResponse } from "next/server";

export async function GET() {
  // Mocked data, replace with Prisma query for real DB
  return NextResponse.json([
    { id: "1", title: "Deep Learning for Cancer Genomics", authors: "L. Duong, J. Smith, et al.", journal: "Nature Medicine, 2024", link: "#" },
    { id: "2", title: "AI-driven Patient Monitoring", authors: "L. Duong, A. Lee, et al.", journal: "Science Translational Medicine, 2023", link: "#" }
  ]);
}
