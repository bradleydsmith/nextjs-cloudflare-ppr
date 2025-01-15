import { Suspense } from 'react';
import UserGridSkeleton from '@/components/user-grid-skeleton';
import UserGrid from '@/components/user-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <Suspense fallback={<UserGridSkeleton />}>
            <UserGrid />
        </Suspense>
        <Link href="/client-component" className="mt-4">
            <Button>Go to navigation / client component test</Button>
        </Link>
        <Link href="/cookies" className="mt-4">
            <Button>Go to Cookies / Server Actions</Button>
        </Link>
    </div>
  );
}
