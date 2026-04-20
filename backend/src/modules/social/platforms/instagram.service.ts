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
export class InstagramService extends BasePlatformService {
  private readonly logger = new Logger(InstagramService.name);
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
      // Fetch Instagram Business Account insights
      const metrics = [
        'impressions',
        'reach',
        'profile_views',
        'website_clicks',
        'follower_count',
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
      
      // Aggregate metrics
      const aggregated: PlatformAnalytics = {
        impressions: this.sumMetric(data, 'impressions'),
        reach: this.sumMetric(data, 'reach'),
        engagement: 0, // Will be calculated from posts
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: this.sumMetric(data, 'website_clicks'),
        followers: this.getLatestValue(data, 'follower_count'),
        followerGrowth: 0, // Will be calculated
        profileViews: this.sumMetric(data, 'profile_views'),
      };

      // Fetch follower growth
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
        `Error fetching Instagram analytics: ${error.message}`,
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
        const metrics = [
          'impressions',
          'reach',
          'engagement',
          'likes',
          'comments',
          'shares',
          'saved',
        ];

        const insightsUrl = `${this.apiBaseUrl}/${postId}/insights`;
        const params = {
          metric: metrics.join(','),
          access_token: accessToken,
        };

        const response = await firstValueFrom(
          this.httpService.get(insightsUrl, { params }),
        );

        const data = response.data.data;
        
        analytics.push({
          postId,
          platform: 'instagram',
          impressions: this.getMetricValue(data, 'impressions'),
          reach: this.getMetricValue(data, 'reach'),
          engagement: this.getMetricValue(data, 'engagement'),
          likes: this.getMetricValue(data, 'likes'),
          comments: this.getMetricValue(data, 'comments'),
          shares: this.getMetricValue(data, 'shares'),
          saves: this.getMetricValue(data, 'saved'),
          timestamp: new Date(),
          metadata: {
            accountId,
          },
        });
      }

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Instagram post analytics: ${error.message}`,
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
        'audience_gender_age',
        'audience_city',
        'audience_country',
        'online_followers',
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

      // Parse demographics
      const demographics = this.parseAudienceDemographics(data);
      const locations = this.parseAudienceLocations(data);
      const activeHours = this.parseOnlineFollowers(data);

      return {
        demographics: {
          ageRange: demographics.ageRange,
          gender: demographics.gender,
          location: locations,
        },
        activeHours,
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching Instagram audience insights: ${error.message}`,
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
        `Error validating Instagram token: ${error.message}`,
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
        fields: 'followers_count',
        access_token: accessToken,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data.followers_count || 0;
    } catch (error: any) {
      this.logger.error(
        `Error fetching Instagram follower count: ${error.message}`,
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
        metric: 'follower_count',
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
        `Error fetching Instagram follower growth: ${error.message}`,
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
    const genderAgeMetric = data.find((m) => m.name === 'audience_gender_age');
    const demographics = {
      ageRange: {} as Record<string, number>,
      gender: { male: 0, female: 0 } as Record<string, number>,
    };

    if (!genderAgeMetric || !genderAgeMetric.values) {
      return demographics;
    }

    const value = genderAgeMetric.values[0]?.value || {};
    
    // Parse gender and age data
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
    const countryMetric = data.find((m) => m.name === 'audience_country');
    const cityMetric = data.find((m) => m.name === 'audience_city');

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

  private parseOnlineFollowers(
    data: any[],
  ): Array<{ hour: number; dayOfWeek: string; count: number }> {
    const onlineMetric = data.find((m) => m.name === 'online_followers');
    const activeHours: Array<{ hour: number; dayOfWeek: string; count: number }> = [];

    if (!onlineMetric || !onlineMetric.values) {
      return activeHours;
    }

    const value = onlineMetric.values[0]?.value || {};
    
    Object.entries(value).forEach(([time, count]: [string, any]) => {
      const [day, hour] = time.split('_');
      activeHours.push({
        hour: parseInt(hour, 10),
        dayOfWeek: this.getDayName(parseInt(day, 10)),
        count,
      });
    });

    return activeHours;
  }

  private getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  }
}
