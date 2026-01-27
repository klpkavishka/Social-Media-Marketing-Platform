import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-6xl font-bold">404</h2>
      <h3 className="text-2xl font-semibold">Page Not Found</h3>
      <p className="text-muted-foreground">Could not find the requested resource</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
