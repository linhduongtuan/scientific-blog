import React from 'react';
import { ChatMessage } from '@/types/socket';

/**
 * This is a test component that simulates the chat rendering without any external dependencies.
 * You can import this in a test page to check if the basic message rendering works.
 */
export default function TestMessageRenderer() {
  const testMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Hello world!',
      username: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: false,
      isEdited: false,
      isPrivate: false,
      reactions: []
    },
    {
      id: '2',
      content: 'This is a test message to verify rendering.',
      username: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: false,
      isEdited: false,
      isPrivate: false,
      reactions: []
    }
  ];

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Test Message Renderer</h2>
      
      <div className="space-y-4">
        {testMessages.map(message => (
          <div key={message.id} className="p-4 bg-gray-100 rounded">
            <div className="font-bold">{message.username}</div>
            <div>{message.content}</div>
            <div className="text-xs text-gray-500">{message.createdAt.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
