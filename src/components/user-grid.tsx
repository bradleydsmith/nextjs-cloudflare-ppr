import UserCard from "./user-card"
import UserGridSkeleton from "./user-grid-skeleton"

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export default async function UserGrid({users: User}) {
  const response = await fetch('https://reqres.in/api/users?delay=3');
  const json = await response.json();
  const users = json.data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

