'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  copyable?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  copyable = true,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Syntax highlighting helper
  const highlightCode = (code: string, language: string): string => {
    // Simple syntax highlighting for common languages
    let highlighted = code

    if (language === 'javascript' || language === 'typescript' || language === 'jsx' || language === 'tsx') {
      // Keywords
      highlighted = highlighted.replace(
        /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|class|extends|import|export|from|default|as)\b/g,
        '<span class="keyword">$1</span>'
      )
      // Strings
      highlighted = highlighted.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>')
      // Comments
      highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    }

    return highlighted
  }

  const lines = code.split('\n')

  return (
    <div className={`rounded-lg border border-border bg-card overflow-hidden ${className}`}>
      {/* Header */}
      {title && (
        <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
              {language}
            </span>
          </div>
        </div>
      )}

      {/* Code */}
      <div className="relative overflow-x-auto">
        <pre
          className={`p-4 text-sm leading-6 font-mono overflow-x-auto
            ${isDark
              ? 'bg-slate-950 text-slate-50'
              : 'bg-slate-50 text-slate-950'
            }
          `}
        >
          <code className="grid gap-1">
            {lines.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                {showLineNumbers && (
                  <span
                    className={`inline-flex w-8 text-right select-none
                      ${isDark ? 'text-slate-600' : 'text-slate-400'}
                    `}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: highlightCode(line, language) }} />
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer with copy button */}
      {copyable && (
        <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}

      {/* Syntax highlighting styles */}
      <style jsx>{`
        :global(.keyword) {
          color: ${isDark ? '#a78bfa' : '#7c3aed'};
          font-weight: 600;
        }
        :global(.string) {
          color: ${isDark ? '#86efac' : '#16a34a'};
        }
        :global(.comment) {
          color: ${isDark ? '#64748b' : '#94a3b8'};
          font-style: italic;
        }
        :global(.number) {
          color: ${isDark ? '#fbbf24' : '#d97706'};
        }
      `}</style>
    </div>
  )
}
