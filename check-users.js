const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    console.log(JSON.stringify(users, null, 2));

    // Also check if chat rooms exist
    const rooms = await prisma.chatRoom.findMany();
    console.log('\nChat rooms count:', rooms.length);
    console.log(JSON.stringify(rooms, null, 2));
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
