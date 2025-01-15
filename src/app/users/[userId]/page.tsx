import { Suspense } from 'react';
import UserCardSkeleton from '@/components/user-card-skeleton';
import UserCard from '@/components/user-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function SingleUserCard({
    params
}: {
    params: Promise<{userId: string}>
}) {
    const userId = (await params).userId;
    const response = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
    const json = await response.json();
    const user = json.data;

    return (
        <UserCard user={user} />
    )
}

export default function Profile({
    params
}: {
    params: Promise<{userId: string}>
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <Suspense fallback={<UserCardSkeleton />}>
                <SingleUserCard params={params} />
            </Suspense>
            <Link href="/" className="mt-4">
                <Button>Go Home</Button>
            </Link>
        </div>
    )
}