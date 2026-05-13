'use client'

import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Logo width={40} height={40} showName={true} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: May 10, 2026</p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>ArcFlow (&quot;we&quot; or &quot;us&quot; or &quot;our&quot;) operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">2. Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our service to you.</p>
              <h3 className="font-semibold text-foreground">Types of Data Collected:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&quot;Personal Data&quot;). This may include, but is not limited to:
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                    <li>Cookies and Usage Data</li>
                  </ul>
                </li>
                <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used (&quot;Usage Data&quot;). This may include information such as your computer&apos;s Internet Protocol address, browser type, browser version, the pages you visit, the time and date of your visit, and other diagnostic data.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">3. Use of Data</h2>
              <p>ArcFlow uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">4. Security of Data</h2>
              <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">5. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the top of this Privacy Policy.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>By email: privacy@arcflow.io</li>
                <li>By mail: ArcFlow, Inc., Address, City, State, ZIP</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">7. Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data. To exercise these rights, please contact us at privacy@arcflow.io</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">8. Cookies</h2>
              <p>We use cookies and similar tracking technologies to track activity on our Service. Most web browsers are set to accept cookies by default. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
