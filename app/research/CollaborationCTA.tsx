
import React from "react";
import Link from "next/link";

export default function CollaborationCTA() {
  return (
    <section className="text-center my-8 p-4 bg-blue-500 dark:bg-blue-800 rounded text-white">
      <h2 className="text-2xl font-bold mb-2">Interested in Collaborating?</h2>
      <p className="mb-4">
        We are always looking for new research partners. If you are interested in our work, please get in touch.
      </p>
      <Link href="/contact" className="bg-white text-blue-500 font-bold py-2 px-4 rounded">
        Contact Us
      </Link>
    </section>
  );
}
