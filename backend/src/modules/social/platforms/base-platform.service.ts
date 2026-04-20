import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export interface PlatformAnalytics {
  impressions: number;
  reach: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  clicks?: number;
  followers: number;
  followerGrowth: number;
  videoViews?: number;
  profileViews?: number;
}

export interface PostAnalytics {
  postId: string;
  platform: string;
  impressions: number;
  reach: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  clicks?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AudienceInsights {
  demographics: {
    ageRange: Record<string, number>;
    gender: Record<string, number>;
    location: Array<{ country: string; city?: string; percentage: number }>;
  };
  interests?: string[];
  activeHours?: Array<{ hour: number; dayOfWeek: string; count: number }>;
}

@Injectable()
export abstract class BasePlatformService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {}

  /**
   * Fetch account-level analytics for a date range
   */
  abstract getAccountAnalytics(
    accountId: string,
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics>;

  /**
   * Fetch analytics for specific posts
   */
  abstract getPostAnalytics(
    accountId: string,
    accessToken: string,
    postIds: string[],
  ): Promise<PostAnalytics[]>;

  /**
   * Fetch audience insights
   */
  abstract getAudienceInsights(
    accountId: string,
    accessToken: string,
  ): Promise<AudienceInsights>;

  /**
   * Validate and refresh token if needed
   */
  abstract validateToken(
    accessToken: string,
    refreshToken?: string,
  ): Promise<{ valid: boolean; newToken?: string }>;

  /**
   * Get follower count
   */
  abstract getFollowerCount(
    accountId: string,
    accessToken: string,
  ): Promise<number>;

  /**
   * Get historical follower growth
   */
  abstract getFollowerGrowth(
    accountId: string,
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: Date; count: number }>>;
}
