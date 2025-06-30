import React from "react";

export default function ResearchSection({ areas }: { areas: any[] }) {
  return (
    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 rounded">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Main Research Areas</h2>
      <ul>
        {areas.map((area: any) => (
          <li key={area.id} className="text-gray-800 dark:text-gray-200">{area.name}</li>
        ))}
      </ul>
    </section>
  );
}
