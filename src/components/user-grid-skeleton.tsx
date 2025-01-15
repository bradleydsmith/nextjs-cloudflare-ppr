import Link from 'next/link';
import { Button } from './ui/button';
import UserCardSkeleton from './user-card-skeleton';

export default function UserGridSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {[...Array(6)].map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
      <Link href="/client-component" className="mt-4">
        <Button>Go to navigation / client component test</Button>
      </Link>
    </div>
  )
}