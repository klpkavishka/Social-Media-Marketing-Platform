import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserCampaignDocument = UserCampaign & Document;

@Schema({ timestamps: true, collection: 'user_campaigns' })
export class UserCampaign {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop([String])
  goals?: string[];

  @Prop({ default: 'draft' })
  status: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: 0 })
  budget: number;

  @Prop({ default: 0 })
  spend: number;

  @Prop([String])
  platforms?: string[];

  @Prop({ type: Object })
  targetAudience?: {
    ageRange?: { min?: number; max?: number };
    gender?: string[];
    locations?: string[];
    interests?: string[];
    languages?: string[];
  };

  @Prop({ type: Object })
  targeting?: Record<string, any>;

  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: 0 })
  engagements: number;

  @Prop({ default: 0 })
  conversions: number;

  @Prop({ default: 0 })
  reach: number;

  @Prop([String])
  contentIds?: string[];

  @Prop()
  userId?: string;
}

export const UserCampaignSchema = SchemaFactory.createForClass(UserCampaign);

UserCampaignSchema.index({ createdAt: -1 });
UserCampaignSchema.index({ status: 1 });
