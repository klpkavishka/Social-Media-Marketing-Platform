'use client'

import React from 'react'
import { X } from 'lucide-react'

interface LegalModalProps {
  type: 'terms' | 'privacy'
  isOpen: boolean
  onClose: () => void
}

export function LegalModal({ type, isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null

  const isTerms = type === 'terms'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-screen overflow-y-auto mx-4 rounded-lg bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isTerms ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
          {isTerms ? (
            <div className="space-y-4 text-muted-foreground text-sm">
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using ArcFlow, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on ArcFlow&apos;s website for personal, non-commercial transitory viewing only.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">3. Disclaimer</h3>
                <p>The materials on ArcFlow&apos;s website are provided on an &apos;as is&apos; basis. ArcFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">4. Limitations</h3>
                <p>In no event shall ArcFlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ArcFlow&apos;s website.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">5. Accuracy of Materials</h3>
                <p>The materials appearing on ArcFlow&apos;s website could include technical, typographical, or photographic errors. ArcFlow does not warrant that any of the materials on its website are accurate, complete, or current.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">6. Links</h3>
                <p>ArcFlow has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ArcFlow of the site. Use of any such linked website is at the user&apos;s own risk.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">7. Modifications</h3>
                <p>ArcFlow may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">8. Governing Law</h3>
                <p>These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
              </section>
            </div>
          ) : (
            <div className="space-y-4 text-muted-foreground text-sm">
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h3>
                <p>We collect information you provide directly, such as when you create an account, make a purchase, or contact us. This includes name, email address, phone number, and payment information.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send transactional and promotional communications, and personalize your experience.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">3. Information Sharing</h3>
                <p>We do not sell or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">4. Data Security</h3>
                <p>We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h3>
                <p>You have the right to access, update, or delete your personal information at any time by contacting us. You may also opt-out of receiving promotional communications.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">6. Cookies</h3>
                <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. Most web browsers are set to accept cookies by default.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">7. Third-Party Links</h3>
                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or contents of these external sites.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">8. Changes to Privacy Policy</h3>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by updating the &quot;Last Updated&quot; date of this policy.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">9. Contact Us</h3>
                <p>If you have any questions about this privacy policy, please contact us at privacy@arcflow.io</p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-border bg-background p-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
