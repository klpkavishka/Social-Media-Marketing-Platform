import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AudienceSnapshotDocument = AudienceSnapshot & Document;

/**
 * Periodic snapshots of audience demographics and insights
 */
@Schema({
  timestamps: true,
  collection: 'audience_snapshots',
})
export class AudienceSnapshot {
  @Prop({ required: true, type: Date, index: true })
  timestamp: Date;

  @Prop({ required: true, index: true })
  accountId: string;

  @Prop({ required: true, index: true })
  platform: string;

  // Demographics
  @Prop({ type: Object, default: {} })
  ageRange: Record<string, number>;

  @Prop({ type: Object, default: {} })
  gender: Record<string, number>;

  @Prop({ type: [Object], default: [] })
  location: Array<{
    country: string;
    city?: string;
    percentage: number;
  }>;

  // Interests & Behaviors
  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ type: [String], default: [] })
  topHashtags: string[];

  // Active Hours
  @Prop({ type: [Object], default: [] })
  activeHours: Array<{
    hour: number;
    dayOfWeek: string;
    count: number;
  }>;

  // Growth Metrics
  @Prop({ default: 0 })
  totalFollowers: number;

  @Prop({ default: 0 })
  followersGained: number;

  @Prop({ default: 0 })
  followersLost: number;

  // Engagement Stats
  @Prop({ default: 0 })
  averageEngagementRate: number;

  @Prop({ type: Object })
  rawData?: Record<string, any>;
}

export const AudienceSnapshotSchema = SchemaFactory.createForClass(AudienceSnapshot);

// Indexes
AudienceSnapshotSchema.index({ accountId: 1, timestamp: -1 });
AudienceSnapshotSchema.index({ platform: 1, timestamp: -1 });
