'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does the AI content generation work?',
      answer:
        'Our AI analyzes your brand voice, audience preferences, and content history to generate engaging captions and hashtags. The suggestions are tailored to each social platform and include best practices for maximum engagement.',
    },
    {
      question: 'Can I manage multiple social media accounts?',
      answer:
        'Yes! All plans support multiple social accounts. The Professional and Enterprise plans offer unlimited accounts. You can easily switch between accounts and manage them all from a single dashboard.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Absolutely! We offer a 14-day free trial for all plans. No credit card required. You can experience all features and decide which plan works best for your needs.',
    },
    {
      question: 'What analytics do you provide?',
      answer:
        'We provide comprehensive analytics including engagement rates, follower growth, reach, impressions, click-through rates, and audience demographics. Professional and above plans include advanced analytics and custom reports.',
    },
    {
      question: 'How does team collaboration work?',
      answer:
        'Team members can be added with customizable roles (admin, manager, creator, analyst). Approval workflows ensure content quality, and activity logs track all changes. All conversations happen within the platform.',
    },
    {
      question: 'Can I integrate with other tools?',
      answer:
        'Yes, we integrate with popular tools like Zapier, Slack, Google Sheets, and more. Enterprise plans include custom API access for building your own integrations.',
    },
    {
      question: 'What support options are available?',
      answer:
        'Starter plans include community support. Professional plans offer email support, and Enterprise plans include 24/7 phone support and a dedicated account manager.',
    },
    {
      question: 'How secure is my data?',
      answer:
        'We use enterprise-grade encryption, SOC 2 compliance, and regular security audits. Your data is stored on secure servers with automatic backups and disaster recovery protocols.',
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-6">
            Frequently Asked <span className="text-gradient-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground font-sora">
            Everything you need to know about ArcFlow
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border/30 rounded-lg bg-background hover:border-border/60 transition-colors overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-left font-semibold text-foreground text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border/30">
                  <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
