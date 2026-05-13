'use client'

import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: May 10, 2026</p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing and using ArcFlow, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on ArcFlow&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on ArcFlow&apos;s website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">3. Disclaimer</h2>
              <p>The materials on ArcFlow&apos;s website are provided &apos;as is&apos;. ArcFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">4. Limitations</h2>
              <p>In no event shall ArcFlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ArcFlow&apos;s website, even if ArcFlow or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">5. Accuracy of Materials</h2>
              <p>The materials appearing on ArcFlow&apos;s website could include technical, typographical, or photographic errors. ArcFlow does not warrant that any of the materials on its website are accurate, complete, or current. ArcFlow may make changes to the materials contained on its website at any time without notice.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">6. Links</h2>
              <p>ArcFlow has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ArcFlow of the site. Use of any such linked website is at the user&apos;s own risk.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">7. Modifications</h2>
              <p>ArcFlow may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">9. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at legal@arcflow.io</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
