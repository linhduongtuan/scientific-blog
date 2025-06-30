import React from "react";

const news = [
  {
    title: "Lab awarded major research grant",
    date: "2025-06-01",
    summary: "Our lab received a $2M grant to advance AI in genomics.",
    link: "#"
  },
  {
    title: "New publication in Nature Medicine",
    date: "2025-05-15",
    summary: "Congratulations to Jane Smith for her first-author paper!",
    link: "#"
  }
];

export default function NewsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Lab News & Updates</h1>
      <ul className="space-y-6">
        {news.map((item) => (
          <li key={item.title} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <div className="font-bold text-lg mb-1">{item.title}</div>
            <div className="text-xs text-gray-500 mb-2">{item.date}</div>
            <div className="mb-2">{item.summary}</div>
            <a href={item.link} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Read more</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
