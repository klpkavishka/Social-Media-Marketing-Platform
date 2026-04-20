import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowerGrowthDocument = FollowerGrowth & Document;

/**
 * Historical follower count tracking
 * Stores daily snapshots of follower counts
 */
@Schema({
  timestamps: true,
  collection: 'follower_growth',
  timeseries: {
    timeField: 'date',
    metaField: 'metadata',
    granularity: 'hours',
  },
})
export class FollowerGrowth {
  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ required: true, index: true })
  accountId: string;

  @Prop({ required: true, index: true })
  platform: string;

  @Prop({ required: true })
  count: number;

  @Prop({ default: 0 })
  gained: number;

  @Prop({ default: 0 })
  lost: number;

  @Prop({ default: 0 })
  netGrowth: number;

  // Growth rate as percentage
  @Prop({ default: 0 })
  growthRate: number;

  // Metadata for time-series indexing
  @Prop({ type: Object })
  metadata: {
    accountId: string;
    platform: string;
  };
}

export const FollowerGrowthSchema = SchemaFactory.createForClass(FollowerGrowth);

// Indexes
FollowerGrowthSchema.index({ accountId: 1, date: -1 });
FollowerGrowthSchema.index({ platform: 1, date: -1 });
FollowerGrowthSchema.index({ date: -1 });
