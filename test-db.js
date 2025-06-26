const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDB() {
  try {
    console.log('Testing database connection...')
    
    const rooms = await prisma.chatRoom.findMany()
    console.log('Chat rooms found:', rooms.length)
    rooms.forEach(room => {
      console.log(`- ${room.name} (${room.id})`)
    })

    const messages = await prisma.chatMessage.findMany()
    console.log('Chat messages found:', messages.length)

    const users = await prisma.user.findMany()
    console.log('Users found:', users.length)
    
    console.log('Database connection successful!')
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDB()
