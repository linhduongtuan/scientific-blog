import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "temporary-secret-for-development",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscribed = user.subscribed;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscribed = token.subscribed;
      }
      return session;
    },
  },
};

// This is a placeholder for NextAuth.js
export function GET() {
  return new Response("NextAuth route - Replace with actual implementation", {
    status: 200,
  });
}

export function POST() {
  return new Response("NextAuth route - Replace with actual implementation", {
    status: 200,
  });
}