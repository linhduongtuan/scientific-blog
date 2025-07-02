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
      
      // Check if room exists, if not create it
      let room = await prisma.chatRoom.findFirst({
        where: {
          OR: [
            { id: roomId as string },
            { name: roomId as string }
          ]
        }
      })
      
      // If room doesn't exist, create it
      if (!room) {
        console.log(`Room '${roomId}' not found, creating it automatically...`)
        room = await prisma.chatRoom.create({
          data: {
            name: roomId as string,
            description: `Auto-created room for ${roomId}`,
            isPrivate: false
          }
        })
        console.log(`Room created: ${room.name} (${room.id})`)
      }
      
      const messages = await prisma.chatMessage.findMany({
        where: {
          roomId: room.id // Use the actual room ID from the database
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
        id: msg.id,
        content: msg.content,
        username: msg.user?.name || msg.user?.email?.split('@')[0] || 'Anonymous',
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        userId: msg.userId,
        roomId: msg.roomId,
        user: msg.user,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        fileType: msg.fileType,
        replyToId: msg.parentId,
        parent: msg.parent,
        isSystem: false,
        isEdited: false,
        isPrivate: false,
        reactions: (msg.reactions || []).map(reaction => ({
          id: reaction.id,
          emoji: reaction.emoji,
          userId: reaction.userId,
          messageId: reaction.messageId,
          username: reaction.user?.name || reaction.user?.email?.split('@')[0] || 'Anonymous',
          createdAt: reaction.createdAt
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
