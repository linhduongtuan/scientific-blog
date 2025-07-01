"use client";
import React, { useEffect, useState } from "react";

type Alumni = {
  name: string;
  graduationYear?: number;
  current: string;
  occupation?: string;
  company?: string;
  image?: string;
  bio?: string;
};

export default function AlumniList() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    fetch("/alumni/alumni.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch alumni data: ${res.status}`);
        }
        return res.json();
      })
      .then(setAlumni)
      .catch(error => {
        console.error("Error loading alumni data:", error);
        // Set some fallback data if fetch fails
        setAlumni([
          {
            name: "Dr. Example Alumni",
            current: "Research Scientist",
            bio: "This is fallback data when the alumni.json file cannot be loaded."
          }
        ]);
      });
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Alumni</h2>
      <ul className="space-y-2">
        {alumni.map((alum) => (
          <li key={alum.name} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-start gap-4">
            {alum.image && (
              <img 
                src={alum.image || "/images/team/placeholder.svg"} 
                alt={alum.name} 
                className="w-16 h-16 rounded-full object-cover" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/team/placeholder.svg";
                }}
              />
            )}
            <div>
              <div className="font-bold">{alum.name}</div>
              <div className="text-gray-600 dark:text-gray-300">{alum.current}</div>
              {alum.occupation && alum.company && (
                <div className="text-sm text-gray-500 dark:text-gray-400">{alum.occupation} at {alum.company}</div>
              )}
              {alum.graduationYear && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Graduated {alum.graduationYear}</div>
              )}
              {alum.bio && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alum.bio}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
