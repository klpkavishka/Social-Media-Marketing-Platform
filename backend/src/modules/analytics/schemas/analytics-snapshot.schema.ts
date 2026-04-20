import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsSnapshotDocument = AnalyticsSnapshot & Document;

/**
 * Time-series analytics snapshot for social accounts
 * Stores periodic snapshots of account metrics
 */
@Schema({
  timestamps: true,
  collection: 'analytics_snapshots',
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours',
  },
})
export class AnalyticsSnapshot {
  @Prop({ required: true, type: Date, index: true })
  timestamp: Date;

  @Prop({ required: true, index: true })
  accountId: string;

  @Prop({ required: true, index: true })
  platform: string;

  // Engagement Metrics
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

  // Follower Metrics
  @Prop({ default: 0 })
  followers: number;

  @Prop({ default: 0 })
  followerGrowth: number;

  // Additional Metrics
  @Prop({ default: 0 })
  videoViews: number;

  @Prop({ default: 0 })
  profileViews: number;

  // Metadata for time-series indexing
  @Prop({ type: Object })
  metadata: {
    accountId: string;
    platform: string;
    dataSource: string; // 'api', 'manual', 'scheduled'
  };

  // Additional context
  @Prop({ type: Object })
  rawData?: Record<string, any>;
}

export const AnalyticsSnapshotSchema = SchemaFactory.createForClass(AnalyticsSnapshot);

// Create indexes for efficient querying
AnalyticsSnapshotSchema.index({ accountId: 1, timestamp: -1 });
AnalyticsSnapshotSchema.index({ platform: 1, timestamp: -1 });
AnalyticsSnapshotSchema.index({ timestamp: -1 });
