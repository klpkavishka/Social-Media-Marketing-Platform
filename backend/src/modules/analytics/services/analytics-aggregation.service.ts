import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformAnalyticsService } from '../../social/platforms/platform-analytics.service';
import { AnalyticsStorageService } from './analytics-storage.service';
import {
  SocialAccount,
  AccountStatus,
} from '../../social/entities/social-account.entity';
import { Analytics } from '../entities/analytics.entity';
import { MetricType } from '../entities/analytics.entity';

export interface AggregationResult {
  accountId: string;
  platform: string;
  success: boolean;
  error?: string;
  metricsCollected?: number;
}

export interface AggregationSummary {
  totalAccounts: number;
  successfulAccounts: number;
  failedAccounts: number;
  totalMetricsCollected: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  results: AggregationResult[];
}

@Injectable()
export class AnalyticsAggregationService {
  private readonly logger = new Logger(AnalyticsAggregationService.name);

  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    private readonly platformAnalyticsService: PlatformAnalyticsService,
    private readonly analyticsStorageService: AnalyticsStorageService,
  ) {}

  /**
   * Aggregate analytics data for all active social accounts
   */
  async aggregateAllAccounts(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AggregationSummary> {
    const aggregationStart = new Date();
    this.logger.log('Starting analytics aggregation for all accounts');

    // Default to last 24 hours if dates not provided
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const results: AggregationResult[] = [];
    let totalMetrics = 0;

    try {
      // Get all connected social accounts
      const accounts = await this.getActiveAccounts();
      this.logger.log(`Found ${accounts.length} active social accounts`);

      // Process each account
      for (const account of accounts) {
        const result = await this.aggregateAccountAnalytics(
          account,
          start,
          end,
        );
        results.push(result);

        if (result.success && result.metricsCollected) {
          totalMetrics += result.metricsCollected;
        }
      }

      const aggregationEnd = new Date();
      const summary: AggregationSummary = {
        totalAccounts: accounts.length,
        successfulAccounts: results.filter((r) => r.success).length,
        failedAccounts: results.filter((r) => !r.success).length,
        totalMetricsCollected: totalMetrics,
        startTime: aggregationStart,
        endTime: aggregationEnd,
        duration: aggregationEnd.getTime() - aggregationStart.getTime(),
        results,
      };

      this.logger.log(
        `Aggregation complete: ${summary.successfulAccounts}/${summary.totalAccounts} accounts successful, ${totalMetrics} metrics collected`,
      );

      return summary;
    } catch (error: any) {
      this.logger.error(
        `Error during analytics aggregation: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Aggregate analytics for a specific account
   */
  async aggregateAccountAnalytics(
    account: SocialAccount,
    startDate: Date,
    endDate: Date,
  ): Promise<AggregationResult> {
    const result: AggregationResult = {
      accountId: account.id,
      platform: account.platform,
      success: false,
    };

    try {
      this.logger.log(
        `Aggregating analytics for ${account.platform} account: ${account.accountName}`,
      );

      // Fetch account analytics
      const accountAnalytics =
        await this.platformAnalyticsService.fetchAccountAnalytics(
          account.id,
          startDate,
          endDate,
        );

      // Store in PostgreSQL
      const metricsStored = await this.storeAccountMetrics(
        account.id,
        accountAnalytics,
        endDate,
      );

      // Store in MongoDB (time-series)
      await this.analyticsStorageService.storeAnalyticsSnapshot(
        account.id,
        account.platform,
        accountAnalytics,
        endDate,
      );

      // Fetch and store follower growth
      await this.aggregateFollowerGrowth(account, startDate, endDate);

      // Fetch and store audience insights
      await this.aggregateAudienceInsights(account, accountAnalytics.followers, endDate);

      result.success = true;
      result.metricsCollected = metricsStored;

      this.logger.log(
        `Successfully aggregated ${metricsStored} metrics for ${account.accountName}`,
      );
    } catch (error: any) {
      result.error = error.message;
      this.logger.error(
        `Failed to aggregate analytics for ${account.accountName}: ${error.message}`,
        error.stack,
      );
    }

    return result;
  }

  /**
   * Aggregate follower growth data
   */
  private async aggregateFollowerGrowth(
    account: SocialAccount,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    try {
      const followerGrowth =
        await this.platformAnalyticsService.getFollowerGrowth(
          account.id,
          startDate,
          endDate,
        );

      if (!followerGrowth || followerGrowth.length === 0) {
        this.logger.warn(
          `No follower growth data available for ${account.accountName}`,
        );
        return;
      }

      // Transform data to required format
      const growthData = followerGrowth.map((dataPoint) => ({
        date: new Date(dataPoint.date),
        count: dataPoint.count,
      }));

      // Store follower growth data
      await this.analyticsStorageService.storeFollowerGrowth(
        account.id,
        account.platform,
        growthData,
      );

      this.logger.log(
        `Stored ${followerGrowth.length} follower growth data points for ${account.accountName}`,
      );
    } catch (error: any) {
      this.logger.warn(
        `Failed to aggregate follower growth for ${account.accountName}: ${error.message}`,
      );
    }
  }

  /**
   * Aggregate audience insights
   */
  private async aggregateAudienceInsights(
    account: SocialAccount,
    followerCount: number,
    timestamp: Date,
  ): Promise<void> {
    try {
      const audienceInsights =
        await this.platformAnalyticsService.fetchAudienceInsights(account.id);

      if (!audienceInsights) {
        this.logger.warn(
          `No audience insights available for ${account.accountName}`,
        );
        return;
      }

      await this.analyticsStorageService.storeAudienceSnapshot(
        account.id,
        account.platform,
        audienceInsights,
        followerCount,
        timestamp,
      );

      this.logger.log(
        `Stored audience insights for ${account.accountName}`,
      );
    } catch (error: any) {
      this.logger.warn(
        `Failed to aggregate audience insights for ${account.accountName}: ${error.message}`,
      );
    }
  }

  /**
   * Store account metrics in PostgreSQL
   */
  private async storeAccountMetrics(
    accountId: string,
    analytics: any,
    date: Date,
  ): Promise<number> {
    const metrics = [
      { type: MetricType.IMPRESSION, value: analytics.impressions || 0 },
      { type: MetricType.REACH, value: analytics.reach || 0 },
      { type: MetricType.ENGAGEMENT, value: analytics.engagement || 0 },
      { type: MetricType.CLICK, value: analytics.clicks || 0 },
    ];

    let storedCount = 0;

    for (const metric of metrics) {
      try {
        const analyticsRecord = this.analyticsRepository.create({
          contentId: null as any, // Account-level analytics
          campaignId: null as any,
          platform: accountId,
          metricType: metric.type,
          value: metric.value,
          date,
        });

        await this.analyticsRepository.save(analyticsRecord);
        storedCount++;
      } catch (error: any) {
        this.logger.error(
          `Failed to store metric ${metric.type}: ${error.message}`,
        );
      }
    }

    return storedCount;
  }

  /**
   * Aggregate post analytics for an account
   */
  async aggregatePostAnalytics(
    accountId: string,
    postIds: string[],
  ): Promise<void> {
    this.logger.log(`Aggregating analytics for ${postIds.length} posts`);

    try {
      const postAnalytics =
        await this.platformAnalyticsService.fetchPostAnalytics(
          accountId,
          postIds,
        );

      await this.analyticsStorageService.storePostMetrics(postAnalytics);

      this.logger.log(
        `Successfully aggregated analytics for ${postAnalytics.length} posts`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to aggregate post analytics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get all active social accounts
   */
  private async getActiveAccounts(): Promise<SocialAccount[]> {
    return this.socialAccountRepository.find({
      where: {
        status: AccountStatus.CONNECTED,
      },
      select: ['id', 'platform', 'accountName', 'accountId', 'status'],
    });
  }

  /**
   * Aggregate analytics for a specific platform
   */
  async aggregateByPlatform(
    platform: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AggregationSummary> {
    this.logger.log(`Aggregating analytics for platform: ${platform}`);

    const accounts = await this.socialAccountRepository.find({
      where: {
        platform: platform as any,
        status: AccountStatus.CONNECTED,
      },
    });

    const results: AggregationResult[] = [];
    let totalMetrics = 0;

    for (const account of accounts) {
      const result = await this.aggregateAccountAnalytics(
        account,
        startDate,
        endDate,
      );
      results.push(result);

      if (result.success && result.metricsCollected) {
        totalMetrics += result.metricsCollected;
      }
    }

    return {
      totalAccounts: accounts.length,
      successfulAccounts: results.filter((r) => r.success).length,
      failedAccounts: results.filter((r) => !r.success).length,
      totalMetricsCollected: totalMetrics,
      startTime: startDate,
      endTime: endDate,
      duration: endDate.getTime() - startDate.getTime(),
      results,
    };
  }

  /**
   * Get aggregation statistics
   */
  async getAggregationStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalAccounts: number;
    activeAccounts: number;
    totalMetrics: number;
    lastAggregation: Date | null;
  }> {
    const totalAccounts = await this.socialAccountRepository.count();
    const activeAccounts = await this.socialAccountRepository.count({
      where: { status: AccountStatus.CONNECTED },
    });

    const totalMetrics = await this.analyticsRepository.count({
      where: {
        date: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
    });

    const lastMetric = await this.analyticsRepository.findOne({
      order: { date: 'DESC' },
    });

    return {
      totalAccounts,
      activeAccounts,
      totalMetrics,
      lastAggregation: lastMetric?.date || null,
    };
  }
}
