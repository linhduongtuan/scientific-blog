import React from "react";
import AlumniList from "./AlumniList";
import StayConnectedCTA from "./StayConnectedCTA";

export default function AlumniPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Lab Alumni</h1>
      <p className="mb-6">See where our former lab members are now!</p>
      <AlumniList />
      <StayConnectedCTA />
    </main>
  );
}
