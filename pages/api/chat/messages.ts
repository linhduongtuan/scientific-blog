import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { limit = '50', roomId = 'general' } = req.query
      
      const messages = await prisma.chatMessage.findMany({
        where: {
          roomId: roomId as string
        },
        take: parseInt(limit as string),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          parent: true,
          replies: true,
          reactions: {
            include: {
              user: true
            }
          }
        }
      })

      // Reverse to show oldest first and transform the data
      const transformedMessages = messages.reverse().map(msg => ({
        ...msg,
        username: msg.user?.name || msg.user?.email?.split('@')[0] || 'Anonymous',
        reactions: msg.reactions.map(reaction => ({
          ...reaction,
          username: reaction.user?.name || reaction.user?.email?.split('@')[0] || 'Anonymous'
        }))
      }))

      res.status(200).json({ messages: transformedMessages })
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      res.status(500).json({ error: 'Failed to fetch messages' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
