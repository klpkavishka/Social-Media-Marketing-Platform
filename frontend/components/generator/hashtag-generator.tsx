'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Copy, CheckCheck, Loader2, ImageIcon, Sparkles } from 'lucide-react';

interface PredictionResult {
  category:      string;
  confidence:    number;
  reliable:      boolean;
  top3:          Array<{ category: string; confidence: number }>;
  hashtags:      string[];
  hashtag_count: number;
  processing_ms: number;
  caption:       string;     // "" until Phase 2
}

async function predict(file: File): Promise<PredictionResult> {
  const form = new FormData();
  form.append('image', file);
  const { data } = await axios.post<PredictionResult>('/api/hashtags/predict', form);
  return data;
}

export function HashtagGenerator() {
  const [preview,   setPreview]   = useState<string | null>(null);
  const [caption,   setCaption]   = useState('');     // user-editable
  const [copied,    setCopied]    = useState(false);

  const mutation = useMutation({
    mutationFn: predict,
    onSuccess: (data) => {
      // Only overwrite caption if the model actually returned one
      if (data.caption) setCaption(data.caption);
    },
  });

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setCaption('');          // clear previous caption on new upload
    mutation.mutate(file);
  }, [mutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize:  10 * 1024 * 1024,
  });

  const copyHashtags = () => {
    if (!mutation.data) return;
    navigator.clipboard.writeText(mutation.data.hashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAll = () => {
    if (!mutation.data) return;
    const text = `${caption}\n\n${mutation.data.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const captionIsAI   = !!mutation.data?.caption;
  const hasCaptionModel = captionIsAI;   // flip to true in Phase 2 automatically

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* ── Row 1: Upload + Preview ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'}
            `}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="preview"
                className="max-h-56 mx-auto rounded-lg object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Upload className="w-10 h-10 opacity-40" />
                <p className="font-medium">
                  {isDragActive ? 'Drop it here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm opacity-60">JPEG, PNG, WEBP — max 10 MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {mutation.isPending && (
        <div className="flex items-center gap-3 text-gray-500 px-1">
          <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
          <span className="text-sm">Analysing image…</span>
        </div>
      )}

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {axios.isAxiosError(mutation.error)
              ? mutation.error.response?.data?.message
              : 'Something went wrong. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* ── Row 2: Caption (always visible once image is uploaded) ── */}
      {(preview) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4" />
              Caption
              {hasCaptionModel
                ? <span className="text-xs font-normal text-violet-600 ml-1">AI generated</span>
                : <span className="text-xs font-normal text-gray-400 ml-1">Write your own</span>
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={
                mutation.isPending
                  ? 'Generating…'
                  : 'Write your caption here (AI caption coming soon)'
              }
              rows={3}
              className="resize-none text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {caption.length} / 2,200 characters
              </p>
              {!hasCaptionModel && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                  Caption model coming soon
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Row 3: Hashtag results ── */}
      {mutation.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>
                Hashtags
                <span className="font-normal text-gray-400 ml-2 text-sm">
                  {mutation.data.category} · {mutation.data.confidence}% confidence
                </span>
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyHashtags} className="gap-1">
                  {copied
                    ? <><CheckCheck className="w-4 h-4" /> Copied</>
                    : <><Copy className="w-4 h-4" /> Copy hashtags</>}
                </Button>
                {caption && (
                  <Button variant="outline" size="sm" onClick={copyAll}>
                    Copy all
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Reliability badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium
                ${mutation.data.reliable
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'}`}>
                {mutation.data.reliable ? 'High confidence' : 'Low confidence — review hashtags'}
              </span>
              <span className="text-xs text-gray-400">
                {mutation.data.processing_ms}ms
              </span>
            </div>

            {/* Hashtag pills */}
            <div className="flex flex-wrap gap-2">
              {mutation.data.hashtags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Top 3 breakdown */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500">Top predictions</p>
              {mutation.data.top3.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-20 capitalize text-gray-600">{item.category}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-violet-500 h-1.5 rounded-full"
                      style={{ width: `${item.confidence}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {item.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
