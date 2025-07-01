import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types/socket'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Use a singleton for PrismaClient to avoid too many open connections in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }
export const prisma =
  globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
    const httpServer: NetServer = res.socket.server as unknown as NetServer
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

      // Handle ping for connection testing
      socket.on('ping', () => {
        console.log('Ping received from:', socket.id)
        socket.emit('pong')
      })

      // Join general room by default
      socket.join('general')

      // Handle room joining
      socket.on('join_room', async (roomId) => {
        try {
          if (!roomId || typeof roomId !== 'string') {
            socket.emit('error', { message: 'Invalid room ID' })
            return
          }
          
          // Leave all rooms except the socket's own room
          const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
          rooms.forEach(room => socket.leave(room))
          
          // Join new room
          socket.join(roomId)
          
          // Notify room of new member (but don't send to the joiner)
          socket.to(roomId).emit('room_joined', { roomId, username: 'User' })
          
          // Send confirmation to the joiner
          socket.emit('room_joined_confirmation', { roomId })
          
          console.log(`User ${socket.id} joined room: ${roomId}`)
        } catch (error) {
          console.error('Error joining room:', error)
          socket.emit('error', { message: 'Failed to join room' })
        }
      })

      // Handle room leaving
      socket.on('leave_room', (roomId) => {
        if (!roomId || typeof roomId !== 'string') {
          socket.emit('error', { message: 'Invalid room ID' })
          return
        }
        
        socket.leave(roomId)
        socket.to(roomId).emit('room_left', { roomId, username: 'User' })
        socket.emit('room_left_confirmation', { roomId })
        console.log(`User ${socket.id} left room: ${roomId}`)
      })

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          console.log('📨 Received message:', data)
          const { content, username, userId, roomId = 'general', replyToId, fileUrl, fileName, fileType } = data
          
          if (!content || content.trim() === '') {
            console.warn('Empty message content received')
            socket.emit('error', { message: 'Message content cannot be empty' })
            return
          }
          
          // Handle user ID - use null for anonymous users now that schema supports it
          const finalUserId = (!userId || userId === 'anonymous') ? null : userId
          
          // Save message to database
          const message = await prisma.chatMessage.create({
            data: {
              content,
              userId: finalUserId,
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

          console.log('💾 Message saved to database:', message.id)

          // Broadcast to all clients in the room
          const messageToSend = {
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
            replyToId: message.parentId
          }

          io.to(roomId).emit('receive_message', messageToSend)
          console.log('📡 Message broadcasted to room:', roomId)
        } catch (error) {
          console.error('Error saving message:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle user typing
      socket.on('typing', (data) => {
        const { username, roomId = 'general' } = data
        if (username && roomId) {
          socket.to(roomId).emit('user_typing', { username, roomId })
        }
      })

      socket.on('stop_typing', (data) => {
        const { username, roomId = 'general' } = data
        if (username && roomId) {
          socket.to(roomId).emit('user_stop_typing', { username, roomId })
        }
      })

      // Handle message reactions
      socket.on('add_reaction', async (data) => {
        try {
          const { messageId, emoji, username, userId, roomId = 'general' } = data
          
          if (!messageId || !emoji) {
            socket.emit('error', { message: 'Missing messageId or emoji' })
            return
          }
          
          const finalUserId = (!userId || userId === 'anonymous') ? null : userId
          
          // Check if reaction already exists to prevent duplicates
          const existingReaction = await prisma.chatReaction.findFirst({
            where: {
              messageId,
              emoji,
              userId: finalUserId,
            }
          })
          
          if (existingReaction) {
            socket.emit('error', { message: 'Reaction already exists' })
            return
          }
          
          const reaction = await prisma.chatReaction.create({
            data: {
              messageId,
              emoji,
              userId: finalUserId,
            }
          })

          // Broadcast reaction to room only (not all clients)
          io.to(roomId).emit('reaction_added', { messageId, reaction: { ...reaction, username } })
        } catch (error) {
          console.error('Error adding reaction:', error)
          socket.emit('error', { message: 'Failed to add reaction' })
        }
      })
      
      socket.on('remove_reaction', async (data) => {
        try {
          const { messageId, emoji, username, userId, roomId = 'general' } = data
          
          if (!messageId || !emoji) {
            socket.emit('error', { message: 'Missing messageId or emoji' })
            return
          }
          
          const finalUserId = (!userId || userId === 'anonymous') ? null : userId
          
          const reaction = await prisma.chatReaction.findFirst({
            where: {
              messageId,
              emoji,
              userId: finalUserId,
            }
          })

          if (reaction) {
            await prisma.chatReaction.delete({
              where: { id: reaction.id }
            })

            // Broadcast reaction removal to room only
            io.to(roomId).emit('reaction_removed', { messageId, reaction: { ...reaction, username } })
          } else {
            socket.emit('error', { message: 'Reaction not found' })
          }
        } catch (error) {
          console.error('Error removing reaction:', error)
          socket.emit('error', { message: 'Failed to remove reaction' })
        }
      })
      // Handle message search
      socket.on('search_messages', async (data) => {
        try {
          console.log('🔍 Received search request:', data)
          const { query, roomId } = data
          
          if (!query || query.trim() === '') {
            console.warn('Empty search query received')
            socket.emit('error', { message: 'Search query cannot be empty' })
            return
          }
          
          const messages = await prisma.chatMessage.findMany({
            where: {
              roomId,
              content: {
                contains: query
              }
            },
            include: {
              user: true,
              reactions: true,
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 50 // Limit results
          })

          console.log(`🔍 Found ${messages.length} messages for query "${query}"`)

          // Transform messages to include username
          const transformedMessages = messages.map(msg => ({
            ...msg,
            username: msg.user?.name || 'Anonymous'
          }))

          socket.emit('search_results', { results: transformedMessages })
          console.log('📡 Search results sent to client')
        } catch (error) {
          console.error('Error searching messages:', error)
          socket.emit('error', { message: 'Failed to search messages' })
        }
      })

      // Handle file upload
      socket.on('upload_file', async (data) => {
        try {
          const { file, fileName, fileType, username, userId, roomId = 'general' } = data
          
          if (!file || !fileName) {
            socket.emit('error', { message: 'Missing file or fileName' })
            return
          }
          
          // Validate file size (10MB limit)
          const maxFileSize = 10 * 1024 * 1024
          if (file.length > maxFileSize) {
            socket.emit('error', { message: 'File too large (max 10MB)' })
            return
          }
          
          // Generate unique filename
          const timestamp = Date.now()
          const ext = path.extname(fileName)
          const baseName = path.basename(fileName, ext)
          const uniqueFileName = `${timestamp}-${baseName.substring(0, 50)}${ext}`
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
            },
            include: {
              user: true,
              reactions: true,
            }
          })
          
          const messageToSend = {
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
            replyToId: message.parentId
          }
          
          io.to(roomId).emit('receive_message', messageToSend)
        } catch (error) {
          console.error('Error uploading file:', error)
          socket.emit('error', { message: 'Failed to upload file' })
        }
      })
      socket.on('send_private_message', async (data) => {
        try {
          const { content, username, userId, recipientUsername } = data

          if (!content || !recipientUsername) {
            socket.emit('error', { message: 'Missing content or recipient' })
            return
          }

          // Find recipient's socket by username stored in socket data
          const recipientSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => (s as any).data?.username === recipientUsername
          ) as typeof socket | undefined

          if (recipientSocket) {
            // Save private message to database
            const message = await prisma.chatMessage.create({
              data: {
                content,
                userId: userId || null,
                roomId: `private_${socket.id}_${recipientSocket.id}`,
              },
              include: {
                user: true,
                reactions: true,
              }
            })

            const messageToSend = {
              id: message.id,
              content: message.content,
              username: message.user?.name || username || 'Anonymous',
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
              userId: message.userId,
              roomId: message.roomId,
              user: message.user,
              reactions: message.reactions,
              isPrivate: true
            }

            // Send to both sender and recipient
            io.to(recipientSocket.id)
              .to(socket.id)
              .emit('receive_private_message', messageToSend)
          } else {
            // Handle user not found
            socket.emit('error', { message: 'Recipient not found or offline' })
          }
        } catch (error) {
          console.error('Error sending private message:', error)
          socket.emit('error', { message: 'Failed to send private message' })
        }
      })
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
