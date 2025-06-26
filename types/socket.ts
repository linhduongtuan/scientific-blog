import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export interface ChatMessage {
  id: string
  content: string
  username: string
  createdAt: Date
  userId?: string
  isSystem: boolean
}

export interface ClientToServerEvents {
  send_message: (data: {
    content: string
    username: string
    userId?: string
  }) => void
  typing: (data: { username: string }) => void
  stop_typing: (data: { username: string }) => void
}

export interface ServerToClientEvents {
  receive_message: (message: ChatMessage) => void
  user_typing: (data: { username: string }) => void
  user_stop_typing: (data: { username: string }) => void
  error: (data: { message: string }) => void
}
