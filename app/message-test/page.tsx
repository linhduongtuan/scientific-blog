'use client';

import React from 'react';
import TestMessageRenderer from '@/app/components/TestMessageRenderer';

export default function MessageTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Message Rendering Test Page</h1>
      <TestMessageRenderer />
    </div>
  );
}
