import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple auth check
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { userId, reason, duration } = req.body

    if (!userId || !reason) {
      return res.status(400).json({ error: 'Missing userId or reason' })
    }

    // In a real implementation, you'd:
    // 1. Add user to banned list
    // 2. Remove from all chat rooms
    // 3. Block future messages
    
    // For now, create a moderation log
    const banDuration = duration ? `${duration} hours` : 'permanently'
    await prisma.chatMessage.create({
      data: {
        content: `[MODERATION] User banned ${banDuration}. Reason: ${reason}`,
        userId: '1', // Use admin user ID
        roomId: 'general'
      }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error banning user:', error)
    return res.status(500).json({ error: 'Failed to ban user' })
  }
}
