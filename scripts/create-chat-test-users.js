const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const testUsers = [
  {
    id: 'admin-user',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    password: 'admin123'
  },
  {
    id: 'test-user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'USER',
    password: 'alice123'
  },
  {
    id: 'test-user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'USER',
    password: 'bob123'
  },
  {
    id: 'test-user-3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'USER',
    password: 'charlie123'
  }
]

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users for chat testing...\n')
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`✅ User already exists: ${userData.name} (${userData.email})`)
        continue
      }

      // Hash password if provided
      let hashedPassword = null
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10)
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password: hashedPassword,
          emailVerified: new Date(), // Mark as verified for easier testing
        }
      })

      console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`)
      console.log(`   🔑 Password: ${userData.password}`)
    }

    console.log('\n🎯 Chat Testing Instructions:')
    console.log('=============================')
    console.log('1. Open two different browsers (or incognito windows)')
    console.log('2. Sign in with different accounts:')
    console.log('   - Browser 1: admin@example.com / admin123')
    console.log('   - Browser 2: alice@example.com / alice123')
    console.log('3. Open the chat component in both browsers')
    console.log('4. Test real-time messaging between the accounts')
    console.log('5. Try switching channels and see if messages sync')
    console.log('6. Test file uploads and reactions')
    console.log('')
    console.log('📱 Alternative Testing Method:')
    console.log('- Use the same browser but different tabs')
    console.log('- Sign out and sign in with different accounts')
    console.log('- Open chat in both tabs to test real-time sync')
    console.log('')
    console.log('🔍 Available Test Accounts:')
    testUsers.forEach(user => {
      console.log(`   - ${user.email} / ${user.password} (${user.role})`)
    })

  } catch (error) {
    console.error('❌ Error creating test users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()
