import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AiIntegrationService } from './ai-integration.service';

@Controller('ai')
export class AiIntegrationController {
  constructor(private readonly aiIntegrationService: AiIntegrationService) {}

  @Post('generate-content')
  generateContent(@Body() prompt: { text: string; type: string }) {
    return this.aiIntegrationService.generateContent(prompt);
  }

  @Post('analyze-sentiment')
  analyzeSentiment(@Body() data: { text: string }) {
    return this.aiIntegrationService.analyzeSentiment(data.text);
  }

  @Post('suggest-hashtags')
  suggestHashtags(@Body() data: { text: string; count?: number }) {
    return this.aiIntegrationService.suggestHashtags(data.text, data.count);
  }

  @Post('optimize-timing')
  optimizeTiming(@Body() data: { platform: string; contentType: string }) {
    return this.aiIntegrationService.optimizeTiming(data);
  }

  @Post('generate-image')
  generateImage(@Body() prompt: { text: string; style?: string }) {
    return this.aiIntegrationService.generateImage(prompt);
  }
}
