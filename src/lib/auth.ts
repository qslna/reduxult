import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

// Define the credentials schema
const credentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Admin credentials (in production, these should be in a database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  // Password: redux2025 (hashed)
  password: '$2b$10$X5H5gQwHH.r7Z8YqxNXB5.QW1o7JzqU6VGN.fJ9.Ym5TrT.0K2N4G'
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const { username, password } = credentialsSchema.parse(credentials);
          
          // Check username
          if (username !== ADMIN_CREDENTIALS.username) {
            return null;
          }
          
          // Check password
          const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
          
          if (!isValidPassword) {
            return null;
          }
          
          // Return user object
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@redux66.com',
            role: 'admin'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Middleware to check if user is authenticated
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

// Middleware to check if user is admin
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'admin';
}