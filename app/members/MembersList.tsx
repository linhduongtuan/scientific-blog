"use client";
import React, { useEffect, useState } from "react";

type Member = {
  name: string;
  role: string;
  image: string;
  bio?: string;
};

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/members/members.json")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Current Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.name} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
            <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-2 object-cover" />
            <div className="font-bold text-lg">{member.name}</div>
            <div className="text-gray-600 dark:text-gray-300">{member.role}</div>
            {member.bio && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{member.bio}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
