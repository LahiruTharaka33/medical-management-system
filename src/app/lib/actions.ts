'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { LoginFormSchema, SignupFormSchema } from '@/app/lib/definitions';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(prevState: string | undefined, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return 'Invalid fields.';
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return 'Registration failed.';
  }

  // No redirect in try/catch to match useActionState pattern, 
  // but usually we redirect after success. 
  // For now returning undefined implies success in some patterns, 
  // but let's return a success message or handle client side.
  // Actually, we should probably sign them in or redirect using 'redirect' from next/navigation.
  // But for this tutorial style, let's keep it simple.
  
  // We can call signIn here too if we want auto-login.
  // await signIn('credentials', formData); 
  // But for now, let's just return success message.
  return 'Success';
}
