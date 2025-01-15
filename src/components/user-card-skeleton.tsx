import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserCardSkeleton() {
  return (
    <Card className="w-full max-w-[200px]">
      <CardContent className="flex flex-col items-center p-6">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
      </CardContent>
    </Card>
  )
}