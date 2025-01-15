import { Button } from '@/components/ui/button';
import { setCookie, clearCookie } from '@/actions/cookies';
import { cookies } from 'next/headers'
import { Suspense } from 'react';
import Link from 'next/link';

async function CookieSet() {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has('cookie-test');

    return (
        <div>
            Has Cookie: {hasCookie ? 'true' : 'false'}
        </div>
    )
}

export default function CookiePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <Suspense fallback={<div>Has Cookie:</div>}>
                <CookieSet />
            </Suspense>
            <div className="flex gap-2">
                <form action={setCookie}>
                    <Button type="submit">Set Cookie</Button>
                </form>
                <form action={clearCookie}>
                    <Button type="submit">Clear Cookie</Button>
                </form>
            </div>
            <div className="mt-4">
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    )
}