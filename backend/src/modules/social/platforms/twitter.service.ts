import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  BasePlatformService,
  PlatformAnalytics,
  PostAnalytics,
  AudienceInsights,
} from './base-platform.service';

@Injectable()
export class TwitterService extends BasePlatformService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly apiBaseUrl = 'https://api.twitter.com/2';

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService);
  }

  async getAccountAnalytics(
    accountId: string,
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics> {
    try {
      // Get user metrics
      const userUrl = `${this.apiBaseUrl}/users/${accountId}`;
      const userParams = {
        'user.fields': 'public_metrics',
      };

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const userResponse = await firstValueFrom(
        this.httpService.get(userUrl, { params: userParams, headers }),
      );

      const metrics = userResponse.data.data.public_metrics;

      // Twitter API doesn't provide impressions/reach at account level
      // These would need to be aggregated from individual tweets
      const aggregated: PlatformAnalytics = {
        impressions: 0, // Need to aggregate from tweets
        reach: 0,
        engagement: 0,
        likes: 0,
        comments: 0, // Replies
        shares: 0, // Retweets
        followers: metrics.followers_count || 0,
        followerGrowth: 0, // Will be calculated
        profileViews: 0,
      };

      // Calculate follower growth
      const followerGrowthData = await this.getFollowerGrowth(
        accountId,
        accessToken,
        startDate,
        endDate,
      );
      
      if (followerGrowthData.length > 1) {
        aggregated.followerGrowth =
          followerGrowthData[followerGrowthData.length - 1].count -
          followerGrowthData[0].count;
      }

      return aggregated;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Twitter analytics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getPostAnalytics(
    accountId: string,
    accessToken: string,
    postIds: string[],
  ): Promise<PostAnalytics[]> {
    try {
      const analytics: PostAnalytics[] = [];
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      for (const postId of postIds) {
        const tweetUrl = `${this.apiBaseUrl}/tweets/${postId}`;
        const params = {
          'tweet.fields': 'public_metrics,created_at',
          expansions: 'author_id',
        };

        const response = await firstValueFrom(
          this.httpService.get(tweetUrl, { params, headers }),
        );

        const tweet = response.data.data;
        const metrics = tweet.public_metrics;
        
        analytics.push({
          postId,
          platform: 'twitter',
          impressions: metrics.impression_count || 0,
          reach: 0, // Not available in v2 API
          engagement:
            (metrics.like_count || 0) +
            (metrics.reply_count || 0) +
            (metrics.retweet_count || 0) +
            (metrics.quote_count || 0),
          likes: metrics.like_count || 0,
          comments: metrics.reply_count || 0,
          shares: metrics.retweet_count + metrics.quote_count || 0,
          timestamp: new Date(tweet.created_at),
          metadata: {
            accountId,
            quoteCount: metrics.quote_count,
            bookmarkCount: metrics.bookmark_count,
          },
        });
      }

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Twitter post analytics: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  async getAudienceInsights(
    accountId: string,
    accessToken: string,
  ): Promise<AudienceInsights> {
    try {
      // Note: Twitter API v2 doesn't provide detailed audience demographics
      // This would require Twitter Ads API or enterprise access
      this.logger.warn(
        'Twitter audience insights require Ads API access',
      );

      return {
        demographics: {
          ageRange: {},
          gender: {},
          location: [],
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching Twitter audience insights: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validateToken(
    accessToken: string,
    refreshToken?: string,
  ): Promise<{ valid: boolean; newToken?: string }> {
    try {
      const url = `${this.apiBaseUrl}/users/me`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      return { valid: true };
    } catch (error: any) {
      this.logger.error(
        `Error validating Twitter token: ${error.message}`,
        error.stack,
      );
      return { valid: false };
    }
  }

  async getFollowerCount(
    accountId: string,
    accessToken: string,
  ): Promise<number> {
    try {
      const url = `${this.apiBaseUrl}/users/${accountId}`;
      const params = {
        'user.fields': 'public_metrics',
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );

      return response.data.data.public_metrics.followers_count || 0;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Twitter follower count: ${error.message}`,
        error.stack,
      );
      return 0;
    }
  }

  async getFollowerGrowth(
    accountId: string,
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: Date; count: number }>> {
    try {
      // Note: Twitter API v2 doesn't provide historical follower counts
      // This would need to be tracked over time in our database
      this.logger.warn(
        'Twitter historical follower data not available via API - use stored data',
      );
      
      return [];
    } catch (error: any) {
      this.logger.error(
        `Error fetching Twitter follower growth: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
