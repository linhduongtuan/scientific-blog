import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple auth check using headers or session
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // In a real app, you'd validate the auth token and check user roles
  // For now, we'll do a basic check
  
  if (req.method === 'GET') {
    try {
      const { roomId } = req.query

      // Fetch moderation actions for the room (mock data for now)
      const actions = await prisma.chatMessage.findMany({
        where: {
          roomId: roomId as string,
          content: {
            contains: '[MODERATION]'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      })

      return res.status(200).json({ actions })
    } catch (error) {
      console.error('Error fetching moderation actions:', error)
      return res.status(500).json({ error: 'Failed to fetch moderation actions' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
