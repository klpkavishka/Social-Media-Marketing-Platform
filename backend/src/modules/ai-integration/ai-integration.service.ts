import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiIntegrationService {
  private aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl =
      this.configService.get('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  async generateContent(prompt: { text: string; type: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/generate`, prompt),
      );
      return response.data;
    } catch (error) {
      // Fallback mock response
      return {
        content: 'AI-generated content based on your prompt...',
        suggestions: ['hashtag1', 'hashtag2'],
      };
    }
  }

  async analyzeSentiment(text: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/sentiment`, { text }),
      );
      return response.data;
    } catch (error) {
      // Fallback mock response
      return {
        sentiment: 'positive',
        score: 0.85,
        confidence: 0.92,
      };
    }
  }

  async suggestHashtags(text: string, count: number = 5) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/hashtags`, {
          text,
          count,
        }),
      );
      return response.data;
    } catch (error) {
      // Fallback mock response
      return {
        hashtags: [
          '#university',
          '#education',
          '#students',
          '#campus',
          '#learning',
        ].slice(0, count),
      };
    }
  }

  async optimizeTiming(data: { platform: string; contentType: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/timing`, data),
      );
      return response.data;
    } catch (error) {
      // Fallback mock response
      return {
        bestTimes: [
          { day: 'Monday', hour: 9, score: 0.92 },
          { day: 'Wednesday', hour: 18, score: 0.88 },
          { day: 'Friday', hour: 12, score: 0.85 },
        ],
      };
    }
  }

  async generateImage(prompt: { text: string; style?: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/image`, prompt),
      );
      return response.data;
    } catch (error) {
      // Fallback mock response
      return {
        imageUrl: 'https://via.placeholder.com/800x600',
        prompt: prompt.text,
      };
    }
  }
}
