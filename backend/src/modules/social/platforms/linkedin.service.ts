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
export class LinkedInService extends BasePlatformService {
  private readonly logger = new Logger(LinkedInService.name);
  private readonly apiBaseUrl = 'https://api.linkedin.com/v2';

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
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      };

      // Get organization follower statistics
      const statsUrl = `${this.apiBaseUrl}/organizationalEntityFollowerStatistics`;
      const statsParams = {
        q: 'organizationalEntity',
        organizationalEntity: `urn:li:organization:${accountId}`,
      };

      const statsResponse = await firstValueFrom(
        this.httpService.get(statsUrl, { params: statsParams, headers }),
      );

      const followerCount =
        statsResponse.data.elements[0]?.followerCounts?.organic || 0;

      // Get page statistics (impressions, engagement)
      const analyticsUrl = `${this.apiBaseUrl}/organizationPageStatistics/${accountId}`;
      const analyticsParams = {
        timeIntervals: `(timeRange:(start:${startDate.getTime()},end:${endDate.getTime()}),timeGranularityType:DAY)`,
      };

      const analyticsResponse = await firstValueFrom(
        this.httpService.get(analyticsUrl, {
          params: analyticsParams,
          headers,
        }),
      );

      const stats = analyticsResponse.data.elements || [];
      
      const aggregated: PlatformAnalytics = {
        impressions: this.sumField(stats, 'totalPageStatistics', 'views', 'allPageViews'),
        reach: this.sumField(stats, 'totalPageStatistics', 'views', 'uniquePageViews'),
        engagement: this.sumField(stats, 'totalPageStatistics', 'clicks', 'careersPageClicks') +
          this.sumField(stats, 'totalPageStatistics', 'clicks', 'customButtonClickCounts'),
        likes: 0, // Will be aggregated from posts
        comments: 0,
        shares: 0,
        clicks: this.sumField(stats, 'totalPageStatistics', 'clicks', 'careersPageClicks'),
        followers: followerCount,
        followerGrowth: 0, // Will be calculated
        profileViews: this.sumField(stats, 'totalPageStatistics', 'views', 'allPageViews'),
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
        `Error fetching LinkedIn analytics: ${error.message}`,
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
        'X-Restli-Protocol-Version': '2.0.0',
      };

      for (const postId of postIds) {
        // Get share statistics (Post analytics)
        const statsUrl = `${this.apiBaseUrl}/organizationalEntityShareStatistics`;
        const params = {
          q: 'organizationalEntity',
          organizationalEntity: `urn:li:organization:${accountId}`,
          shares: `List(urn:li:share:${postId})`,
        };

        const response = await firstValueFrom(
          this.httpService.get(statsUrl, { params, headers }),
        );

        const stats = response.data.elements[0]?.totalShareStatistics || {};
        
        analytics.push({
          postId,
          platform: 'linkedin',
          impressions: stats.impressionCount || 0,
          reach: stats.uniqueImpressionsCount || 0,
          engagement: stats.engagementCount || 0,
          likes: stats.likeCount || 0,
          comments: stats.commentCount || 0,
          shares: stats.shareCount || 0,
          clicks: stats.clickCount || 0,
          timestamp: new Date(),
          metadata: {
            accountId,
          },
        });
      }

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching LinkedIn post analytics: ${error.message}`,
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
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      };

      // Get follower demographics
      const demographicsUrl = `${this.apiBaseUrl}/organizationalEntityFollowerStatistics`;
      const params = {
        q: 'organizationalEntity',
        organizationalEntity: `urn:li:organization:${accountId}`,
        facets: 'List(SENIORITY,FUNCTION,INDUSTRY,REGION,COMPANY_SIZE)',
      };

      const response = await firstValueFrom(
        this.httpService.get(demographicsUrl, { params, headers }),
      );

      const demographics = this.parseLinkedInDemographics(response.data);

      return {
        demographics: {
          ageRange: {}, // LinkedIn doesn't provide age data
          gender: {}, // LinkedIn doesn't provide gender data
          location: demographics.regions,
        },
        interests: demographics.industries,
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching LinkedIn audience insights: ${error.message}`,
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
      const url = `${this.apiBaseUrl}/me`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      return { valid: true };
    } catch (error: any) {
      this.logger.error(
        `Error validating LinkedIn token: ${error.message}`,
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
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      };

      const url = `${this.apiBaseUrl}/organizationalEntityFollowerStatistics`;
      const params = {
        q: 'organizationalEntity',
        organizationalEntity: `urn:li:organization:${accountId}`,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );

      return response.data.elements[0]?.followerCounts?.organic || 0;
    } catch (error: any) {
      this.logger.error(
        `Error fetching LinkedIn follower count: ${error.message}`,
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
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      };

      const url = `${this.apiBaseUrl}/organizationalEntityFollowerStatistics`;
      const params = {
        q: 'organizationalEntity',
        organizationalEntity: `urn:li:organization:${accountId}`,
        timeIntervals: `(timeRange:(start:${startDate.getTime()},end:${endDate.getTime()}),timeGranularityType:DAY)`,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );

      const elements = response.data.elements || [];
      
      return elements.map((element: any) => ({
        date: new Date(element.timeRange.start),
        count: element.followerCounts.organic,
      }));
    } catch (error: any) {
      this.logger.error(
        `Error fetching LinkedIn follower growth: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  // Helper methods
  private sumField(
    stats: any[],
    category: string,
    subcategory: string,
    field: string,
  ): number {
    return stats.reduce((sum, stat) => {
      const value = stat[category]?.[subcategory]?.[field] || 0;
      return sum + value;
    }, 0);
  }

  private parseLinkedInDemographics(data: any): {
    regions: Array<{ country: string; percentage: number }>;
    industries: string[];
  } {
    const demographics = {
      regions: [] as Array<{ country: string; percentage: number }>,
      industries: [] as string[],
    };

    if (!data.elements || data.elements.length === 0) {
      return demographics;
    }

    const followerData = data.elements[0];

    // Parse regions
    if (followerData.followerCountsByRegion) {
      const total = Object.values(followerData.followerCountsByRegion).reduce(
        (sum: number, val: any) => sum + val,
        0,
      ) as number;

      Object.entries(followerData.followerCountsByRegion)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10)
        .forEach(([region, count]: [string, any]) => {
          demographics.regions.push({
            country: region,
            percentage: (count / total) * 100,
          });
        });
    }

    // Parse industries
    if (followerData.followerCountsByIndustry) {
      demographics.industries = Object.keys(
        followerData.followerCountsByIndustry,
      )
        .sort((a, b) => {
          return (
            followerData.followerCountsByIndustry[b] -
            followerData.followerCountsByIndustry[a]
          );
        })
        .slice(0, 10);
    }

    return demographics;
  }
}
