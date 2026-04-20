import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  goals: string[];

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  budget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  spend: number;

  @Column({ type: 'simple-array', nullable: true })
  platforms: SocialPlatform[];

  @Column({ type: 'jsonb', nullable: true })
  targetAudience: {
    ageRange?: { min: number; max: number };
    gender?: string[];
    locations?: string[];
    interests?: string[];
    languages?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  targeting: Record<string, any>;

  // Performance metrics
  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  engagements: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'integer', default: 0 })
  reach: number;

  // Relationships
  @ManyToMany(() => Content, (content) => content.campaigns, { cascade: true })
  @JoinTable({
    name: 'campaign_contents',
    joinColumn: { name: 'campaignId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contentId', referencedColumnName: 'id' },
  })
  contents: Content[];

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get roi(): number {
    if (this.spend === 0) return 0;
    // ROI = ((conversions value - spend) / spend) * 100
    // Assuming each conversion is worth something, for now use a simple engagement-based ROI
    const value = this.conversions * 100 + this.engagements * 1; // Example valuation
    return ((value - Number(this.spend)) / Number(this.spend)) * 100;
  }

  get cpe(): number {
    // Cost Per Engagement
    if (this.engagements === 0) return 0;
    return Number(this.spend) / this.engagements;
  }

  get cpc(): number {
    // Cost Per Click
    if (this.clicks === 0) return 0;
    return Number(this.spend) / this.clicks;
  }

  get ctr(): number {
    // Click Through Rate
    if (this.impressions === 0) return 0;
    return (this.clicks / this.impressions) * 100;
  }

  get engagementRate(): number {
    if (this.impressions === 0) return 0;
    return (this.engagements / this.impressions) * 100;
  }
}
