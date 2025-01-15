import { Suspense } from 'react';
import UserGridSkeleton from '@/components/user-grid-skeleton';
import UserGrid from '@/components/user-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
        <Suspense fallback={<UserGridSkeleton />}>
            <UserGrid />
        </Suspense>
    </div>
  );
}
