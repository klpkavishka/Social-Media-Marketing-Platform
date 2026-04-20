import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Analytics, MetricType } from './entities/analytics.entity';
import { PlatformAnalyticsService } from '../social/platforms/platform-analytics.service';
import { AnalyticsStorageService } from './services/analytics-storage.service';
import {
  GetAnalyticsQueryDto,
  GetPostAnalyticsDto,
  PlatformAnalyticsDto,
  PostAnalyticsDto,
  AudienceInsightsDto,
  AnalyticsAggregateDto,
} from './dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    private readonly platformAnalyticsService: PlatformAnalyticsService,
    private readonly analyticsStorageService: AnalyticsStorageService,
  ) {}

  /**
   * Get overview analytics across all platforms
   */
  async getOverview(query: GetAnalyticsQueryDto): Promise<AnalyticsAggregateDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    this.logger.log(
      `Fetching analytics overview from ${startDate} to ${endDate}`,
    );

    try {
      const result = await this.platformAnalyticsService.fetchAnalyticsForAllAccounts(
        startDate,
        endDate,
      );

      return {
        aggregated: result.aggregated,
        byPlatform: result.byPlatform,
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching analytics overview: ${error.message}`,
        error.stack,
      );
      
      // Return placeholder data if API calls fail
      return this.getPlaceholderOverview();
    }
  }

  /**
   * Get analytics for a specific platform account
   */
  async getPlatformAnalytics(
    accountId: string,
    query: GetAnalyticsQueryDto,
  ): Promise<PlatformAnalyticsDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    this.logger.log(
      `Fetching analytics for account ${accountId} from ${startDate} to ${endDate}`,
    );

    try {
      const analytics = await this.platformAnalyticsService.fetchAccountAnalytics(
        accountId,
        startDate,
        endDate,
      );

      // Store the fetched analytics in both PostgreSQL and MongoDB
      await this.storeAnalytics(accountId, analytics, startDate);

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching platform analytics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get analytics for specific posts
   */
  async getPostAnalytics(dto: GetPostAnalyticsDto): Promise<PostAnalyticsDto[]> {
    this.logger.log(
      `Fetching post analytics for account ${dto.accountId}, posts: ${dto.postIds.join(', ')}`,
    );

    try {
      return await this.platformAnalyticsService.fetchPostAnalytics(
        dto.accountId,
        dto.postIds,
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
   * Get audience insights for an account
   */
  async getAudienceInsights(accountId: string): Promise<AudienceInsightsDto> {
    this.logger.log(`Fetching audience insights for account ${accountId}`);

    try {
      return await this.platformAnalyticsService.fetchAudienceInsights(accountId);
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
  async getFollowerCount(accountId: string): Promise<{ count: number }> {
    this.logger.log(`Fetching follower count for account ${accountId}`);

    try {
      const count = await this.platformAnalyticsService.getFollowerCount(accountId);
      return { count };
    } catch (error: any) {
      this.logger.error(
        `Error fetching follower count: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get follower growth over time
   */
  async getFollowerGrowth(
    accountId: string,
    query: GetAnalyticsQueryDto,
  ): Promise<Array<{ date: Date; count: number }>> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    this.logger.log(
      `Fetching follower growth for account ${accountId} from ${startDate} to ${endDate}`,
    );

    try {
      return await this.platformAnalyticsService.getFollowerGrowth(
        accountId,
        startDate,
        endDate,
      );
    } catch (error: any) {
      this.logger.error(
        `Error fetching follower growth: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get engagement metrics
   */
  async getEngagement(query: GetAnalyticsQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    try {
      const overview = await this.platformAnalyticsService.fetchAnalyticsForAllAccounts(
        startDate,
        endDate,
      );

      const { aggregated } = overview;

      // Calculate engagement rate
      const engagementRate =
        aggregated.reach > 0
          ? (aggregated.engagement / aggregated.reach) * 100
          : 0;

      return {
        likes: aggregated.likes,
        comments: aggregated.comments,
        shares: aggregated.shares,
        saves: aggregated.saves || 0,
        clicks: aggregated.clicks || 0,
        totalEngagement: aggregated.engagement,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        timeline: await this.getEngagementTimeline(startDate, endDate),
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching engagement metrics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get content performance comparison
   */
  async getContentPerformance(query: GetAnalyticsQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    try {
      // Fetch stored analytics from database
      const analytics = await this.analyticsRepository.find({
        where: {
          date: Between(startDate, endDate),
        },
        order: {
          date: 'DESC',
        },
      });

      // Aggregate by content type
      const contentTypes = this.aggregateByContentType(analytics);
      
      // Get top performing content
      const topContent = await this.getTopContent(startDate, endDate);

      return {
        contentTypes,
        topContent,
        bestPostingTimes: await this.getBestPostingTimes(startDate, endDate),
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching content performance: ${error.message}`,
        error.stack,
      );
      
      return this.getPlaceholderContentPerformance();
    }
  }

  /**
   * Refresh analytics for an account (manual refresh)
   */
  async refreshAnalytics(accountId: string, query: GetAnalyticsQueryDto) {
    this.logger.log(`Manually refreshing analytics for account ${accountId}`);

    try {
      const analytics = await this.getPlatformAnalytics(accountId, query);
      
      return {
        success: true,
        message: 'Analytics refreshed successfully',
        data: analytics,
      };
    } catch (error: any) {
      this.logger.error(
        `Error refreshing analytics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Compare analytics across multiple accounts
   */
  async compareAccounts(query: GetAnalyticsQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    try {
      if (query.accountIds && query.accountIds.length > 0) {
        const results = await this.platformAnalyticsService.fetchAnalyticsForMultipleAccounts(
          query.accountIds,
          startDate,
          endDate,
        );

        return {
          accounts: results,
          comparison: this.generateComparison(results),
        };
      }

      // If no specific accounts, compare all platforms
      const allAccounts = await this.platformAnalyticsService.fetchAnalyticsForAllAccounts(
        startDate,
        endDate,
      );

      return {
        byPlatform: allAccounts.byPlatform,
        comparison: this.generatePlatformComparison(allAccounts.byPlatform),
      };
    } catch (error: any) {
      this.logger.error(
        `Error comparing accounts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Store analytics data in PostgreSQL and MongoDB
   */
  private async storeAnalytics(
    accountId: string,
    analytics: PlatformAnalyticsDto,
    date: Date,
  ): Promise<void> {
    try {
      // Store in PostgreSQL (structured data for quick queries)
      const metrics = [
        { type: MetricType.IMPRESSION, value: analytics.impressions },
        { type: MetricType.REACH, value: analytics.reach },
        { type: MetricType.ENGAGEMENT, value: analytics.engagement },
        { type: MetricType.CLICK, value: analytics.clicks || 0 },
      ];

      for (const metric of metrics) {
        const analyticsRecord = this.analyticsRepository.create({
          contentId: null as any, // Account-level analytics
          campaignId: null as any,
          platform: accountId,
          metricType: metric.type,
          value: metric.value,
          date,
        });

        await this.analyticsRepository.save(analyticsRecord);
      }

      // Store in MongoDB (time-series data for trends and historical analysis)
      await this.analyticsStorageService.storeAnalyticsSnapshot(
        accountId,
        'unknown', // Platform will be determined from account lookup
        analytics,
        date,
      );

      this.logger.log(
        `Stored analytics for account ${accountId} in PostgreSQL and MongoDB`,
      );
    } catch (error: any) {
      this.logger.error(
        `Error storing analytics: ${error.message}`,
        error.stack,
      );
    }
  }

  // Helper methods
  private async getEngagementTimeline(startDate: Date, endDate: Date) {
    // This would query the database for historical engagement data
    // For now, return placeholder data
    return [
      { date: startDate.toISOString().split('T')[0], engagement: 150 },
      { date: endDate.toISOString().split('T')[0], engagement: 180 },
    ];
  }

  private aggregateByContentType(analytics: Analytics[]) {
    // This would aggregate analytics by content type from metadata
    return {
      image: 45,
      video: 30,
      carousel: 15,
      story: 10,
    };
  }

  private async getTopContent(startDate: Date, endDate: Date) {
    // This would query for top performing content
    return [
      {
        id: '1',
        title: 'Top performing post',
        engagement: 1234,
        reach: 5678,
      },
    ];
  }

  private async getBestPostingTimes(startDate: Date, endDate: Date) {
    // This would analyze posting time patterns
    return [
      { hour: 9, dayOfWeek: 'Monday', avgEngagement: 234 },
      { hour: 18, dayOfWeek: 'Wednesday', avgEngagement: 245 },
    ];
  }

  private generateComparison(results: Record<string, PlatformAnalyticsDto>) {
    const accounts = Object.entries(results);
    
    if (accounts.length === 0) return null;

    // Find best performing account
    const bestEngagement = accounts.reduce((best, [id, analytics]) =>
      analytics.engagement > (results[best]?.engagement || 0) ? id : best,
      accounts[0][0],
    );

    return {
      bestEngagement,
      totalAccounts: accounts.length,
    };
  }

  private generatePlatformComparison(byPlatform: Record<string, PlatformAnalyticsDto>) {
    const platforms = Object.entries(byPlatform);
    
    if (platforms.length === 0) return null;

    const bestEngagement = platforms.reduce((best, [platform, analytics]) =>
      analytics.engagement > (byPlatform[best]?.engagement || 0) ? platform : best,
      platforms[0][0],
    );

    const bestReach = platforms.reduce((best, [platform, analytics]) =>
      analytics.reach > (byPlatform[best]?.reach || 0) ? platform : best,
      platforms[0][0],
    );

    return {
      bestEngagement,
      bestReach,
      totalPlatforms: platforms.length,
    };
  }

  private getPlaceholderOverview(): AnalyticsAggregateDto {
    return {
      aggregated: {
        impressions: 0,
        reach: 0,
        engagement: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        followers: 0,
        followerGrowth: 0,
      },
      byPlatform: {},
    };
  }

  private getPlaceholderContentPerformance() {
    return {
      contentTypes: {
        image: 45,
        video: 30,
        carousel: 15,
        story: 10,
      },
      topContent: [],
      bestPostingTimes: [
        { hour: 9, dayOfWeek: 'Monday', avgEngagement: 234 },
        { hour: 18, dayOfWeek: 'Wednesday', avgEngagement: 245 },
      ],
    };
  }

  // Legacy methods (kept for backward compatibility)
  async getCampaignAnalytics(campaignId: string) {
    // TODO: Implement campaign-specific analytics
    return {
      campaignId,
      impressions: 12345,
      clicks: 987,
      conversions: 45,
      roi: 2.5,
      costPerClick: 0.35,
      conversionRate: 4.6,
    };
  }

  async getTrending(platform?: string) {
    // TODO: Implement trending topics/hashtags
    return {
      hashtags: [
        { tag: '#university', count: 1234 },
        { tag: '#education', count: 987 },
        { tag: '#students', count: 765 },
      ],
      topics: [
        { topic: 'Campus Life', mentions: 543 },
        { topic: 'Research', mentions: 432 },
      ],
    };
  }
}
