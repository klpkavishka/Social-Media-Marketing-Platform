export class HashtagPredictionDto {
  category: string;
  confidence: number;
  reliable: boolean;
  top3: Array<{ category: string; confidence: number }>;
  hashtags: string[];
  hashtag_count: number;
  processing_ms: number;
  caption: string;
}
