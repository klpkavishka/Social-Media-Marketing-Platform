import { Injectable, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { HashtagPredictionDto, CaptionResultDto } from './dto';

@Injectable()
export class HashtagsService {
  private readonly logger = new Logger(HashtagsService.name);
  private readonly ai: AxiosInstance;

  constructor(private config: ConfigService) {
    this.ai = axios.create({
      baseURL: this.config.get('AI_SERVICE_URL', 'http://localhost:8000'),
      timeout: 60_000, // Increased timeout for OpenRouter API calls
    });
  }

  /**
   * Stage 1: ML Model prediction — classifies image and generates hashtags + basic caption
   */
  async predict(file: Express.Multer.File): Promise<HashtagPredictionDto> {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid type: ${file.mimetype}`);
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename:    file.originalname,
      contentType: file.mimetype,
    });

    try {
      this.logger.log(`📤 [Stage 1] Sending file to AI service: ${file.originalname} (${file.size} bytes)`);
      this.logger.debug(`🔗 AI Service URL: ${this.config.get('AI_SERVICE_URL')}`);
      
      const { data } = await this.ai.post('/predict', form, {
        headers: form.getHeaders(),
      });
      
      this.logger.log(`✅ [Stage 1] ML prediction: ${data.category} (${data.confidence}%) in ${data.processing_ms}ms`);
      return data;
    } catch (err) {
      this.logger.error(`❌ [Stage 1] ML prediction failed:`, err instanceof Error ? err.message : err);
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const detail = err.response.data?.detail || err.response.data?.error || 'Invalid image';
          throw new BadRequestException(detail);
        }
        
        if (err.response?.status === 500) {
          const errorMsg = err.response.data?.detail || err.response.data?.error || 'Internal server error';
          throw new ServiceUnavailableException(`AI service error: ${errorMsg}`);
        }
        
        throw new ServiceUnavailableException(`AI service error: ${err.response?.statusText || 'Unknown error'}`);
      }
      
      if (err instanceof Error) {
        throw new ServiceUnavailableException(`Failed to connect to AI service: ${err.message}`);
      }
      
      throw new ServiceUnavailableException('AI service unavailable');
    }
  }

  /**
   * Stage 2: AI-enhanced caption — sends image + ML results + tone to OpenRouter API
   */
  async generateCaption(
    file: Express.Multer.File,
    tone: string,
    hashtags: string,
    category: string,
  ): Promise<CaptionResultDto> {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid type: ${file.mimetype}`);
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename:    file.originalname,
      contentType: file.mimetype,
    });
    form.append('tone', tone || 'chill');
    form.append('hashtags', hashtags || '');
    form.append('category', category || '');

    try {
      this.logger.log(`✨ [Stage 2] Enhancing caption: tone=${tone}, category=${category}`);

      const { data } = await this.ai.post('/generate-caption', form, {
        headers: form.getHeaders(),
      });

      this.logger.log(`✅ [Stage 2] Enhanced caption generated (${data.tone} tone, model: ${data.model_used})`);
      return data;
    } catch (err) {
      this.logger.error(`❌ [Stage 2] Caption enhancement failed:`, err instanceof Error ? err.message : err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const detail = err.response.data?.detail || err.response.data?.error || 'Invalid request';
          throw new BadRequestException(detail);
        }

        if (err.response?.status === 503) {
          const detail = err.response.data?.detail || 'OpenRouter API not configured';
          throw new ServiceUnavailableException(detail);
        }

        const errorMsg = err.response?.data?.detail || err.response?.statusText || 'Unknown error';
        throw new ServiceUnavailableException(`AI caption service error: ${errorMsg}`);
      }

      if (err instanceof Error) {
        throw new ServiceUnavailableException(`Failed to connect to AI service: ${err.message}`);
      }

      throw new ServiceUnavailableException('AI caption service unavailable');
    }
  }
}
