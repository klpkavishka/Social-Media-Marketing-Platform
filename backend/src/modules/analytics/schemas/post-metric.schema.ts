import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostMetricDocument = PostMetric & Document;

/**
 * Time-series metrics for individual posts
 * Tracks performance of specific content pieces over time
 */
@Schema({
  timestamps: true,
  collection: 'post_metrics',
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours',
  },
})
export class PostMetric {
  @Prop({ required: true, type: Date, index: true })
  timestamp: Date;

  @Prop({ required: true, index: true })
  postId: string;

  @Prop({ required: true, index: true })
  accountId: string;

  @Prop({ required: true, index: true })
  platform: string;

  @Prop()
  contentId?: string; // Internal content ID if tracked

  @Prop()
  campaignId?: string; // Associated campaign ID

  // Post Metrics
  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  reach: number;

  @Prop({ default: 0 })
  engagement: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: 0 })
  saves: number;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: 0 })
  videoViews: number;

  // Engagement Rate (calculated)
  @Prop({ default: 0 })
  engagementRate: number;

  // Metadata for time-series indexing
  @Prop({ type: Object })
  metadata: {
    postId: string;
    accountId: string;
    platform: string;
    contentType?: string; // 'image', 'video', 'carousel', 'text'
  };

  // Post details snapshot
  @Prop({ type: Object })
  postDetails?: {
    title?: string;
    description?: string;
    contentType?: string;
    publishedAt?: Date;
    hashtags?: string[];
  };

  // Raw API response (for debugging)
  @Prop({ type: Object })
  rawData?: Record<string, any>;
}

export const PostMetricSchema = SchemaFactory.createForClass(PostMetric);

// Create indexes for efficient querying
PostMetricSchema.index({ postId: 1, timestamp: -1 });
PostMetricSchema.index({ accountId: 1, timestamp: -1 });
PostMetricSchema.index({ platform: 1, timestamp: -1 });
PostMetricSchema.index({ campaignId: 1, timestamp: -1 });
PostMetricSchema.index({ timestamp: -1 });
