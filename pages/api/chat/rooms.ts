import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const rooms = await prisma.chatRoom.findMany({
        where: {
          isPrivate: false // Only return public rooms for now
        },
        select: {
          id: true,
          name: true,
          description: true,
          isPrivate: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })

      // Transform the response to include member count (simplified)
      const roomsWithMemberCount = rooms.map(room => ({
        ...room,
        memberCount: room._count.messages > 0 ? Math.floor(Math.random() * 20) + 1 : 0 // Mock member count
      }))

      res.status(200).json({ rooms: roomsWithMemberCount })
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
      res.status(500).json({ error: 'Failed to fetch rooms' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, isPrivate = false } = req.body

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Room name is required' })
      }

      const room = await prisma.chatRoom.create({
        data: {
          name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          description,
          isPrivate,
        }
      })

      res.status(201).json({ room })
    } catch (error) {
      console.error('Error creating chat room:', error)
      res.status(500).json({ error: 'Failed to create room' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
