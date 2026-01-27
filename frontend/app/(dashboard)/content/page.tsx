import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical } from 'lucide-react'

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content</h1>
          <p className="text-muted-foreground">Manage your social media posts and content</p>
        </div>
        <Link href="/dashboard/content/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">All</Button>
        <Button variant="ghost" size="sm">Published</Button>
        <Button variant="ghost" size="sm">Scheduled</Button>
        <Button variant="ghost" size="sm">Draft</Button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted" />
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Post Title {i}</CardTitle>
                <p className="text-xs text-muted-foreground">Created 2 days ago</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Scheduled</Badge>
                <span className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
