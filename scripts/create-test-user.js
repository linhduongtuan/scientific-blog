const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if user with ID '1' exists
    const existingUser = await prisma.user.findUnique({
      where: { id: '1' }
    })

    if (!existingUser) {
      // Create a test user
      const user = await prisma.user.create({
        data: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        }
      })
      console.log('Created test user:', user)
    } else {
      console.log('Test user already exists:', existingUser)
    }
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
