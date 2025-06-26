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
    const { messageId, reason } = req.body

    if (!messageId || !reason) {
      return res.status(400).json({ error: 'Missing messageId or reason' })
    }

    // Delete the message
    await prisma.chatMessage.delete({
      where: { id: messageId }
    })

    // Create moderation log
    await prisma.chatMessage.create({
      data: {
        content: `[MODERATION] Message deleted. Reason: ${reason}`,
        userId: '1',
        roomId: 'general', // You'd get this from the original message
      }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return res.status(500).json({ error: 'Failed to delete message' })
  }
}
