// Script to ensure that default chat rooms exist in the database

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function setupChatRooms() {
  console.log('Setting up default chat rooms...')
  
  // Define default rooms
  const defaultRooms = [
    {
      id: 'general',
      name: 'general',
      description: 'General discussion for all topics',
      isPrivate: false
    },
    {
      id: 'tech',
      name: 'tech-talk',
      description: 'Technology discussions',
      isPrivate: false
    },
    {
      id: 'help',
      name: 'help-support',
      description: 'Get help from the community',
      isPrivate: false
    }
  ]
  
  try {
    // Create each room if it doesn't exist
    for (const room of defaultRooms) {
      const existingRoom = await prisma.chatRoom.findUnique({
        where: { id: room.id }
      })
      
      if (!existingRoom) {
        console.log(`Creating room: ${room.name}`)
        await prisma.chatRoom.create({
          data: room
        })
      } else {
        console.log(`Room already exists: ${room.name}`)
      }
    }
    
    console.log('Default chat rooms setup completed successfully!')
    
    // List all rooms
    const allRooms = await prisma.chatRoom.findMany()
    console.log(`\nAvailable rooms (${allRooms.length}):`)
    allRooms.forEach(room => {
      console.log(`- ${room.name} (${room.id}): ${room.description}`)
    })
  } catch (error) {
    console.error('Error setting up chat rooms:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupChatRooms()
