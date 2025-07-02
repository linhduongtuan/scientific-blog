const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkChatData() {
  console.log('📊 Chat Diagnostic Tool');
  console.log('======================');

  try {
    // Check users
    const users = await prisma.user.findMany();
    console.log(`\n👤 Users in database: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });

    // Check rooms
    const rooms = await prisma.chatRoom.findMany();
    console.log(`\n🏠 Chat rooms in database: ${rooms.length}`);
    rooms.forEach(room => {
      console.log(`  - ID: ${room.id}, Name: ${room.name}, Private: ${room.isPrivate}`);
    });

    // Check messages
    const messages = await prisma.chatMessage.findMany({
      include: {
        user: true,
        reactions: true
      }
    });
    console.log(`\n💬 Chat messages in database: ${messages.length}`);
    messages.forEach(msg => {
      console.log(`  - ID: ${msg.id}, User: ${msg.user?.name || 'Anonymous'}, Room: ${msg.roomId}`);
      console.log(`    Content: ${msg.content}`);
      console.log(`    Created: ${msg.createdAt}`);
      console.log(`    Reactions: ${msg.reactions.length}`);
      console.log('    ---');
    });

    // Check message count by room
    console.log('\n📊 Messages by room:');
    for (const room of rooms) {
      const count = await prisma.chatMessage.count({
        where: { roomId: room.id }
      });
      console.log(`  - ${room.name}: ${count} messages`);
    }

  } catch (error) {
    console.error('❌ Error running diagnostics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkChatData();
