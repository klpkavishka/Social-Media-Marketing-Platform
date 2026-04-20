import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnalyticsSnapshot,
  AnalyticsSnapshotDocument,
  PostMetric,
  PostMetricDocument,
  AudienceSnapshot,
  AudienceSnapshotDocument,
  FollowerGrowth,
  FollowerGrowthDocument,
} from '../schemas';
import { PlatformAnalyticsDto, PostAnalyticsDto, AudienceInsightsDto } from '../dto';

@Injectable()
export class AnalyticsStorageService {
  private readonly logger = new Logger(AnalyticsStorageService.name);

  constructor(
    @InjectModel(AnalyticsSnapshot.name)
    private analyticsSnapshotModel: Model<AnalyticsSnapshotDocument>,
    @InjectModel(PostMetric.name)
    private postMetricModel: Model<PostMetricDocument>,
    @InjectModel(AudienceSnapshot.name)
    private audienceSnapshotModel: Model<AudienceSnapshotDocument>,
    @InjectModel(FollowerGrowth.name)
    private followerGrowthModel: Model<FollowerGrowthDocument>,
  ) {}

  /**
   * Store analytics snapshot in MongoDB
   */
  async storeAnalyticsSnapshot(
    accountId: string,
    platform: string,
    analytics: PlatformAnalyticsDto,
    timestamp: Date = new Date(),
  ): Promise<AnalyticsSnapshotDocument> {
    try {
      const snapshot = new this.analyticsSnapshotModel({
        timestamp,
        accountId,
        platform,
        impressions: analytics.impressions,
        reach: analytics.reach,
        engagement: analytics.engagement,
        likes: analytics.likes,
        comments: analytics.comments,
        shares: analytics.shares,
        saves: analytics.saves || 0,
        clicks: analytics.clicks || 0,
        followers: analytics.followers,
        followerGrowth: analytics.followerGrowth,
        videoViews: analytics.videoViews || 0,
        profileViews: analytics.profileViews || 0,
        metadata: {
          accountId,
          platform,
          dataSource: 'api',
        },
      });

      const saved = await snapshot.save();
      this.logger.log(
        `Stored analytics snapshot for account ${accountId} (${platform})`,
      );
      return saved;
    } catch (error: any) {
      this.logger.error(
        `Error storing analytics snapshot: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Store post metrics
   */
  async storePostMetrics(
    postAnalytics: PostAnalyticsDto[],
    timestamp: Date = new Date(),
  ): Promise<PostMetricDocument[]> {
    try {
      const metrics = postAnalytics.map(
        (post) =>
          new this.postMetricModel({
            timestamp,
            postId: post.postId,
            accountId: post.metadata?.accountId || '',
            platform: post.platform,
            impressions: post.impressions,
            reach: post.reach,
            engagement: post.engagement,
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
            saves: post.saves || 0,
            clicks: post.clicks || 0,
            engagementRate:
              post.reach > 0 ? (post.engagement / post.reach) * 100 : 0,
            metadata: {
              postId: post.postId,
              accountId: post.metadata?.accountId || '',
              platform: post.platform,
            },
            rawData: post.metadata,
          }),
      );

      const saved = await this.postMetricModel.insertMany(metrics);
      this.logger.log(`Stored ${saved.length} post metrics`);
      return saved;
    } catch (error: any) {
      this.logger.error(
        `Error storing post metrics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Store audience snapshot
   */
  async storeAudienceSnapshot(
    accountId: string,
    platform: string,
    insights: AudienceInsightsDto,
    followerCount: number,
    timestamp: Date = new Date(),
  ): Promise<AudienceSnapshotDocument> {
    try {
      const snapshot = new this.audienceSnapshotModel({
        timestamp,
        accountId,
        platform,
        ageRange: insights.demographics.ageRange,
        gender: insights.demographics.gender,
        location: insights.demographics.location,
        interests: insights.interests || [],
        activeHours: insights.activeHours || [],
        totalFollowers: followerCount,
      });

      const saved = await snapshot.save();
      this.logger.log(
        `Stored audience snapshot for account ${accountId} (${platform})`,
      );
      return saved;
    } catch (error: any) {
      this.logger.error(
        `Error storing audience snapshot: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Store follower growth data
   */
  async storeFollowerGrowth(
    accountId: string,
    platform: string,
    growthData: Array<{ date: Date; count: number }>,
  ): Promise<FollowerGrowthDocument[]> {
    try {
      const records: any[] = [];

      for (let i = 0; i < growthData.length; i++) {
        const current = growthData[i];
        const previous = i > 0 ? growthData[i - 1] : null;

        const gained = previous ? Math.max(0, current.count - previous.count) : 0;
        const lost = previous ? Math.max(0, previous.count - current.count) : 0;
        const netGrowth = current.count - (previous?.count || current.count);
        const growthRate =
          previous && previous.count > 0
            ? ((netGrowth / previous.count) * 100)
            : 0;

        records.push(
          new this.followerGrowthModel({
            date: current.date,
            accountId,
            platform,
            count: current.count,
            gained,
            lost,
            netGrowth,
            growthRate,
            metadata: {
              accountId,
              platform,
            },
          }),
        );
      }

      const saved = await this.followerGrowthModel.insertMany(records);
      this.logger.log(
        `Stored ${saved.length} follower growth records for account ${accountId}`,
      );
      return saved as FollowerGrowthDocument[];
    } catch (error: any) {
      this.logger.error(
        `Error storing follower growth: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get analytics history for an account
   */
  async getAnalyticsHistory(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsSnapshotDocument[]> {
    try {
      return await this.analyticsSnapshotModel
        .find({
          accountId,
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ timestamp: 1 })
        .exec();
    } catch (error: any) {
      this.logger.error(
        `Error fetching analytics history: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get post metrics history
   */
  async getPostMetricsHistory(
    postId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PostMetricDocument[]> {
    try {
      return await this.postMetricModel
        .find({
          postId,
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ timestamp: 1 })
        .exec();
    } catch (error: any) {
      this.logger.error(
        `Error fetching post metrics history: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get follower growth history
   */
  async getFollowerGrowthHistory(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<FollowerGrowthDocument[]> {
    try {
      return await this.followerGrowthModel
        .find({
          accountId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ date: 1 })
        .exec();
    } catch (error: any) {
      this.logger.error(
        `Error fetching follower growth history: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get latest analytics snapshot for an account
   */
  async getLatestSnapshot(
    accountId: string,
  ): Promise<AnalyticsSnapshotDocument | null> {
    try {
      return await this.analyticsSnapshotModel
        .findOne({ accountId })
        .sort({ timestamp: -1 })
        .exec();
    } catch (error: any) {
      this.logger.error(
        `Error fetching latest snapshot: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Aggregate analytics by platform
   */
  async aggregateByPlatform(startDate: Date, endDate: Date) {
    try {
      return await this.analyticsSnapshotModel.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$platform',
            totalImpressions: { $sum: '$impressions' },
            totalReach: { $sum: '$reach' },
            totalEngagement: { $sum: '$engagement' },
            totalLikes: { $sum: '$likes' },
            totalComments: { $sum: '$comments' },
            totalShares: { $sum: '$shares' },
            avgFollowers: { $avg: '$followers' },
          },
        },
      ]);
    } catch (error: any) {
      this.logger.error(
        `Error aggregating by platform: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get top performing posts
   */
  async getTopPosts(
    accountId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ) {
    try {
      return await this.postMetricModel
        .find({
          accountId,
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ engagement: -1 })
        .limit(limit)
        .exec();
    } catch (error: any) {
      this.logger.error(
        `Error fetching top posts: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
