import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types/socket'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...')
    
    // Create new Socket.IO server
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL 
          : "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    // Store IO instance in server
    res.socket.server.io = io

    // Handle connections
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Join general chat room
      socket.join('general')

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          const { content, username, userId } = data
          
          // Save message to database
          const message = await prisma.chatMessage.create({
            data: {
              content,
              username,
              userId: userId || null,
            }
          })

          // Broadcast to all clients in the room
          io.to('general').emit('receive_message', {
            id: message.id,
            content: message.content,
            username: message.username,
            createdAt: message.createdAt,
            userId: message.userId,
            isSystem: message.isSystem
          })
        } catch (error) {
          console.error('Error saving message:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle user typing
      socket.on('typing', (data) => {
        socket.to('general').emit('user_typing', data)
      })

      // Handle stop typing
      socket.on('stop_typing', (data) => {
        socket.to('general').emit('user_stop_typing', data)
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })

    console.log('Socket.IO server setup complete')
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
