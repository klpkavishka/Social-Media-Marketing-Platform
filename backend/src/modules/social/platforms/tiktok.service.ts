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
export class TikTokService extends BasePlatformService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly apiBaseUrl = 'https://open.tiktokapis.com/v2';

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
      };

      // Get user info (follower count)
      const userUrl = `${this.apiBaseUrl}/user/info/`;
      const userParams = {
        fields: 'follower_count,following_count,likes_count,video_count',
      };

      const userResponse = await firstValueFrom(
        this.httpService.get(userUrl, { params: userParams, headers }),
      );

      const userInfo = userResponse.data.data.user;

      // Get video insights for the date range
      const videosUrl = `${this.apiBaseUrl}/video/list/`;
      const videosParams = {
        fields: 'id,title,create_time,view_count,like_count,comment_count,share_count',
        max_count: 100,
      };

      const videosResponse = await firstValueFrom(
        this.httpService.post(videosUrl, videosParams, { headers }),
      );

      const videos = videosResponse.data.data.videos || [];
      
      // Filter videos by date range
      const filteredVideos = videos.filter((video: any) => {
        const createTime = new Date(video.create_time * 1000);
        return createTime >= startDate && createTime <= endDate;
      });

      // Aggregate metrics from videos
      const aggregated: PlatformAnalytics = {
        impressions: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.view_count || 0),
          0,
        ),
        reach: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.view_count || 0),
          0,
        ), // TikTok doesn't distinguish reach from views
        engagement:
          filteredVideos.reduce(
            (sum: number, video: any) =>
              sum +
              (video.like_count || 0) +
              (video.comment_count || 0) +
              (video.share_count || 0),
            0,
          ),
        likes: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.like_count || 0),
          0,
        ),
        comments: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.comment_count || 0),
          0,
        ),
        shares: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.share_count || 0),
          0,
        ),
        followers: userInfo.follower_count || 0,
        followerGrowth: 0, // Will be calculated
        videoViews: filteredVideos.reduce(
          (sum: number, video: any) => sum + (video.view_count || 0),
          0,
        ),
        profileViews: 0, // Not available in TikTok API
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
        `Error fetching TikTok analytics: ${error.message}`,
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
        // Get video info and insights
        const videoUrl = `${this.apiBaseUrl}/video/query/`;
        const params = {
          fields: 'id,title,create_time,view_count,like_count,comment_count,share_count,download_count',
          filters: {
            video_ids: [postId],
          },
        };

        const response = await firstValueFrom(
          this.httpService.post(videoUrl, params, { headers }),
        );

        const video = response.data.data.videos[0];
        
        if (video) {
          analytics.push({
            postId,
            platform: 'tiktok',
            impressions: video.view_count || 0,
            reach: video.view_count || 0,
            engagement:
              (video.like_count || 0) +
              (video.comment_count || 0) +
              (video.share_count || 0),
            likes: video.like_count || 0,
            comments: video.comment_count || 0,
            shares: video.share_count || 0,
            timestamp: new Date(video.create_time * 1000),
            metadata: {
              accountId,
              downloadCount: video.download_count,
            },
          });
        }
      }

      return analytics;
    } catch (error: any) {
      this.logger.error(
        `Error fetching TikTok post analytics: ${error.message}`,
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
      // Note: TikTok API has limited audience insights
      // More detailed data requires TikTok for Business API
      this.logger.warn(
        'TikTok audience insights limited without Business API',
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
        `Error fetching TikTok audience insights: ${error.message}`,
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
      const url = `${this.apiBaseUrl}/user/info/`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      return { valid: true };
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Try to refresh token
        if (refreshToken) {
          try {
            const newToken = await this.refreshAccessToken(refreshToken);
            return { valid: true, newToken };
          } catch (refreshError) {
            this.logger.error(
              `Error refreshing TikTok token: ${refreshError}`,
            );
            return { valid: false };
          }
        }
      }
      
      this.logger.error(
        `Error validating TikTok token: ${error.message}`,
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
      const url = `${this.apiBaseUrl}/user/info/`;
      const params = {
        fields: 'follower_count',
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );

      return response.data.data.user.follower_count || 0;
    } catch (error: any) {
      this.logger.error(
        `Error fetching TikTok follower count: ${error.message}`,
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
      // Note: TikTok API doesn't provide historical follower counts
      // This would need to be tracked over time in our database
      this.logger.warn(
        'TikTok historical follower data not available via API - use stored data',
      );
      
      return [];
    } catch (error: any) {
      this.logger.error(
        `Error fetching TikTok follower growth: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  // Helper method to refresh access token
  private async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
      const params = {
        client_key: this.configService.get('TIKTOK_CLIENT_KEY'),
        client_secret: this.configService.get('TIKTOK_CLIENT_SECRET'),
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };

      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, params),
      );

      return response.data.data.access_token;
    } catch (error: any) {
      this.logger.error(
        `Error refreshing TikTok token: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
