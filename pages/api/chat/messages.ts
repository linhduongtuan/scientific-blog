import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { limit = '50' } = req.query
      
      const messages = await prisma.chatMessage.findMany({
        take: parseInt(limit as string),
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Reverse to show oldest first
      const reversedMessages = messages.reverse()

      res.status(200).json({ messages: reversedMessages })
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      res.status(500).json({ error: 'Failed to fetch messages' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
