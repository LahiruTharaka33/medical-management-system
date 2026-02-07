import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as unknown as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string(),
            password: z.string().min(6),
            role: z.string().optional() // Make role optional in zod schema to handle legacy logins if any
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, role } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Role-based validation
            // If the login form expects a "USER" but the user is "ADMIN", deny login (or redirect logic handles it, but deny is safer here)
            // Actually, we said: Normal login form -> normal user only. Admin login form -> admin user only.

            // If 'role' is passed from the form (we will make sure forms pass it), check it.
            // If role is 'ADMIN', user.role must be 'ADMIN'.
            // If role is 'USER' (or undefined/empty which implies normal login), user.role must NOT be 'ADMIN' (or allow both? User asked for strict separation).
            // Request: "normal login page ---> normal user only", "admin login page ---> admin user only"

            if (role === 'ADMIN' && user.role !== 'ADMIN') {
              console.log('Access Denied: Non-admin trying to login as admin');
              return null;
            }
            if (role === 'USER' && user.role === 'ADMIN') {
              console.log('Access Denied: Admin trying to login as normal user');
              return null;
            }
            // Compatibility: if currently generic user is admin@med with role ADMIN, prevent them from logging in without role='ADMIN' param
            if (!role && user.role === 'ADMIN') {
              // If no role specified, assume normal user login.
              console.log('Access Denied: Admin trying to generic login');
              return null;
            }

            return user;
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
