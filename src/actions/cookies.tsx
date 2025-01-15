'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setCookie() {
    const cookieStore = await cookies();
    cookieStore.set('cookie-test', 'test');

    redirect('/cookies');
}

export async function clearCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('cookie-test');

    redirect('/cookies');
}