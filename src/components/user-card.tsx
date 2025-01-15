import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface UserCardProps {
  name: string;
  first_name: string;
  last_name: string;
}

export default function UserCard({ user }: UserCardProps) {
  console.log(user);
  const initials = `${user.first_name.substr(0, 1)} ${user.last_name.substr(0, 1)}`;
  const name = `${user.first_name} ${user.last_name}`;

  return (
    <Card className="w-full max-w-[200px]">
      <CardContent className="flex flex-col items-center p-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold text-center">{name}</h3>
      </CardContent>
    </Card>
  )
}