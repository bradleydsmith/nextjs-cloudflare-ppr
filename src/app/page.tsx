import { Suspense } from 'react';
import UserGridSkeleton from '@/components/user-grid-skeleton';
import UserGrid from '@/components/user-grid';

export default function Home() {
  return (
    <div>
        <Suspense fallback={<UserGridSkeleton />}>
            <UserGrid />
        </Suspense>
    </div>
  );
}
