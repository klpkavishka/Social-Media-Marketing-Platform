import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount, SocialPlatform, AccountStatus } from '../entities/social-account.entity';
import {
  InstagramService,
  FacebookService,
  TwitterService,
  LinkedInService,
  TikTokService,
  BasePlatformService,
  PlatformAnalytics,
  PostAnalytics,
  AudienceInsights,
} from './index';

@Injectable()
export class PlatformAnalyticsService {
  private readonly logger = new Logger(PlatformAnalyticsService.name);

  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly instagramService: InstagramService,
    private readonly facebookService: FacebookService,
    private readonly twitterService: TwitterService,
    private readonly linkedInService: LinkedInService,
    private readonly tiktokService: TikTokService,
  ) {}

  /**
   * Get the appropriate platform service for a given platform
   */
  private getPlatformService(platform: SocialPlatform): BasePlatformService {
    const services: Record<SocialPlatform, BasePlatformService> = {
      [SocialPlatform.INSTAGRAM]: this.instagramService,
      [SocialPlatform.FACEBOOK]: this.facebookService,
      [SocialPlatform.TWITTER]: this.twitterService,
      [SocialPlatform.LINKEDIN]: this.linkedInService,
      [SocialPlatform.TIKTOK]: this.tiktokService,
    };

    return services[platform];
  }

  /**
   * Fetch and aggregate analytics for a specific social account
   */
  async fetchAccountAnalytics(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken', 'status'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      throw new Error(`Account ${accountId} is not connected`);
    }

    const service = this.getPlatformService(account.platform);

    try {
      const analytics = await service.getAccountAnalytics(
        account.accountId,
        account.accessToken,
        startDate,
        endDate,
      );

      this.logger.log(
        `Fetched analytics for ${account.platform} account ${account.accountId}`,
      );

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching analytics for account ${accountId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch analytics for multiple accounts
   */
  async fetchAnalyticsForMultipleAccounts(
    accountIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Record<string, PlatformAnalytics>> {
    const results: Record<string, PlatformAnalytics> = {};

    await Promise.allSettled(
      accountIds.map(async (accountId) => {
        try {
          const analytics = await this.fetchAccountAnalytics(
            accountId,
            startDate,
            endDate,
          );
          results[accountId] = analytics;
        } catch (error: any) {
          this.logger.error(
            `Failed to fetch analytics for account ${accountId}: ${error.message}`,
          );
        }
      }),
    );

    return results;
  }

  /**
   * Fetch analytics for all connected accounts
   */
  async fetchAnalyticsForAllAccounts(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    byPlatform: Record<string, PlatformAnalytics>;
    aggregated: PlatformAnalytics;
  }> {
    const accounts = await this.socialAccountRepository.find({
      where: { status: AccountStatus.CONNECTED },
      select: ['id', 'platform', 'accountId', 'accessToken'],
    });

    if (accounts.length === 0) {
      this.logger.warn('No connected accounts found');
      return {
        byPlatform: {},
        aggregated: this.getEmptyAnalytics(),
      };
    }

    const byPlatform: Record<string, PlatformAnalytics> = {};
    const allAnalytics: PlatformAnalytics[] = [];

    await Promise.allSettled(
      accounts.map(async (account) => {
        try {
          const analytics = await this.fetchAccountAnalytics(
            account.id,
            startDate,
            endDate,
          );
          byPlatform[account.platform] = analytics;
          allAnalytics.push(analytics);
        } catch (error: any) {
          this.logger.error(
            `Failed to fetch analytics for ${account.platform}: ${error.message}`,
          );
        }
      }),
    );

    const aggregated = this.aggregateAnalytics(allAnalytics);

    return { byPlatform, aggregated };
  }

  /**
   * Fetch post analytics for specific posts
   */
  async fetchPostAnalytics(
    accountId: string,
    postIds: string[],
  ): Promise<PostAnalytics[]> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      throw new Error(`Account ${accountId} is not connected`);
    }

    const service = this.getPlatformService(account.platform);

    try {
      return await service.getPostAnalytics(
        account.accountId,
        account.accessToken,
        postIds,
      );
    } catch (error: any) {
      this.logger.error(
        `Error fetching post analytics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch audience insights for an account
   */
  async fetchAudienceInsights(accountId: string): Promise<AudienceInsights> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      throw new Error(`Account ${accountId} is not connected`);
    }

    const service = this.getPlatformService(account.platform);

    try {
      return await service.getAudienceInsights(
        account.accountId,
        account.accessToken,
      );
    } catch (error: any) {
      this.logger.error(
        `Error fetching audience insights: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get follower count for an account
   */
  async getFollowerCount(accountId: string): Promise<number> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      throw new Error(`Account ${accountId} is not connected`);
    }

    const service = this.getPlatformService(account.platform);

    try {
      return await service.getFollowerCount(
        account.accountId,
        account.accessToken,
      );
    } catch (error: any) {
      this.logger.error(
        `Error fetching follower count: ${error.message}`,
        error.stack,
      );
      return 0;
    }
  }

  /**
   * Get follower growth for an account
   */
  async getFollowerGrowth(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: Date; count: number }>> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      throw new Error(`Account ${accountId} is not connected`);
    }

    const service = this.getPlatformService(account.platform);

    try {
      return await service.getFollowerGrowth(
        account.accountId,
        account.accessToken,
        startDate,
        endDate,
      );
    } catch (error: any) {
      this.logger.error(
        `Error fetching follower growth: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Validate token for an account
   */
  async validateAccountToken(
    accountId: string,
  ): Promise<{ valid: boolean; newToken?: string }> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
      select: ['id', 'platform', 'accountId', 'accessToken', 'refreshToken'],
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (!account.accessToken) {
      return { valid: false };
    }

    const service = this.getPlatformService(account.platform);

    try {
      return await service.validateToken(
        account.accessToken,
        account.refreshToken,
      );
    } catch (error: any) {
      this.logger.error(
        `Error validating token: ${error.message}`,
        error.stack,
      );
      return { valid: false };
    }
  }

  /**
   * Aggregate analytics from multiple platforms
   */
  private aggregateAnalytics(
    analyticsArray: PlatformAnalytics[],
  ): PlatformAnalytics {
    if (analyticsArray.length === 0) {
      return this.getEmptyAnalytics();
    }

    return analyticsArray.reduce(
      (acc, curr) => ({
        impressions: acc.impressions + curr.impressions,
        reach: acc.reach + curr.reach,
        engagement: acc.engagement + curr.engagement,
        likes: acc.likes + curr.likes,
        comments: acc.comments + curr.comments,
        shares: acc.shares + curr.shares,
        saves: (acc.saves || 0) + (curr.saves || 0),
        clicks: (acc.clicks || 0) + (curr.clicks || 0),
        followers: acc.followers + curr.followers,
        followerGrowth: acc.followerGrowth + curr.followerGrowth,
        videoViews: (acc.videoViews || 0) + (curr.videoViews || 0),
        profileViews: (acc.profileViews || 0) + (curr.profileViews || 0),
      }),
      this.getEmptyAnalytics(),
    );
  }

  private getEmptyAnalytics(): PlatformAnalytics {
    return {
      impressions: 0,
      reach: 0,
      engagement: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: 0,
      followers: 0,
      followerGrowth: 0,
      videoViews: 0,
      profileViews: 0,
    };
  }
}
