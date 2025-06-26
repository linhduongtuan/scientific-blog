import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple auth check
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { roomId } = req.query

    // Mock user data for the room
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        messageCount: 15,
        createdAt: new Date('2024-01-01'),
        lastActive: new Date()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        messageCount: 8,
        createdAt: new Date('2024-01-15'),
        lastActive: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      }
    ]

    return res.status(200).json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
}
