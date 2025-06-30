import NextAuth from "next-auth/next";
import { authOptions } from "./authOptions"
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Add your NextAuth configuration here
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
