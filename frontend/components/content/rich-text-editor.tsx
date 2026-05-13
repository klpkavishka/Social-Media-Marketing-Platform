'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, List, LinkIcon, Smile, Heading2 } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Write your content here...' }: RichTextEditorProps) {
  const [isActive, setIsActive] = useState(false)

  const applyFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || 'text'
    const newValue = value.substring(0, start) + `[${format}]${selectedText}[/${format}]` + value.substring(end)
    onChange(newValue)
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="border-b bg-muted/50 p-3 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('b')}
          title="Bold"
          className="gap-2"
        >
          <Bold className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Bold</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('i')}
          title="Italic"
          className="gap-2"
        >
          <Italic className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Italic</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('u')}
          title="Underline"
          className="gap-2"
        >
          <Underline className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Underline</span>
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('h2')}
          title="Heading"
          className="gap-2"
        >
          <Heading2 className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Heading</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('ul')}
          title="List"
          className="gap-2"
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">List</span>
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('link')}
          title="Link"
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Link</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Emoji"
          className="gap-2"
        >
          <Smile className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Emoji</span>
        </Button>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        placeholder={placeholder}
        className={`w-full p-4 resize-none outline-none bg-background text-foreground placeholder:text-muted-foreground min-h-64 font-inter transition-colors ${
          isActive ? 'ring-2 ring-primary ring-inset' : ''
        }`}
      />
    </div>
  )
}
