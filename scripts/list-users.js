const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
  try {
    console.log('👥 Current Users in Database:')
    console.log('=============================')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (users.length === 0) {
      console.log('No users found in database.')
      return
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
      console.log('')
    })

    console.log(`Total users: ${users.length}`)
    
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
