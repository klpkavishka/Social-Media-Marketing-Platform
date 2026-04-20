'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cloud, Image as ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void
  selectedImage?: { file: File; preview: string }
}

export function ImageUploader({ onImageSelect, selectedImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed')
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 10MB')
      return false
    }
    return true
  }

  const handleFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        onImageSelect(file, preview)
        toast.success('Image selected successfully')
      }
      reader.readAsDataURL(file)
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files?.length) {
      handleFile(files[0])
    }
  }

  const handleClear = () => {
    onImageSelect(null, '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!selectedImage?.preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="Upload image"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Cloud className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Drop image here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            </button>
            <p className="absolute bottom-2 text-xs text-muted-foreground">Max 10MB • JPG, PNG, WebP</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={selectedImage.preview}
                alt="Selected"
                fill
                className="object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{selectedImage.file.name}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              Change Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
