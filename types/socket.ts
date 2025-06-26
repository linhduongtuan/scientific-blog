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
  createdAt: Date
  updatedAt: Date
  userId?: string
  username: string
  roomId?: string
  isSystem: boolean
  isEdited: boolean
  isPrivate: boolean
  fileUrl?: string
  fileName?: string
  fileType?: string
  recipientUsername?: string
  reactions: ChatReaction[]
  replies?: ChatMessage[]
  replyToId?: string
  replyTo?: ChatMessage
}

export interface ChatReaction {
  id: string
  messageId: string
  userId?: string
  username: string
  emoji: string
  createdAt: Date
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
  memberCount?: number
}

export interface ClientToServerEvents {
  send_message: (data: {
    content: string
    username: string
    userId?: string
    roomId?: string
    replyToId?: string
    fileUrl?: string
    fileName?: string
    fileType?: string
  }) => void
  join_room: (roomId: string) => void
  leave_room: (roomId: string) => void
  typing: (data: { username: string; roomId: string }) => void
  stop_typing: (data: { username: string; roomId: string }) => void
  add_reaction: (data: { messageId: string; emoji: string; username: string; userId?: string }) => void
  remove_reaction: (data: { messageId: string; emoji: string; username: string }) => void
  search_messages: (data: { query: string; roomId: string }) => void
  upload_file: (data: { file: ArrayBuffer; fileName: string; fileType: string; username: string; userId?: string; roomId?: string }) => void
}

export interface ServerToClientEvents {
  receive_message: (message: ChatMessage) => void
  user_typing: (data: { username: string; roomId: string }) => void
  user_stop_typing: (data: { username: string; roomId: string }) => void
  reaction_added: (data: { messageId: string; reaction: ChatReaction }) => void
  reaction_removed: (data: { messageId: string; reaction: ChatReaction }) => void
  room_joined: (data: { roomId: string; username: string }) => void
  room_left: (data: { roomId: string; username: string }) => void
  search_results: (data: { results: ChatMessage[] }) => void
  file_uploaded: (data: { message: ChatMessage }) => void
  error: (data: { message: string }) => void
}
