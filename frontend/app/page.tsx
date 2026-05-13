'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Brain, Calendar, Users, Zap, Target } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Logo } from '@/components/brand/logo'
import { BackgroundPattern, FeatureGradientBg, PremiumCard } from '@/components/brand/visual-elements'
import { TrustIndicators, CompaniesUsing } from '@/components/landing/trust-indicators'
import { IndustrySections } from '@/components/landing/industry-sections'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FAQSection } from '@/components/landing/faq-section'
import { NewsletterSignup } from '@/components/landing/newsletter-signup'
import { CTASection } from '@/components/landing/cta-section'

export default function LandingPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect in progress
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <BackgroundPattern />

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex items-center justify-between">
          <Logo width={40} height={40} showName={true} />
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
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <h1 className="mb-6 text-gradient-primary font-space-grotesk text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          AI-Powered Social Media
          <br />
          <span className="text-gradient-secondary">Marketing Hub</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-muted-foreground font-sora leading-relaxed">
          Streamline your organization&apos;s social media presence with intelligent content creation,
          scheduling, and analytics—all in one platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 font-semibold">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="font-semibold border-2">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="mb-4 text-center text-4xl md:text-5xl font-bold font-space-grotesk">Powerful Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-sora">
          Everything you need to manage social media effectively and at scale
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">AI Content Generation</h3>
              <p className="text-muted-foreground">Generate engaging captions, hashtags, and post ideas tailored to your organization&apos;s voice.</p>
            </div>
            <FeatureGradientBg index={0} />
          </PremiumCard>
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">Smart Scheduling</h3>
              <p className="text-muted-foreground">Publish content at optimal times across multiple platforms with intelligent scheduling.</p>
            </div>
            <FeatureGradientBg index={1} />
          </PremiumCard>
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">Advanced Analytics</h3>
              <p className="text-muted-foreground">Track engagement, measure performance, and get AI-powered insights to improve your strategy.</p>
            </div>
            <FeatureGradientBg index={2} />
          </PremiumCard>
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">Team Collaboration</h3>
              <p className="text-muted-foreground">Manage multiple users with role-based permissions and approval workflows.</p>
            </div>
            <FeatureGradientBg index={3} />
          </PremiumCard>
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">Multi-Platform Support</h3>
              <p className="text-muted-foreground">Connect and manage Facebook, Instagram, Twitter, LinkedIn, TikTok, and YouTube.</p>
            </div>
            <FeatureGradientBg index={4} />
          </PremiumCard>
          <PremiumCard>
            <div className="relative z-10">
              <div className="mb-4 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold font-space-grotesk">Campaigns</h3>
              <p className="text-muted-foreground">Plan, track, and optimize your marketing campaigns.</p>
            </div>
            <FeatureGradientBg index={5} />
          </PremiumCard>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Companies Using */}
      <CompaniesUsing />

      {/* Industry Sections */}
      <IndustrySections />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Logo width={32} height={32} showName={true} />
              <p className="text-xs text-muted-foreground mt-2">AI-Powered Social Media Management Platform</p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:hello@arcflow.io" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="mailto:support@arcflow.io" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 text-center text-xs text-muted-foreground">
            <p>&copy; 2026 ArcFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
