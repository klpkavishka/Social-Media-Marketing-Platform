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
export class FacebookService extends BasePlatformService {
  private readonly logger = new Logger(FacebookService.name);
  private readonly apiBaseUrl = 'https://graph.facebook.com/v18.0';

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
      // Fetch Facebook Page insights
      const metrics = [
        'page_impressions',
        'page_impressions_unique',
        'page_post_engagements',
        'page_fans',
        'page_views_total',
        'page_fan_adds',
        'page_fan_removes',
      ];

      const insightsUrl = `${this.apiBaseUrl}/${accountId}/insights`;
      const params = {
        metric: metrics.join(','),
        period: 'day',
        since: Math.floor(startDate.getTime() / 1000),
        until: Math.floor(endDate.getTime() / 1000),
        access_token: accessToken,
      };

      const response = await firstValueFrom(
        this.httpService.get(insightsUrl, { params }),
      );

      const data = response.data.data;
      
      const aggregated: PlatformAnalytics = {
        impressions: this.sumMetric(data, 'page_impressions'),
        reach: this.sumMetric(data, 'page_impressions_unique'),
        engagement: this.sumMetric(data, 'page_post_engagements'),
        likes: 0, // Will be fetched from individual posts
        comments: 0,
        shares: 0,
        clicks: 0,
        followers: this.getLatestValue(data, 'page_fans'),
        followerGrowth:
          this.sumMetric(data, 'page_fan_adds') -
          this.sumMetric(data, 'page_fan_removes'),
        profileViews: this.sumMetric(data, 'page_views_total'),
      };

      return aggregated;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Facebook analytics: ${error.message}`,
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

      for (const postId of postIds) {
        const insightsUrl = `${this.apiBaseUrl}/${postId}/insights`;
        const params = {
          metric: [
            'post_impressions',
            'post_impressions_unique',
            'post_engaged_users',
            'post_clicks',
          ].join(','),
          access_token: accessToken,
        };

        const response = await firstValueFrom(
          this.httpService.get(insightsUrl, { params }),
        );

        // Also fetch likes, comments, shares count
        const postUrl = `${this.apiBaseUrl}/${postId}`;
        const postParams = {
          fields: 'likes.summary(true),comments.summary(true),shares',
          access_token: accessToken,
        };

        const postResponse = await firstValueFrom(
          this.httpService.get(postUrl, { params: postParams }),
        );

        const insightData = response.data.data;
        const postData = postResponse.data;
        
        analytics.push({
          postId,
          platform: 'facebook',
          impressions: this.getMetricValue(insightData, 'post_impressions'),
          reach: this.getMetricValue(insightData, 'post_impressions_unique'),
          engagement: this.getMetricValue(insightData, 'post_engaged_users'),
          likes: postData.likes?.summary?.total_count || 0,
          comments: postData.comments?.summary?.total_count || 0,
          shares: postData.shares?.count || 0,
          clicks: this.getMetricValue(insightData, 'post_clicks'),
          timestamp: new Date(),
          metadata: {
            accountId,
          },
        });
      }

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Facebook post analytics: ${error.message}`,
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
      const metrics = [
        'page_fans_gender_age',
        'page_fans_city',
        'page_fans_country',
      ];

      const insightsUrl = `${this.apiBaseUrl}/${accountId}/insights`;
      const params = {
        metric: metrics.join(','),
        period: 'lifetime',
        access_token: accessToken,
      };

      const response = await firstValueFrom(
        this.httpService.get(insightsUrl, { params }),
      );

      const data = response.data.data;

      const demographics = this.parseAudienceDemographics(data);
      const locations = this.parseAudienceLocations(data);

      return {
        demographics: {
          ageRange: demographics.ageRange,
          gender: demographics.gender,
          location: locations,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching Facebook audience insights: ${error.message}`,
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
      const debugUrl = `${this.apiBaseUrl}/debug_token`;
      const params = {
        input_token: accessToken,
        access_token: `${this.configService.get('META_APP_ID')}|${this.configService.get('META_APP_SECRET')}`,
      };

      const response = await firstValueFrom(
        this.httpService.get(debugUrl, { params }),
      );

      const tokenData = response.data.data;
      return {
        valid: tokenData.is_valid && tokenData.expires_at > Date.now() / 1000,
      };
    } catch (error: any) {
      this.logger.error(
        `Error validating Facebook token: ${error.message}`,
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
      const url = `${this.apiBaseUrl}/${accountId}`;
      const params = {
        fields: 'fan_count',
        access_token: accessToken,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data.fan_count || 0;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Facebook follower count: ${error.message}`,
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
      const insightsUrl = `${this.apiBaseUrl}/${accountId}/insights`;
      const params = {
        metric: 'page_fans',
        period: 'day',
        since: Math.floor(startDate.getTime() / 1000),
        until: Math.floor(endDate.getTime() / 1000),
        access_token: accessToken,
      };

      const response = await firstValueFrom(
        this.httpService.get(insightsUrl, { params }),
      );

      const data = response.data.data[0];
      
      if (!data || !data.values) {
        return [];
      }

      return data.values.map((value: any) => ({
        date: new Date(value.end_time),
        count: value.value,
      }));
    } catch (error: any) {
      this.logger.error(
        `Error fetching Facebook follower growth: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  // Helper methods
  private sumMetric(data: any[], metricName: string): number {
    const metric = data.find((m) => m.name === metricName);
    if (!metric || !metric.values) return 0;
    
    return metric.values.reduce(
      (sum: number, value: any) => sum + (value.value || 0),
      0,
    );
  }

  private getLatestValue(data: any[], metricName: string): number {
    const metric = data.find((m) => m.name === metricName);
    if (!metric || !metric.values || metric.values.length === 0) return 0;
    
    return metric.values[metric.values.length - 1].value || 0;
  }

  private getMetricValue(data: any[], metricName: string): number {
    const metric = data.find((m) => m.name === metricName);
    if (!metric || !metric.values || metric.values.length === 0) return 0;
    
    return metric.values[0].value || 0;
  }

  private parseAudienceDemographics(data: any[]): {
    ageRange: Record<string, number>;
    gender: Record<string, number>;
  } {
    const genderAgeMetric = data.find((m) => m.name === 'page_fans_gender_age');
    const demographics = {
      ageRange: {} as Record<string, number>,
      gender: { male: 0, female: 0 } as Record<string, number>,
    };

    if (!genderAgeMetric || !genderAgeMetric.values) {
      return demographics;
    }

    const value = genderAgeMetric.values[0]?.value || {};
    
    Object.entries(value).forEach(([key, count]: [string, any]) => {
      const [gender, ageRange] = key.split('.');
      
      if (gender === 'M') {
        demographics.gender.male += count;
      } else if (gender === 'F') {
        demographics.gender.female += count;
      }
      
      if (ageRange) {
        demographics.ageRange[ageRange] =
          (demographics.ageRange[ageRange] || 0) + count;
      }
    });

    return demographics;
  }

  private parseAudienceLocations(
    data: any[],
  ): Array<{ country: string; city?: string; percentage: number }> {
    const countryMetric = data.find((m) => m.name === 'page_fans_country');
    const locations: Array<{ country: string; city?: string; percentage: number }> = [];

    if (countryMetric && countryMetric.values) {
      const countryData = countryMetric.values[0]?.value || {};
      const total = Object.values(countryData).reduce(
        (sum: number, val: any) => sum + val,
        0,
      ) as number;

      Object.entries(countryData)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10)
        .forEach(([country, count]: [string, any]) => {
          locations.push({
            country,
            percentage: (count / total) * 100,
          });
        });
    }

    return locations;
  }
}
