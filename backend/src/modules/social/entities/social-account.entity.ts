import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  TIKTOK = 'tiktok',
}

export enum AccountStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

@Entity('social_accounts')
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  platform: SocialPlatform;

  @Column()
  accountName: string;

  @Column({ unique: true })
  accountId: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.DISCONNECTED,
  })
  status: AccountStatus;

  @Column({ type: 'text', nullable: true, select: false })
  accessToken: string;

  @Column({ type: 'text', nullable: true, select: false })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiry: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
