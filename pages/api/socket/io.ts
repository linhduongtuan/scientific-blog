import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types/socket'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Configure multer for file uploads
const upload = multer({
  dest: 'public/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

export default async function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...')
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
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

      // Join general room by default
      socket.join('general')

      // Handle room joining
      socket.on('join_room', async (roomId) => {
        try {
          // Leave all rooms except the socket's own room
          const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
          rooms.forEach(room => socket.leave(room))
          
          // Join new room
          socket.join(roomId)
          
          // Notify room of new member
          socket.to(roomId).emit('room_joined', { roomId, username: 'User' })
          
          console.log(`User ${socket.id} joined room: ${roomId}`)
        } catch (error) {
          console.error('Error joining room:', error)
          socket.emit('error', { message: 'Failed to join room' })
        }
      })

      // Handle room leaving
      socket.on('leave_room', (roomId) => {
        socket.leave(roomId)
        socket.to(roomId).emit('room_left', { roomId, username: 'User' })
        console.log(`User ${socket.id} left room: ${roomId}`)
      })

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          const { content, username, userId, roomId = 'general', replyToId, fileUrl, fileName, fileType } = data
          
          // Save message to database
          const message = await prisma.chatMessage.create({
            data: {
              content,
              userId: userId || '1', // Default to user 1 if no userId provided
              roomId,
              parentId: replyToId || null,
              fileUrl: fileUrl || null,
              fileName: fileName || null,
              fileType: fileType || null,
            },
            include: {
              user: true,
              reactions: true,
            }
          })

          // Broadcast to all clients in the room
          io.to(roomId).emit('receive_message', {
            id: message.id,
            content: message.content,
            username: message.user?.name || username || 'Anonymous',
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            userId: message.userId,
            roomId: message.roomId,
            user: message.user,
            reactions: message.reactions,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            fileType: message.fileType,
          })
        } catch (error) {
          console.error('Error saving message:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle user typing
      socket.on('typing', (data) => {
        const { username, roomId = 'general' } = data
        socket.to(roomId).emit('user_typing', { username, roomId })
      })

      socket.on('stop_typing', (data) => {
        const { username, roomId = 'general' } = data
        socket.to(roomId).emit('user_stop_typing', { username, roomId })
      })

      // Handle message reactions
      // Handle message reactions
      socket.on('add_reaction', async (data) => {
        try {
          const { messageId, emoji, username, userId } = data
          
          const reaction = await prisma.chatReaction.create({
            data: {
              messageId,
              emoji,
              userId: userId || null,
            }
          })

          // Broadcast reaction to all clients
          io.emit('reaction_added', { messageId, reaction })
        } catch (error) {
          console.error('Error adding reaction:', error)
          socket.emit('error', { message: 'Failed to add reaction' })
        }
      })
      socket.on('remove_reaction', async (data) => {
        try {
          const { messageId, emoji, username, userId } = data
          
          const reaction = await prisma.chatReaction.findFirst({
            where: {
              messageId,
              emoji,
              userId: userId || null,
            }
          })

          if (reaction) {
            await prisma.chatReaction.delete({
              where: { id: reaction.id }
            })

            // Broadcast reaction removal to all clients
            io.emit('reaction_removed', { messageId, reaction })
          }
        } catch (error) {
          console.error('Error removing reaction:', error)
          socket.emit('error', { message: 'Failed to remove reaction' })
        }
      })
      // Handle message search
      socket.on('search_messages', async (data) => {
        try {
          const { query, roomId } = data
          
          const messages = await prisma.chatMessage.findMany({
            where: {
              roomId,
              content: {
                contains: query,
              }
            },
            include: {
              user: true,
              reactions: true,
            },
            orderBy: {
              createdAt: 'desc'
            }
          })

          // Transform messages to include username
          const transformedMessages = messages.map(msg => ({
            ...msg,
            username: msg.user?.name || 'Anonymous'
          }))

          socket.emit('search_results', { results: transformedMessages })
        } catch (error) {
          console.error('Error searching messages:', error)
          socket.emit('error', { message: 'Failed to search messages' })
        }
      })

      // Handle file upload
      socket.on('upload_file', async (data) => {
        try {
          const { file, fileName, fileType, username, userId, roomId = 'general' } = data
          
          // Generate unique filename
          const timestamp = Date.now()
          const ext = path.extname(fileName)
          const uniqueFileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${ext}`
          const filePath = path.join(process.cwd(), 'public/uploads', uniqueFileName)
          
          // Save file
          fs.writeFileSync(filePath, Buffer.from(file))
          
          const fileUrl = `/uploads/${uniqueFileName}`
          
          // Save message with file info
          const message = await prisma.chatMessage.create({
            data: {
              content: `Shared a file: ${fileName}`,
              userId: userId || null,
              roomId,
              fileUrl,
              fileName,
              fileType,
            }
          })
          
          io.to(roomId).emit('file_uploaded', { message })
        } catch (error) {
          console.error('Error uploading file:', error)
          socket.emit('error', { message: 'Failed to upload file' })
        }
      })
      socket.on('send_private_message', async (data) => {
        try {
          const { content, username, userId, recipientUsername } = data

          // Find recipient's socket
          const recipientSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => s.data.username === recipientUsername
          );

          if (recipientSocket) {
            // Save private message to database
            const message = await prisma.chatMessage.create({
              data: {
                content,
                userId: userId || null,
                roomId: `private_${socket.id}_${recipientSocket.id}`,
              },
            });

            // Send to both sender and recipient
            io.to(recipientSocket.id)
              .to(socket.id)
              .emit('receive_private_message', message);
          } else {
            // Handle user not found
            socket.emit('error', { message: 'Recipient not found' });
          }
        } catch (error) {
          console.error('Error sending private message:', error)
          socket.emit('error', { message: 'Failed to send private message' })
        }
      });
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
