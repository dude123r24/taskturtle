'use server';

import { signIn, signOut } from '@/lib/auth';

export async function serverGoogleSignIn(formData?: FormData) {
    const callbackUrl = (formData?.get('callbackUrl') as string) || '/dashboard';
    await signIn('google', { redirectTo: callbackUrl });
}

export async function serverSignOut() {
    await signOut({ redirectTo: '/login' });
}
