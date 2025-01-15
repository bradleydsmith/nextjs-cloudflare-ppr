import { Button } from "./ui/button";
import Link from "next/link";
import UserCard from "./user-card";

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export default async function UserGrid() {
  const response = await fetch('https://reqres.in/api/users?delay=3');
  const json = await response.json();
  const users = json.data;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {users.map((user: User) => (
          <Link key={user.id} href={`/users/${user.id}`}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
      <Link href="/client-component" className="mt-4">
        <Button>Go to navigation / client component test</Button>
      </Link>
    </div>
  )
}

