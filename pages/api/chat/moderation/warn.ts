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
    const { userId, reason } = req.body

    if (!userId || !reason) {
      return res.status(400).json({ error: 'Missing userId or reason' })
    }

    // Create a warning log
    await prisma.chatMessage.create({
      data: {
        content: `[MODERATION] User warned. Reason: ${reason}`,
        userId: '1',
        roomId: 'general',
      }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error warning user:', error)
    return res.status(500).json({ error: 'Failed to warn user' })
  }
}
