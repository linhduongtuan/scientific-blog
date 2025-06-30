import React from "react";

export default function FeaturedProjects({ projects }: { projects: any[] }) {
  return (
    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 rounded">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Featured Projects</h2>
      <ul>
        {projects.map((project: any) => (
          <li key={project.id} className="mb-2">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{project.title}</span>
            <span className="block text-gray-700 dark:text-gray-200 text-sm">{project.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
