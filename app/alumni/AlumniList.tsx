"use client";
import React, { useEffect, useState } from "react";

type Alumni = {
  name: string;
  current: string;
  bio?: string;
};

export default function AlumniList() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    fetch("/alumni/alumni.json")
      .then((res) => res.json())
      .then(setAlumni);
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Alumni</h2>
      <ul className="space-y-2">
        {alumni.map((alum) => (
          <li key={alum.name} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <div className="font-bold">{alum.name}</div>
            <div className="text-gray-600 dark:text-gray-300">{alum.current}</div>
            {alum.bio && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alum.bio}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}
