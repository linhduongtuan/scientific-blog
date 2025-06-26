const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create default chat rooms
  const generalRoom = await prisma.chatRoom.upsert({
    where: { name: 'general' },
    update: {},
    create: {
      id: 'general',
      name: 'general',
      description: 'General discussion for all topics',
      isPrivate: false,
    },
  })

  const scientificRoom = await prisma.chatRoom.upsert({
    where: { name: 'scientific-discussion' },
    update: {},
    create: {
      name: 'scientific-discussion',
      description: 'Discussions about scientific papers and research',
      isPrivate: false,
    },
  })

  const techRoom = await prisma.chatRoom.upsert({
    where: { name: 'tech-talk' },
    update: {},
    create: {
      name: 'tech-talk',
      description: 'Technology and programming discussions',
      isPrivate: false,
    },
  })

  const helpRoom = await prisma.chatRoom.upsert({
    where: { name: 'help-support' },
    update: {},
    create: {
      name: 'help-support',
      description: 'Get help and support from the community',
      isPrivate: false,
    },
  })

  console.log('Seeded chat rooms:', {
    generalRoom,
    scientificRoom,
    techRoom,
    helpRoom,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
