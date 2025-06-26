import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Testing database connection...')
    const roomCount = await prisma.chatRoom.count()
    console.log('Room count:', roomCount)
    
    const rooms = await prisma.chatRoom.findMany()
    console.log('Rooms found:', rooms.length)
    
    res.status(200).json({ 
      success: true, 
      roomCount, 
      rooms: rooms.map(r => ({ id: r.id, name: r.name }))
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ error: error.message })
  }
}
