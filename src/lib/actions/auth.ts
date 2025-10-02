'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getDomainFromHeaders } from '@/lib/server-utils';
import bcrypt from 'bcryptjs';

export async function login(_: unknown, formData: FormData) {
  const host = await getDomainFromHeaders();
  const domain = await db.domain.findFirst({
    where: {
      host: host,
    },
  });
  if (!domain) {
    return { error: 'Domain not found' };
  }
  const password = formData.get('password')?.toString();
  if (!password) {
    return { error: 'Password is required' };
  }
  const password_match = await bcrypt.compare(password, domain.admin_password);
  if (!password_match) {
    return { error: 'Invalid password' };
  }

  (await cookies()).set('admin_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 6, // 6 hours
  });

  redirect('/-/admin');
}

export async function logout() {
  (await cookies()).set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  redirect('/');
}
