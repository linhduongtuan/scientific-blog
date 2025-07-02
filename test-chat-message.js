const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testChatMessages() {
  try {
    console.log('Testing chat message creation...');

    // Check if the default rooms exist
    const rooms = await prisma.chatRoom.findMany();
    console.log(`Found ${rooms.length} chat rooms`);
    
    if (rooms.length === 0) {
      console.log('Creating default general room...');
      await prisma.chatRoom.create({
        data: {
          id: 'general',
          name: 'general',
          description: 'General discussion for all topics',
          isPrivate: false
        }
      });
    }

    // Test creating an anonymous message
    const anonymousMessage = await prisma.chatMessage.create({
      data: {
        content: 'This is a test anonymous message',
        userId: null, // Explicitly null for anonymous
        roomId: 'general'
      }
    });
    console.log('Created anonymous message:', anonymousMessage);

    // Check for test user
    const testUser = await prisma.user.findUnique({
      where: { id: '1' }
    });

    // If test user exists, create a message from them too
    if (testUser) {
      const userMessage = await prisma.chatMessage.create({
        data: {
          content: 'This is a test message from Admin User',
          userId: '1',
          roomId: 'general'
        }
      });
      console.log('Created user message:', userMessage);
    } else {
      console.log('No test user found, skipping user message creation');
    }

    // Retrieve messages to verify
    const messages = await prisma.chatMessage.findMany({
      include: {
        user: true
      }
    });
    
    console.log(`\nTotal messages in database: ${messages.length}`);
    messages.forEach(msg => {
      console.log(`- ${msg.id}: "${msg.content}" by ${msg.user ? msg.user.name : 'Anonymous'} in room ${msg.roomId}`);
    });

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing chat messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testChatMessages();
