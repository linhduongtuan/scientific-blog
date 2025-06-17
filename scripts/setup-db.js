const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  try {
    // Create demo users
    console.log('👥 Creating demo users...')
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'ADMIN',
        subscribed: true,
        emailVerified: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'USER',
        subscribed: false,
        emailVerified: new Date()
      },
      {
        name: 'Premium User',
        email: 'premium@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'USER',
        subscribed: true,
        emailVerified: new Date()
      }
    ]

    for (const userData of users) {
      try {
        const user = await prisma.user.upsert({
          where: { email: userData.email },
          update: userData,
          create: userData
        })
        console.log(`✅ Created/updated user: ${user.email}`)
      } catch (error) {
        console.log(`⚠️ User ${userData.email} might already exist`)
      }
    }

    // Create some demo comments
    console.log('💬 Creating demo comments...')
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    const premiumUser = await prisma.user.findUnique({
      where: { email: 'premium@example.com' }
    })

    if (adminUser && premiumUser) {
      const comments = [
        {
          content: 'Great article on transformers! The explanation of self-attention is very clear.',
          postId: 'understanding-transformers',
          userId: adminUser.id
        },
        {
          content: 'I found the healthcare applications particularly interesting. Looking forward to more posts on this topic.',
          postId: 'ml-in-healthcare',
          userId: premiumUser.id
        },
        {
          content: 'The Python setup guide was exactly what I needed. Thanks for the detailed instructions!',
          postId: 'scientific-python-guide',
          userId: premiumUser.id
        }
      ]

      for (const commentData of comments) {
        try {
          await prisma.comment.create({
            data: commentData
          })
          console.log(`✅ Created comment for post: ${commentData.postId}`)
        } catch (error) {
          console.log(`⚠️ Comment might already exist for post: ${commentData.postId}`)
        }
      }
    }

    console.log('🎉 Database setup complete!')
    console.log('\n📋 Demo Users Created:')
    console.log('Admin: admin@example.com / password123')
    console.log('User: user@example.com / password123')
    console.log('Premium: premium@example.com / password123')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })