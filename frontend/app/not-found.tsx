import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, LogIn, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-slate-50 to-slate-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-950">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="max-w-md text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          {'\n'}Make sure you&apos;re logged in to access the dashboard.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/login">
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
      </div>

      <div className="mt-12 w-full max-w-md rounded-lg border bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">Need Help?</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• You must be logged in to access the dashboard</li>
          <li>• Visit the <Link href="/login" className="underline hover:text-blue-600">login page</Link> to sign in</li>
          <li>• Don&apos;t have an account? <Link href="/register" className="underline hover:text-blue-600">Register here</Link></li>
          <li>• Contact support if you encounter other issues</li>
        </ul>
      </div>
    </div>
  )
}
