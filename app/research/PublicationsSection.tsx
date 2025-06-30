import React from "react";

export default function PublicationsSection({ publications }: { publications: any[] }) {
  return (
    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 rounded">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Selected Publications</h2>
      <ul>
        {publications.map((pub: any) => (
          <li key={pub.id} className="mb-2">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{pub.title}</span>
            <span className="block text-gray-700 dark:text-gray-200 text-sm">{pub.authors} — {pub.journal}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
