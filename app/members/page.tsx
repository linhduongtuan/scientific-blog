import React from "react";
import MembersList from "./MembersList";
import JoinLabCTA from "./JoinLabCTA";

export default function MembersPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Lab Members</h1>
      <p className="mb-6">Meet our current lab members and their roles.</p>
      <MembersList />
      <JoinLabCTA />
    </main>
  );
}
