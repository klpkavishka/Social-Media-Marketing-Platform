import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Brain, Calendar, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">UniSocial</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
          AI-Powered Social Media
          <br />
          <span className="text-primary">Management for Universities</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Streamline your university's social media presence with intelligent content creation,
          scheduling, and analytics—all in one platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Powerful Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI Content Generation"
            description="Generate engaging captions, hashtags, and post ideas tailored to your university's voice."
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8" />}
            title="Smart Scheduling"
            description="Publish content at optimal times across multiple platforms with intelligent scheduling."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Advanced Analytics"
            description="Track engagement, measure performance, and get AI-powered insights to improve your strategy."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Team Collaboration"
            description="Manage multiple users with role-based permissions and approval workflows."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Multi-Platform Support"
            description="Connect and manage Facebook, Instagram, Twitter, LinkedIn, TikTok, and YouTube."
          />
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Sentiment Analysis"
            description="Monitor brand reputation with AI-powered sentiment analysis of comments and mentions."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 UniSocial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
