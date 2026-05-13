'use client'

import { Sparkles, FileText, ShoppingCart, Heart, Briefcase } from 'lucide-react'

interface ContentTemplatesProps {
  onSelectTemplate: (template: string) => void
}

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  template: string
}

export function ContentTemplates({ onSelectTemplate }: ContentTemplatesProps) {
  const templates: Template[] = [
    {
      id: 'announcement',
      name: 'Announcement',
      description: 'Major news or update',
      icon: Sparkles,
      template: '📢 We&apos;re excited to announce...\n\n[Announcement details here]\n\n🔗 Learn more in our bio!',
    },
    {
      id: 'promotion',
      name: 'Promotion',
      description: 'Special offer or sale',
      icon: ShoppingCart,
      template: '🎉 Limited Time Offer!\n\n✨ Get [offer details]\n📅 Valid until [date]\n🛍️ Shop now - link in bio!\n\n#sale #offer',
    },
    {
      id: 'engagement',
      name: 'Engagement',
      description: 'Ask audience question',
      icon: Heart,
      template: 'Quick question for you...\n\n❓ [Your question here]\n\nDrop your answer below! 👇\n\n#question #community',
    },
    {
      id: 'educational',
      name: 'Educational',
      description: 'Share tip or insight',
      icon: FileText,
      template: '💡 Pro Tip:\n\n[Your tip/insight]\n\n✅ [Benefit or result]\n\n#tips #learning #[topic]',
    },
    {
      id: 'testimonial',
      name: 'Testimonial',
      description: 'Customer success story',
      icon: Briefcase,
      template: '🌟 Customer Spotlight\n\n&quot;[Customer quote]&quot;\n- [Customer name], [Title]\n\n[Company logo/context]\n\n#testimonial #success',
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Content Templates</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.template)}
            className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-accent/50 flex-shrink-0">
                <template.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
