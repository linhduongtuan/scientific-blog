// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Placeholder Prisma client with proper mock functions
const prisma = {
  // User model
  user: {
    findUnique: async (args?: any) => null,
    findFirst: async (args?: any) => null,
    findMany: async (args?: any) => [],
    create: async (args?: any) => ({ id: '1', email: 'test@example.com', name: 'Test User' }),
    update: async (args?: any) => ({ id: '1', email: 'test@example.com', name: 'Test User' }),
    delete: async (args?: any) => ({ id: '1', email: 'test@example.com', name: 'Test User' }),
    count: async (args?: any) => 0,
  },
  // Comment model
  comment: {
    findMany: async (args?: any) => [],
    create: async (args?: any) => ({ id: '1', content: 'Test comment' }),
    update: async (args?: any) => ({ id: '1', content: 'Test comment' }),
    delete: async (args?: any) => ({ id: '1', content: 'Test comment' }),
  },
  // Subscription model
  subscription: {
    findFirst: async (args?: any) => null,
    create: async (args?: any) => ({ id: '1', email: 'test@example.com' }),
    delete: async (args?: any) => ({ id: '1', email: 'test@example.com' }),
  },
  // Post model
  post: {
    findMany: async (args?: any) => [],
    findUnique: async (args?: any) => null,
    create: async (args?: any) => ({ id: '1', title: 'Test Post' }),
    update: async (args?: any) => ({ id: '1', title: 'Test Post' }),
    delete: async (args?: any) => ({ id: '1', title: 'Test Post' }),
  },
};

export { prisma };