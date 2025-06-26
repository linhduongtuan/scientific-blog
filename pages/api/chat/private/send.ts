import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content, recipientUsername, roomId } = req.body

    if (!content || !recipientUsername) {
      return res.status(400).json({ error: 'Missing content or recipient' })
    }

    // Create private message
    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId: 'current-user-id', // Would get from auth
        roomId: roomId || `private-${recipientUsername}`
      }
    })

    return res.status(200).json({ success: true, message })
  } catch (error) {
    console.error('Error sending private message:', error)
    return res.status(500).json({ error: 'Failed to send private message' })
  }
}
