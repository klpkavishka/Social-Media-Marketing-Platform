import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Campaign } from '../../campaigns/entities/campaign.entity';

export enum ContentType {
  POST = 'post',
  STORY = 'story',
  REEL = 'reel',
  VIDEO = 'video',
  IMAGE = 'image',
}

export enum ContentStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.POST,
  })
  type: ContentType;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ type: 'jsonb', nullable: true })
  media: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  platforms: string[];

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  aiSuggestions: Record<string, any>;

  @ManyToMany(() => Campaign, (campaign) => campaign.contents)
  campaigns: Campaign[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
