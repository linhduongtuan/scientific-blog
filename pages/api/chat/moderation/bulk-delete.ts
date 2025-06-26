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
    const { messageIds, reason } = req.body

    if (!messageIds || !Array.isArray(messageIds) || !reason) {
      return res.status(400).json({ error: 'Missing messageIds or reason' })
    }

    // Delete multiple messages
    for (const messageId of messageIds) {
      await prisma.chatMessage.delete({
        where: { id: messageId }
      })
    }

    // Create moderation log
    await prisma.chatMessage.create({
      data: {
        content: `[MODERATION] ${messageIds.length} messages deleted in bulk. Reason: ${reason}`,
        userId: '1',
        roomId: 'general',
      }
    })
    return res.status(200).json({ success: true, deleted: messageIds.length })
  } catch (error) {
    console.error('Error bulk deleting messages:', error)
    return res.status(500).json({ error: 'Failed to delete messages' })
  }
}
