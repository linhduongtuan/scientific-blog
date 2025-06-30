import React from "react";

import ResearchSection from "./ResearchSection";
import FeaturedProjects from "./FeaturedProjects";
import PublicationsSection from "./PublicationsSection";
import CollaborationCTA from "./CollaborationCTA";

import { headers } from "next/headers";

async function getData(url: string) {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}${url}`, { cache: "no-store" });
  return res.json();
}

export default async function ResearchPage() {
  const [projects, areas, publications] = await Promise.all([
    getData("/api/research/featured-projects"),
    getData("/api/research/areas"),
    getData("/api/research/publications"),
  ]);
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Current Research</h1>
      <p className="mb-6">Explore our lab's research focus, projects, and scientific interests below.</p>
      <FeaturedProjects projects={projects} />
      <ResearchSection areas={areas} />
      <PublicationsSection publications={publications} />
      <CollaborationCTA />
    </main>
  );
}
