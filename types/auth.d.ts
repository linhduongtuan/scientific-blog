declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      subscribed?: boolean;
    };
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    subscribed?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    subscribed?: boolean;
  }
}